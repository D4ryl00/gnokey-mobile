import * as React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

function Gnod(props: SvgProps) {
  return (
    <Svg width={props.width || 16} height={props.height || 18} viewBox="0 0 35.973949 45.630001" {...props}>
      <Path
        d="M146.209 268.859c-.86-1.062-1.3-6.509-.891-11.039.323-3.59 1.521-9.358 2.175-10.471.41-.698.78-.89 4.564-2.371 3.675-1.439 4.18-1.58 4.701-1.32 1.172.583 1.214 1.552.173 3.958l-.97 2.24 2.838 2.576c3.133 2.843 5.556 5.793 6.442 7.842.474 1.058.477 1.457-.2 1.73-.556.283-1.051.302-1.745.067-2.33-.789-6.84-.007-10.062 1.744-2.138 1.162-4.027 2.776-4.702 4.016-.6 1.104-1.824 1.645-2.323 1.028zm3.725-3.784c1.232-1.05 1.808-1.618 4.9-2.828 4.035-1.58 5.843-1.62 8.45-1.039.813.181 1.516.243 1.562.138.42-.963-4.219-6.518-7.989-9.564-1.029-.832-1.88-1.535-1.89-1.562-.01-.027.485-1.222 1.1-2.656.977-2.27 1.062-2.657.665-2.996-.427-.364-.71-.29-4.362 1.14-3.362 1.316-3.954 1.617-4.248 2.16-.589 1.088-1.832 7.446-2.079 10.633-.314 4.049.108 9.296.787 9.807.159.119.534-.234.97-.913.39-.608 1.35-1.652 2.134-2.32z"
        transform="translate(-132.712 -242.952)"
        fill="#000"
        stroke="#010101"
        strokeWidth={1.2}
        strokeDasharray="none"
        strokeOpacity={1}
      />
      <Path
        d="M159.006 281.001c-3.816-.867-6.94-1.712-7.665-2.073-1.915-.955-3.535-3.55-3.659-5.862-.063-1.187 1.112-3.796 1.838-4.08.434-.17.561-.036.984 1.044.677 1.73 1.078 1.645 2.993-.632 1.398-1.663 1.744-1.935 3.17-2.493 1.426-.558 1.874-.594 4.076-.33 2.936.354 3.362.094 2.684-1.637-.604-1.543-.027-1.789 2.057-.876 2.268.994 3.408 2.56 3.662 5.029.204 1.994-.328 3.361-2.73 7.006-3.847 5.84-3.704 5.746-7.41 4.904zm6.231-4.59c1.415-2.149 2.684-4.212 2.82-4.584.722-1.964.212-4.67-1.137-6.039-.358-.363-1.202-.884-1.875-1.16l-1.224-.5.398 1.017c.448 1.146.218 1.98-.64 2.315-.31.122-1.546.071-2.744-.112-3.524-.538-4.865.058-7.3 3.248-.476.624-1.141 1.242-1.478 1.374-.903.354-1.813-.2-2.096-1.276-.203-.772-.279-.841-.562-.51-.936 1.098-1.169 3.47-.506 5.156.474 1.206 2.305 2.744 3.856 3.24 3.312 1.056 8.677 2.199 9.28 1.975.419-.155 1.514-1.569 3.208-4.143z"
        transform="translate(-132.712 -242.952)"
        fill="gray"
        fillOpacity={1}
        stroke="gray"
        strokeWidth={1.2}
        strokeDasharray="none"
        strokeOpacity={1}
      />
      <Path
        d="M141.183 267.648c-.637 0-1.149.648-1.149 1.452v6.685h-5.14a1.18 1.18 0 00-1.182 1.182V287.5a1.18 1.18 0 001.181 1.182h6.341a1.18 1.18 0 001.182-1.182v-18.4c0-.804-.597-1.452-1.233-1.452z"
        transform="translate(-132.712 -242.952)"
        fill="none"
        fillOpacity={1}
        stroke="gray"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="none"
        strokeOpacity={1}
      />
    </Svg>
  )
}

export default Gnod
