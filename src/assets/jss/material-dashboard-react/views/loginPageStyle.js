
import {
    container,
    cardTitle,
    whiteColor,
    grayColor
  } from "assets/jss/material-dashboard-react.js";
  
  const loginPageStyle = theme => ({
    container: {
      ...container,
      zIndex: "4",
      [theme.breakpoints.down("sm")]: {
        paddingBottom: "100px"
      }
    },
    cardTitle: {
      ...cardTitle,
      color: whiteColor
    },
    textCenter: {
      textAlign: "center"
    },
    justifyContentCenter: {
      justifyContent: "center !important",
      display: 'unset',
    },
    customButtonClass: {
      "&,&:focus,&:hover": {
        color: whiteColor
      },
      marginLeft: "5px",
      marginRight: "5px"
    },
    inputAdornment: {
      marginRight: "18px"
    },
    inputAdornmentIcon: {
      color: grayColor[6]
    },
    cardHidden: {
      opacity: "0",
      transform: "translate3d(0, -60px, 0)"
    },
    cardHeader: {
      marginBottom: "20px"
    },
    socialLine: {
      padding: "0.9375rem 0"
    },
    forgetPass: {
      cursor: 'pointer',
      textAlign: 'center',
    },
    forgetText: {
      fontSize: 16,
      textDecoration: 'underline',
    }
  });
  
  export default loginPageStyle;