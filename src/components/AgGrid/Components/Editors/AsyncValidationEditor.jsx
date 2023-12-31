import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useDebounce } from '../../utils';
import './AsyncValidationEditor.css';

export default forwardRef((props, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [valid, setValid] = useState(true);
    const [validating, setValidating] = useState(false);
    const [touched, setTouched] = useState(false);

    const debouncedInputVal = useDebounce(inputValue, 1000);

    function inputHandler(e) {
        setTouched(true);
        setInputValue(e.target.value);
        setValidating(true);
    }

    useEffect(() => {
        // random time between 0 and 1000ms
        let timeout = Math.floor(Math.random() * 1000);

        new Promise((resolve, reject) => {
            if (inputValue === '') {
                resolve(false);
            } else {
                setTimeout(() => {
                    resolve(props.condition(inputValue));
                }, timeout);
            }
        })
            .then(valid => {
                setValid(valid);
                setValidating(false)
            })
            .catch(err => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedInputVal]);

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return inputValue;
            },
            afterGuiAttached: () => {
                setInputValue(props.value);
            },
            isCancelAfterEnd: () => {
                return !valid || validating;
            },
        };
    });

    let loadingElement = null;
    let txtColor = null;

    if (valid) {
        txtColor = 'black'
        loadingElement = <span className="success">✔</span>
    } else {
        txtColor = '#E91E63';
        loadingElement = <span className="fail">✘</span>
    }

    if (validating) {
        txtColor = 'gray';
        loadingElement = <span className="loading"></span>
    }

    if (!touched) {
        txtColor = 'black';
        loadingElement = null;
    }

    return (
        <div className="async-validation-container">
            <input
                type="text"
                className="ag-input-field-input ag-text-field-input"
                style={{ color: txtColor }}
                onChange={inputHandler}
                value={inputValue}
                placeholder={'Enter ' + props.column.colId}
            />
            {loadingElement}
        </div>
    )
})
