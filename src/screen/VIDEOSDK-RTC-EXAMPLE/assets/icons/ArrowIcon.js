import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg width={18.882} height={18.844} viewBox="0 0 24 24" {...props}>
            <Path
                d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
                fill="#FFFFFF"
            />
        </Svg>
    )
}

export default SvgComponent
