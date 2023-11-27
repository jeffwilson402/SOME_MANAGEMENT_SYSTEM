import React, { useState, forwardRef, useImperativeHandle } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


export default forwardRef((props, ref) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    function handleDateChange(d) {
        if (d) {
            d.setHours(0, 0, 0, 0);
        }
        setSelectedDate(d);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                if (selectedDate) {
                    return format(selectedDate, 'yyyy-MM-dd');
                }
                return props.value
            },
            isCancelAfterEnd: () => {
                return !selectedDate;
            },
            afterGuiAttached: () => {
                if (!props.value) {
                    return;
                }
                let selectedDate = new Date(props.value.split('-')[0], props.value.split('-')[1]-1, props.value.split('-')[2]);
                setSelectedDate(selectedDate);
            }
        };
    });

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                style={{ width: '100%', margin: 0, padding: '6px 10px', }}
                margin="normal"
                id="date-picker-dialog"
                format="dd/MM/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                variant="inline"
                disableToolbar
                placeholder={'Enter ' + props.column.colId}
            />
        </MuiPickersUtilsProvider>
    )
});
