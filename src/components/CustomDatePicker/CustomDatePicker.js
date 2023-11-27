import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Datetime from "react-datetime";
import styles from "assets/jss/material-dashboard-pro-react/components/customInputStyle.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
const useStyles = makeStyles(styles);

export default (props) => {
  const { defaultValue, disabled, onChange, label, required, dateFormat, timeFormat } = props;

  const classes = useStyles();

  return (
    <FormControl
      fullWidth
      className={classes.formControl}
      disabled={disabled}
      required={required}
    >
      <InputLabel htmlFor="simple-select" className={classes.labelRoot}>
        {label}
      </InputLabel>

      <Datetime
        timeFormat={timeFormat}
        defaultValue={defaultValue}
        dateFormat={dateFormat}
        // className={classes.select}
        onChange={onChange}
        // inputProps={{ placeholder: label }}
      />
    </FormControl>
  );
};
