import { Backdrop, CircularProgress } from "@material-ui/core";
import React, { useContext } from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const BackdropContext = React.createContext();
// let fetching;
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: "#fff",
  },
}));

export function useBackdrop() {
  return useContext(BackdropContext);
}

export default function BackdropProvider({ children }) {
  const [backdrop, setBackdrop] = useState(false);
  const classes = useStyles();

  const fetching = (value) => {
    setBackdrop(value);
  };

  return (
    <BackdropContext.Provider value={fetching}>
      <Backdrop className={classes.backdrop} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </BackdropContext.Provider>
  );
}
