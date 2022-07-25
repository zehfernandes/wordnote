import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Add({ width, height, fill, ...props }) {
  return (
    <Svg
      width={width ? width : 15}
      height={height ? height : 15}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <Path
        d="M8 2.75a.5.5 0 00-1 0V7H2.75a.5.5 0 000 1H7v4.25a.5.5 0 001 0V8h4.25a.5.5 0 000-1H8V2.75z"
        fill={fill ? fill : "#000"}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default Add;
