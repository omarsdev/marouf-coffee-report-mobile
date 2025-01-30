import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function MenuIcon(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path d="M0 0h40v5H0V0zm0 17.5h40v5H0v-5zM0 35h40v5H0v-5z" fill="#000" />
    </Svg>
  );
}

export default MenuIcon;
