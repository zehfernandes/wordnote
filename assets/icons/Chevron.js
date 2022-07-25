import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Chevron({ width, height, fill, ...props }) {
  return (
    <Svg
      width={width ? width : 15}
      height={height ? height : 15}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <Path
        d="M6.158 3.135a.5.5 0 01.707.023l3.75 4a.5.5 0 010 .684l-3.75 4a.5.5 0 11-.73-.684L9.566 7.5l-3.43-3.658a.5.5 0 01.023-.707z"
        fill={fill ? fill : "#000"}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default Chevron;
