import { Popup } from "semantic-ui-react";
import React from "react";


function MyPopup({ content, children, position }) {
    return <Popup basic inverted content={content} size="tiny" trigger={children} position={position} />;
}

export default MyPopup;