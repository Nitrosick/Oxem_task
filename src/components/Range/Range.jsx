import { useState } from 'react';
import './Range.css';

export const Range = ( props ) => {
    const [progress, setProgress] = useState(100 / (props.max - props.min) * (props.value - props.min));

    const handleChange = (val) => {
        if (val > props.max) {
            setProgress(100);
        } else if (val < props.min) {
            setProgress(0);
        } else {
            setProgress(100 / (props.max - props.min) * (val - props.min));
        }

        props.setValue(Math.round(val));
    };

    return (
        <section className={ `range ${props.disabled ? 'disabled' : ''}` }>
            <h2 className="subtitle">{props.title}</h2>

            <div className="range_box">
                <input
                    type="number"
                    name={ props.type + '_value' }
                    id={ props.type + '_value' }
                    value={props.value}
                    className="range_value"
                    min={props.min}
                    max={props.max}
                    disabled={props.disabled}
                    onChange={(e) => { handleChange(e.target.value) }}
                />

                <span className="range_measure">{props.measure}</span>

                <input
                    type="range"
                    name={props.type}
                    id={props.type}
                    className="range_input"
                    min={props.min}
                    max={props.max}
                    value={props.value}
                    disabled={props.disabled}
                    onChange={(e) => { handleChange(e.target.value) }}
                />
                <div className="range_input_progress">
                    <div
                        className="line"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </section>
    );
};
