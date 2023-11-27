import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
const useStyles = makeStyles(styles);

export default (props) => {
  const {
    items,
    value,
    disabled,
    onChange,
    error,
    helperText,
    label,
    required,
    multiple,
  } = props;

  const classes = useStyles();

  return (
    <FormControl
      fullWidth
      className={classes.selectFormControl}
      disabled={disabled}
      required={required}
      error={error}
    >
      <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{ className: classes.selectMenu }}
        classes={{ select: classes.select }}
        inputProps={{
          name: "simpleSelect",
          id: "simple-select",
        }}
        multiple={multiple}
      >
        <MenuItem
          disabled
          classes={{
            root: classes.selectMenuItem,
          }}
        >
          {label}
        </MenuItem>
        {items?.map((item, index) => (
          <MenuItem
            key={`${item.value}-${index}`}
            classes={{
              root: classes.selectMenuItem,
              selected: classes.selectMenuItemSelectedMultiple,
            }}
            value={typeof item === "object" ? item.value : item}
          >
            {typeof item === "object" ? item.label : item}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
