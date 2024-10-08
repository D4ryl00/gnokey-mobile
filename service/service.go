package service

import (
	"context"
	"io"
	"net"
	"net/http"
	"sync"
	"time"

	"connectrpc.com/connect"
	"connectrpc.com/grpchealth"
	"connectrpc.com/grpcreflect"
	api_gen "github.com/gnolang/gnokey-mobile/api/gen/go"
	"github.com/gnolang/gnokey-mobile/api/gen/go/_goconnect"
	gnonative_service "github.com/gnolang/gnonative/service"
	"github.com/pkg/errors"
	"github.com/rs/cors"
	"go.uber.org/zap"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"moul.io/u"
)

type GnokeyMobileService interface {
	GetTcpAddr() string
	GetTcpPort() int

	io.Closer
}

type gnokeyMobileService struct {
	logger           *zap.Logger
	gnoNativeService gnonative_service.GnoNativeService
	tcpAddr          string
	tcpPort          int
	lock             sync.RWMutex

	listeners []net.Listener
	server    *http.Server
	closeFunc func()
}

var _ GnokeyMobileService = (*gnokeyMobileService)(nil)

// NewGnokeyMobileService creates a new GnokeyMobileService service along with a gRPC server listening on TCP.
// Use the gnoNativeService to make direct Go calls through the GnoNativeService interface.
func NewGnokeyMobileService(gnoNativeService gnonative_service.GnoNativeService, opts ...GnokeyMobileOption) (GnokeyMobileService, error) {
	cfg := &Config{}
	if err := cfg.applyOptions(append(opts, WithFallbackDefaults)...); err != nil {
		return nil, err
	}

	svc, err := initService(gnoNativeService, cfg)
	if err != nil {
		return nil, err
	}

	// Use TCP
	if err := svc.createTcpGrpcServer(); err != nil {
		svc.closeFunc()
		return nil, err
	}

	return svc, nil
}

func initService(gnoNativeService gnonative_service.GnoNativeService, cfg *Config) (*gnokeyMobileService, error) {
	svc := &gnokeyMobileService{
		logger:           cfg.Logger,
		gnoNativeService: gnoNativeService,
		tcpAddr:          cfg.TcpAddr,
		closeFunc:        func() {},
	}

	return svc, nil
}

func (s *gnokeyMobileService) createTcpGrpcServer() error {
	s.logger.Debug("createTcpGrpcServer called")

	listener, err := net.Listen("tcp", s.tcpAddr)
	if err != nil {
		s.logger.Debug("createTcpGrpcServer error", zap.Error(err))
		return api_gen.ErrCode_ErrRunGRPCServer.Wrap(err)
	}

	s.lock.Lock()
	s.listeners = append(s.listeners, listener)
	s.lock.Unlock()

	// update the tcpPort field

	addr := listener.Addr().String()

	_, portStr, err := net.SplitHostPort(addr)
	if err != nil {
		s.logger.Debug("createTcpGrpcServer error", zap.Error(err))
		return api_gen.ErrCode_ErrRunGRPCServer.Wrap(err)
	}

	portInt, err := net.LookupPort("tcp", portStr)
	if err != nil {
		s.logger.Debug("createTcpGrpcServer error", zap.Error(err))
		return api_gen.ErrCode_ErrRunGRPCServer.Wrap(err)
	}

	s.tcpPort = portInt

	if err := s.runGRPCServer(listener); err != nil {
		return err
	}

	s.logger.Info("createTcpGrpcServer: gRPC server listens to", zap.Int("port", portInt))

	return nil
}

func newCORS() *cors.Cors {
	// To let web developers play with the demo service from browsers, we need a
	// very permissive CORS setup.
	return cors.New(cors.Options{
		AllowedMethods: []string{
			http.MethodHead,
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
		},
		AllowOriginFunc: func(origin string) bool {
			// Allow all origins, which effectively disables CORS.
			return true
		},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{
			// Content-Type is in the default safelist.
			"Accept",
			"Accept-Encoding",
			"Accept-Post",
			"Connect-Accept-Encoding",
			"Connect-Content-Encoding",
			"Content-Encoding",
			"Grpc-Accept-Encoding",
			"Grpc-Encoding",
			"Grpc-Message",
			"Grpc-Status",
			"Grpc-Status-Details-Bin",
		},
		// Let browsers cache CORS information for longer, which reduces the number
		// of preflight requests. Any changes to ExposedHeaders won't take effect
		// until the cached data expires. FF caps this value at 24h, and modern
		// Chrome caps it at 2h.
		MaxAge: int(2 * time.Hour / time.Second),
	})
}

func (s *gnokeyMobileService) runGRPCServer(listener net.Listener) error {
	mux := http.NewServeMux()

	compress1KB := connect.WithCompressMinBytes(1024)
	mux.Handle(_goconnect.NewGnokeyMobileServiceHandler(
		s,
		compress1KB,
	))
	mux.Handle(grpchealth.NewHandler(
		grpchealth.NewStaticChecker(_goconnect.GnokeyMobileServiceName),
		compress1KB,
	))
	mux.Handle(grpcreflect.NewHandlerV1(
		grpcreflect.NewStaticReflector(_goconnect.GnokeyMobileServiceName),
		compress1KB,
	))
	mux.Handle(grpcreflect.NewHandlerV1Alpha(
		grpcreflect.NewStaticReflector(_goconnect.GnokeyMobileServiceName),
		compress1KB,
	))

	server := &http.Server{
		Handler: h2c.NewHandler(
			newCORS().Handler(mux),
			&http2.Server{},
		),
		ReadHeaderTimeout: time.Second,
		ReadTimeout:       5 * time.Minute,
		WriteTimeout:      5 * time.Minute,
		MaxHeaderBytes:    8 * 1024, // 8KiB
	}

	go func() {
		// we dont need to log the error
		err := s.server.Serve(listener)
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			s.logger.Error("failed to serve the gRPC listener")
		}
	}()

	s.lock.Lock()
	s.server = server
	s.closeFunc = u.CombineFuncs(s.closeFunc, func() {
		if err := server.Shutdown(context.Background()); err != nil {
			s.logger.Error("cannot close the gRPC server", zap.Error(err)) //nolint:gocritic
		}
	})
	s.lock.Unlock()

	return nil
}

func (s *gnokeyMobileService) GetTcpAddr() string {
	return s.tcpAddr
}

func (s *gnokeyMobileService) GetTcpPort() int {
	return s.tcpPort
}

func (s *gnokeyMobileService) Close() error {
	if s.closeFunc != nil {
		s.closeFunc()
	}
	return nil
}
