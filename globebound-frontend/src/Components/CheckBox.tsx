import React from 'react';

interface CheckBoxProps{
    id: string;
    text: string;
}

function CheckBox({id, text}: CheckBoxProps) {
    return (
        <div>
            <span className={'me-2'}>
                <input type="checkbox" className="form-check-input" id={id}/>
            </span>
            <span className={'me-2'}>
                {text}
            </span>
        </div>
    );
}

export default CheckBox;