import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";

import CardBody from "components/Card/CardBody";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    minWidth: 400
  },
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
}));

export default function TransitionsModal(props) {
  const { children, open, onClose, title, icon, disableBackdropClick, styleProps } = props;

  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableBackdropClick={disableBackdropClick}
    >
      <div className={classes.paper} style={styleProps}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="primary">{icon}</CardIcon>
            <h4 className={classes.cardIconTitle}>{title}</h4>
          </CardHeader>
          <CardBody>{children}</CardBody>
        </Card>
      </div>
    </Modal>
  );
}
