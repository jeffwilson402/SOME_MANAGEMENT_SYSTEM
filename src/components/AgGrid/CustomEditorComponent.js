import React, {
    forwardRef,
    useState,
    useRef,
    useEffect,
    useImperativeHandle
  } from 'react';
  
  import DatePicker from 'react-datepicker';
  
  import 'react-datepicker/dist/react-datepicker.css';
  import moment from 'moment';
  const CustomEditorComponent = forwardRef((props, ref) => {
    const refDatePicker = useRef();
    const date1 = new Date(props.value);
    const [date, setDate] = useState(moment(date1, 'YYYY-MM-DD').toDate());
    const [editing, setEditing] = useState(true);
  
    useEffect(() => {
      if (!editing) {
        props.api.stopEditing();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editing]);
  
    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return moment(date).format('YYYY-MM-DD');
        }
      };
    });
  
    const onChange = selectedDate => {
      setDate(selectedDate);
      setEditing(false);
    };
  
    return (
      <div>
        <DatePicker
          ref={refDatePicker}
          portalId="root"
          popperClassName="ag-custom-component-popup"
          selected={date}
          dateFormat="yyyy-MM-dd"
          onChange={onChange}
        />
      </div>
    );
  });
  
  export default CustomEditorComponent;
  