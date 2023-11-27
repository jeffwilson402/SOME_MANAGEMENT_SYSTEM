import React, { useState, forwardRef, useImperativeHandle, useEffect, useMemo } from "react";
import { RiskType } from "util/RiskData";


export default forwardRef((props, ref) => {
    const { data, colDef } = props;
    if (!data.riskType) {
        props.node.setDataValue('riskType', 'Technology')
    }
    const [value, setValue] = useState();
    const [type, setType] = useState(data.riskType);
    // console.log(data.riskType, colDef.field)
    function onChangeHandler(e) {
        setValue(e.target.value);
        props.node.setDataValue(props.colDef.field, e.target.value)
        if (colDef.field === 'riskType') {
            const selectedCategory = props.data.subCategory;
            const allowedCategories = RiskType[e.target.value];
            const categoryMismatch = allowedCategories.indexOf(selectedCategory) < 0;
            if (categoryMismatch) {
                props.node.setDataValue("subCategory", allowedCategories[0]);

                const startEvent = new CustomEvent('refreshGrid', {
                    detail: { type: e.target.value }
                });

                document.dispatchEvent(startEvent)
            }
        }
    }

    const handleRefeshGrid = (e) => {
        if (props.colDef.field === 'subCategory') {
            setType(e.detail.type)
        }
    }

    const options = useMemo(() => {
        if (colDef.field === 'riskType') {
            return Object.keys(RiskType)
        } else if (colDef.field === 'subCategory') {
            return RiskType[type]
        }
        return []
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])

    useEffect(() => {
        document.addEventListener("refreshGrid", handleRefeshGrid)
        return () => document.removeEventListener('refreshGrid', handleRefeshGrid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.value || '')
            }
        };
    });

    useEffect(() => {
        if (colDef.field === 'subCategory' && !options?.includes(value)) {
            setValue(props.value ? props.value : options?.length ? options[0] : null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options])

    return (
        <select value={value} onChange={onChangeHandler} style={{ width: '100%', height: props.cellHeight, border: '1px solid #fff' }} >
            {options?.map(item => (<option key={`${data.id}-${item}`} value={item}>{item}</option>))}
        </select>
    );
})