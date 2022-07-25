import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Audio({ width, height, ...props }) {
  return (
    <Svg
      width={width ? width : 16}
      height={height ? height : 16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5l4-4v14l-4-4H0V5h4zm6-.465c1.196.692 2 1.984 2 3.465 0 1.48-.804 2.773-2 3.465v-6.93zm0 11.273v-2.023a6.044 6.044 0 004.25-5.786c0-2.726-1.79-5.03-4.25-5.785V.19c3.45.895 6 4.051 6 7.808 0 3.756-2.55 6.913-6 7.808v.001z"
        fill="#818181"
      />
    </Svg>
  );
}

export default Audio;
