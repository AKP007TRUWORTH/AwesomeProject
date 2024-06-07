import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg width="18" height="16" viewBox="0 0 18 16" fill="white" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path fill-rule="white" clip-rule="evenodd" d="M9.233 0.454505C9.67233 0.893845 9.67233 1.60616 9.233 2.0455L4.40349 6.875H16.3125C16.9338 6.875 17.4375 7.37868 17.4375 8C17.4375 8.62132 16.9338 9.125 16.3125 9.125H4.40349L9.233 13.9545C9.67233 14.3938 9.67233 15.1062 9.233 15.5455C8.79366 15.9848 8.08134 15.9848 7.642 15.5455L0.892005 8.7955C0.452665 8.35616 0.452665 7.64384 0.892005 7.2045L7.642 0.454505C8.08134 0.015165 8.79366 0.015165 9.233 0.454505Z" fill="white" />
        </Svg>
    )
}

export default SvgComponent
