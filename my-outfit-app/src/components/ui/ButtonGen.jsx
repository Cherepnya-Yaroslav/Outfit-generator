import { useState } from "react";

function ButtonGen(props) {
    return (
        <button
            className="startBtn"
            onClick={props.func}
        >
            {props.text}
        </button>
    );
}

export default ButtonGen;
