import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import flatpickr from "flatpickr";

export default forwardRef((props, ref) => {
  const [date, setDate] = useState(null);
  const [picker, setPicker] = useState(null);
  const refInput = useRef();

  //*********************************************************************************
  //          LINKING THE UI, THE STATE AND AG-GRID
  //*********************************************************************************

  const onDateChanged = (selectedDates) => {
    setDate(selectedDates[0]);
    if (props.onDateChanged) props.onDateChanged();
  };

  useEffect(() => {
    setPicker(
      flatpickr(refInput.current, {
        onChange: onDateChanged,
        dateFormat: "d/m/Y",
        wrap: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picker) {
      picker.input.classList.add("ag-custom-component-popup");
    }
  }, [picker]);

  useEffect(() => {
    //Callback after the state is set. This is where we tell ag-grid that the date has changed so
    //it will proceed with the filtering and we can then expect AG Grid to call us back to getDate
    if (picker) {
      picker.setDate(date);
    }
  }, [date, picker]);

  useImperativeHandle(ref, () => ({
    //*********************************************************************************
    //          METHODS REQUIRED BY AG-GRID
    //*********************************************************************************
    getDate() {
      //ag-grid will call us here when in need to check what the current date value is hold by this
      //component.
      return date;
    },

    setDate(date) {
      //ag-grid will call us here when it needs this component to update the date that it holds.
      setDate(date);
    },

    //*********************************************************************************
    //          AG-GRID OPTIONAL METHODS
    //*********************************************************************************

    setInputPlaceholder(placeholder) {
      if (refInput.current) {
        refInput.current.setAttribute("placeholder", placeholder);
      }
    },

    setInputAriaLabel(label) {
      if (refInput.current) {
        refInput.current.setAttribute("aria-label", label);
      }
    },
  }));

  // inlining styles to make simpler the component
  return (
    <input
      type="text"
      ref={refInput}
      className="ag-input"
      data-input
      value={props.value}
      style={{ height: "inherit" }}
    />
  );
});
