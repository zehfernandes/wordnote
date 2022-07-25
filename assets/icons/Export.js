import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Export({ width, height, fill, ...props }) {
  return (
    <Svg
      width={width ? width : 15}
      height={height ? height : 15}
      viewBox="0 0 15 15"
      fill="none"
      {...props}
    >
      <Path
        d="M3.5 5a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-6a.5.5 0 00-.5-.5h-1.25a.5.5 0 010-1h1.25A1.5 1.5 0 0113 5.5v6a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 012 11.5v-6A1.5 1.5 0 013.5 4h1.25a.5.5 0 010 1H3.5zM7 1.636L5.568 3.068a.45.45 0 01-.636-.636l2.25-2.25a.45.45 0 01.636 0l2.25 2.25a.45.45 0 01-.636.636L8 1.636V8.5a.5.5 0 01-1 0V1.636z"
        fill={fill ? fill : "#000"}
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default Export;
