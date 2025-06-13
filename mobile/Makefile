check-program = $(foreach exec,$(1),$(if $(shell PATH="$(PATH)" which $(exec)),,$(error "Missing deps: no '$(exec)' in PATH")))

node_modules: package.json package-lock.json
	$(call check-program, npm)
	(npm install && touch $@) || true
.PHONY: node_modules

ts_check:
	npm run ts:check

ios: node_modules ts_check # Run the iOS app
	npx expo run:ios
.PHONY: ios

ios.release: node_modules ts_check # Run the iOS app in release mode
	npx expo run:ios --configuration Release
.PHONY: ios.release

android: node_modules ts_check # Run the Android app
	npx expo run:android
.PHONY: android

android.reverse:
	$(call check-program, adb)
	$(if $(ANDROID_DEVICE),,$(eval ANDROID_DEVICE = $(shell adb devices | tail +2 | head -1 | cut -f 1)))
	@if [ -z "$(ANDROID_DEVICE)" ]; then \
	  >&2 echo "ERROR: no Android device found"; exit 1; \
	fi
	adb -s $(ANDROID_DEVICE) reverse tcp:8081 tcp:8081 # metro
	adb -s $(ANDROID_DEVICE) reverse tcp:26657 tcp:26657 # gnodev
	adb -s $(ANDROID_DEVICE) reverse tcp:5050 tcp:5050 # faucet
	adb -s $(ANDROID_DEVICE) reverse tcp:8546 tcp:8546 # tx-indexer
	adb -s $(ANDROID_DEVICE) reverse tcp:26660 tcp:26660 # indexer
.PHONY: android.reverse

start: node_modules
	npm run start
.PHONY: start

# - asdf

asdf.add_plugins:
	$(call check-program, asdf)
	@echo "Installing asdf plugins..."
	@set -e; \
	for PLUGIN in $$(cut -d' ' -f1 .tool-versions | grep "^[^\#]"); do \
		asdf plugin add $$PLUGIN || [ $$?==2 ] || exit 1; \
	done

asdf.install_tools: asdf.add_plugins
	$(call check-program, asdf)
	@echo "Installing asdf tools..."
	@asdf install

clean:
	$(call check-program, npm)

	# React-Native cmd
	npm cache clean --force

# React-Native files
	rm -rf .tmp
	rm -rf node_modules
	rm -rf /tmp/react-native-packager-cache-*
	rm -rf /tmp/metro-bundler-cache-*
	rm -rf .eslintcache

	# Android files
	rm -rf android

	# iOS files
	rm -rf ios

.PHONY: clean

clean_install: clean node_modules
	cd ios && pod install
.PHONY: clean_install

release.ios: node_modules
	npx expo install --check
	npm run ts:check
	eas build --platform ios --profile production
	@echo "iOS build done. Now it's time to run `eas submit --platform ios` or user Transporter https://apps.apple.com/us/app/transporter/id1450874784?mt=12"
.PHONY: release.ios

release.android: node_modules
	eas build --platform android --profile production
.PHONY: elease.android

help:
	@echo "Available make commands:"
	@cat Makefile | grep '^[a-z]' | grep -v '=' | cut -d: -f1 | sort | sed 's/^/  /'
.PHONY: help

