import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// material-ui icons
import MailOutline from "@material-ui/icons/MailOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import SimpleModal from "components/Modal";
import CustomInput from "components/CustomInput/CustomInput";
import Datetime from "react-datetime";
import { Companies, Risks, Roles } from "../../models";
import { FormControl, Grid, InputLabel } from "@material-ui/core";
import CustomMenu from "components/CustomMenu/CustomMenu";
import { RiskType, StatusType } from "util/RiskData";
import { Probability } from "util/RiskData";
import { Impact } from "util/RiskData";
import moment from "moment";
import { StatusLabels } from "util/RiskData";
import { useAuth } from "util/use-auth";
import { Cookies } from "react-cookie";
import { DataStore } from "aws-amplify";

const useStyles = makeStyles((theme) => ({
  ...styles,
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const dateFormat = "YYYY-MM-DD";

const defaultRisk: Risks = {
  status: "New",
  riskType: "",
  subCategory: "",
  title: "",
  riskDescription: "",
  dateRaised: "",
  dateClosed: "",
  probability: "",
  impact: "",
  owner: "",
  actions: "",
  actionDueDate: moment().format(dateFormat),
  actionOwner: "",
  comments: "",
};

export default function AddModal(props) {
  const classes = useStyles();
  
  const {authUser} = useAuth();
  const [risk, setRisk] = useState(defaultRisk);
  const [companies, setCompanies] = useState([]);
  const { alert, setAlert, customers, onSubmit, selectedRowData } = props;
  const companyId = new Cookies().get("companyId");
  const onCancel = () => {
    setAlert(false);
  };

  const entriesSubmit = () => {
      onSubmit(risk);
  };

  const getCompanies = async () => {
    const records = await DataStore.query(Companies);
    setCompanies(
      records.map(record => {
        return {
          label: record.name,
          value: record.id
        }
      })
    )

    if(!risk.companiesID) {
      setRisk({
        ...risk, 
        companiesID: records[0]?.id
      })
    }
  }
  
  useEffect(() => {
    if (selectedRowData[0]) {
      setRisk({
        ...risk,
        id: selectedRowData[0].id,
        riskId: selectedRowData[0].riskId,
        riskType: selectedRowData[0].riskType,
        subCategory: selectedRowData[0].subCategory,
        title: selectedRowData[0].title,
        riskDescription: selectedRowData[0].riskDescription,
        probability: selectedRowData[0].probability,
        impact: selectedRowData[0].impact,
        actions: selectedRowData[0].actions[0]?.Action,
        actionDueDate: selectedRowData[0].actions[0]?.ActionDueDate,
        top10: selectedRowData[0].top10 ? selectedRowData[0].top10 : "",
        status: StatusType.find((ele) => ele.value === selectedRowData[0].status)?.label,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowData[0]])

  useEffect(() =>{ 
    if(authUser.id) {
      if(authUser.role === Roles.SUPER_ADMIN) {
        getCompanies()
      }
      setRisk({
        ...risk,
        owner: authUser.id,
        companiesID: companyId
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser])

  return (
    <SimpleModal
      open={alert}
      title={"New Entry"}
      icon={<MailOutline />}
      disableBackdropClick
      styleProps={{
        width: "50%",
      }}
    >
      <GridContainer>
        <GridItem xs={12}>

        {authUser.role === Roles.SUPER_ADMIN && (<CustomMenu
            label="Choose Company (required)"
            value={risk.companiesID}
            controlled
            disabled={authUser.role !== Roles.SUPER_ADMIN}
            onChange={(value) => {
              setRisk({ ...risk, companiesID: value });
            }}
            items={companies}
          />)}
        </GridItem>
        <GridItem xs={4} key="1">
          <CustomMenu
            label="Choose Status (required)"
            value={risk.status}
            controlled
            disabled
            onChange={(value) => {
              setRisk({ ...risk, status: value });
            }}
            items={[StatusLabels[0]]}
          />
        </GridItem>

        <GridItem xs={4}>
          <CustomMenu
            label="Choose Risk Type (required)"
            value={risk.riskType}
            controlled
            onChange={(value) => {
              setRisk({ ...risk, riskType: value, subCategory: "" });
            }}
            items={Object.keys(RiskType)}
          />
        </GridItem>

        <GridItem xs={4}>
          <CustomMenu
            label="Choose Sub Category (required)"
            value={risk.subCategory}
            controlled
            onChange={(value) => {
              setRisk({ ...risk, subCategory: value });
            }}
            items={risk.riskType ? RiskType[risk.riskType] : []}
          />
        </GridItem>

        <GridItem xs={6}>
          <CustomInput
            labelText="Title"
            id="title"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              value: risk.title,
              onChange: (e) => setRisk({ ...risk, title: e.target.value }),
            }}
          />
        </GridItem>

        <GridItem xs={6}>
          <CustomInput
            labelText="Description"
            id="description"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              multiline: true,
              rows: 1,
              value: risk.riskDescription,
              onChange: (e) =>
                setRisk({ ...risk, riskDescription: e.target.value }),
            }}
          />
        </GridItem>

        <GridItem xs={6}>
          <CustomMenu
            label="Choose Probability"
            value={risk.probability}
            controlled
            onChange={(value) => {
              setRisk({ ...risk, probability: value });
            }}
            items={Probability.map((item, index) => {
              return { label: item, value: index + 1 };
            })}
          />
        </GridItem>

        <GridItem xs={6}>
          <CustomMenu
            label="Choose Impact"
            value={risk.impact}
            controlled
            onChange={(value) => {
              setRisk({ ...risk, impact: value });
            }}
            items={Impact.map((item, index) => {
              return { label: item, value: index + 1 };
            })}
          />
        </GridItem>

        <GridItem xs={4}>
          <CustomMenu
            label="Choose Owner"
            value={risk.owner}
            controlled
            disabled
            onChange={(value) => {
              setRisk({ ...risk, owner: value });
            }}
            items={customers}
          />
        </GridItem>

        <GridItem xs={4}>
          <CustomInput
            labelText="Action"
            id="action"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              value: risk.actions,
              multiline: true,
              rows: 1,
              onChange: (e) => setRisk({ ...risk, actions: e.target.value }),
            }}
          />
        </GridItem>
        <GridItem xs={4}>
          <InputLabel className={classes.label}>Date Created</InputLabel>
          <br />
          <FormControl fullWidth>
            <Datetime
              timeFormat={false}
              defaultValue={moment()}
              dateFormat={dateFormat}
              onChange={(e) =>
                setRisk({ ...risk, actionDueDate: e.format(dateFormat) })
              }
              inputProps={{ placeholder: "Date Created Here", disabled: true }}
            />
          </FormControl>
        </GridItem>
        <GridItem xs={12}>
          <CustomInput
            labelText="Comments"
            id="comments"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              multiline: true,
              rows: 3,
              value: risk.comments,
              onChange: (e) => setRisk({ ...risk, comments: e.target.value }),
            }}
          />
        </GridItem>
      </GridContainer>
      <Grid container justify="flex-end">
        <Button color="warning" onClick={entriesSubmit}>
          {"Submit"}
        </Button>
        <Button color="default" onClick={onCancel}>
          Cancel
        </Button>
      </Grid>
    </SimpleModal>
  );
}
