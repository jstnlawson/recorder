import React from 'react';
import './Key.css'


const Key = ({label, onClick}) => {


    return (
        <div>
            <button className="key" onClick={() => onClick(label)}>{label}</button>
        </div>

    )
}

export default Key
