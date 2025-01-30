import * as React from 'react';
import Svg, {G, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function LoginBackgroundIcon(props) {
  return (
    <Svg
      width={800}
      height={715}
      viewBox="0 0 800 715"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G filter="url(#filter0_i_1_5166)">
        <Path
          d="M204.673 35.278C102.991 2.52 25.857 2.73 0 6.93V715h800V0C655.701 40.317 528.66 58.376 483.178 62.366c-50.468 4.62-176.823 5.67-278.505-27.088z"
          fill="#000"
          fillOpacity={0.02}
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default LoginBackgroundIcon;
