import React from "react";
import { Popup } from "semantic-ui-react";

function MyPopup({ content, children, position }) {
    return (
        <Popup
            basic
            inverted
            content={content}
            size="tiny"
            trigger={children}
            position={position}
        />
    );
}

export default MyPopup;
