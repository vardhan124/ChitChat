import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './login_popup.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
function Popup(props) {

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <FontAwesomeIcon className="close-btn" icon={faXmark} onClick={() => props.setTrigger(false)}/>
                {props.children}
            </div>
        </div>
    ) : "";
}
export default Popup;