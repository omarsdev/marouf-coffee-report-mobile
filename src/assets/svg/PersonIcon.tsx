import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function PersonIcon(props) {
  return (
    <Svg
      width={20}
      height={27}
      viewBox="0 0 20 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M20 27h-2.5v-2.571c0-2.13-1.679-3.858-3.75-3.858h-7.5c-2.071 0-3.75 1.727-3.75 3.858V27H0v-2.571C0 20.879 2.798 18 6.25 18h7.5c3.452 0 6.25 2.878 6.25 6.429V27zM10 15.429c-4.142 0-7.5-3.454-7.5-7.715C2.5 3.454 5.858 0 10 0c4.142 0 7.5 3.454 7.5 7.714S14.142 15.43 10 15.43zm0-2.572c2.761 0 5-2.302 5-5.143 0-2.84-2.239-5.143-5-5.143S5 4.874 5 7.714s2.239 5.143 5 5.143z"
        fill="#fff"
      />
    </Svg>
  );
}

export default PersonIcon;
