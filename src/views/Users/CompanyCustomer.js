import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import MailOutline from "@material-ui/icons/MailOutline";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import SimpleModal from "components/Modal";
import CustomInput from "components/CustomInput/CustomInput";
import { DataStore } from "aws-amplify";
import { Companies, Customers, Roles } from "../../models";
import { Grid } from "@material-ui/core";
import CustomMenu from "components/CustomMenu/CustomMenu";
import { createUser } from "util/Api";
import { useAuth } from "util/use-auth";
import { deleteUser } from "util/Api";
import { updateUser } from "util/Api";

const useStyles = makeStyles((theme) => ({
  ...styles,
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const columns = [
  "#",
  "First Name",
  "Last Name",
  "Email",
  "Username",
  "Role",
  "Company",
  "Action",
];

export default function CompanyCustomer() {
  const classes = useStyles();
  const [company, setCompany] = useState({
    name: null,
  });

  const [customer, setCustomer] = useState({
    name: null,
    role: Roles.COMPANY_MEMBER,
  });

  const [companies, setCompanies] = useState([]);

  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);

  const roundButtons = (item) => {
    return [
      { color: "success", icon: Edit, event: () => onEdit(item) },
      { color: "danger", icon: Close, event: () => onDelete(item) },
    ].map((prop, key) => {
      return (
        <Button
          round
          color={prop.color}
          className={classes.actionButton + " " + classes.actionButtonRound}
          key={key}
          onClick={prop.event}
        >
          <prop.icon className={classes.icon} />
        </Button>
      );
    });
  };

  const onEdit = (item) => {
    setCustomer({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      username: item.username,
      role: item.role,
      companiesID: item.companiesID,
    });
    setAlert(true);
  };

  const onDelete = async (item) => {
    const record = await DataStore.query(Customers, item.id);

    await deleteUser({
      email: record.email,
      username: record.username,
      role: record.role,
    });

    await DataStore.delete(record);

    setCompanyData();
  };

  useEffect(() => {
    (async () => {
      await setCompanyData();
    })();
  }, []);

  useEffect(() => {
    getCustomers();
  }, [companies]);
  const { authUser } = useAuth();

  const getCustomers = async () => {
    let queryFunc = null;
    if (authUser.role === Roles.SUPER_ADMIN) {
      queryFunc = (c) => c.role("eq", Roles.COMPANY_MEMBER);
    } else if (
      authUser.role === Roles.COMPANY_ADMIN ||
      authUser.role === Roles.COMPANY_MEMBER
    ) {
      queryFunc = (c) =>
        c
          .role("eq", Roles.COMPANY_MEMBER)
          .companiesID("eq", authUser.companiesID);
    } else {
      return;
    }

    const data = await DataStore.query(Customers, queryFunc);
    setData(
      data.map((item, index) => {
        return [
          index + 1,
          item.firstName,
          item.lastName,
          item.email,
          item.username,
          item.role,
          findCompany(item.companiesID)?.name,
          roundButtons(item),
        ];
      })
    );
  };

  const findCompany = (id) => {
    return companies.find((item) => item.id === id);
  };

  const onCancel = () => {
    setAlert(false);
  };

  const setCompanyData = async () => {
    const data = await DataStore.query(Companies);
    setCompanies(data);
  };

  const onSubmit = async () => {
    if (!customer.firstName || !customer.email || !customer.companiesID || !customer.role) {
      window.alert("Please check the required fields");
      return;
    }
    if (!customer.id) {
      const record = await DataStore.query(Customers, (cus) =>
        cus.email("eq", customer.email)
      );
      if (record.length) {
        window.alert("Already Email Exist!");
        return;
      }
      await createUser({
        email: customer.email,
        username: customer.username,
        role: customer.role,
      });
      await DataStore.save(
        new Customers({
          ...customer,
        })
      );
    } else {
      const record = await DataStore.query(Customers, customer.id);

      await updateUser({
        email: customer.email,
        username: customer.username,
        role: customer.role,
      });

      await DataStore.save(
        Customers.copyOf(record, (updated) => {
          updated.companiesID = customer.companiesID;
          updated.firstName = customer.firstName;
          updated.lastName = customer.lastName;
          updated.username = customer.username;
          updated.email = customer.email;
          updated.role = customer.role;
        })
      );
    }

    getCustomers();
    setAlert(false);
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" stats icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>

            <Button
              color="primary"
              size="large"
              onClick={() => {
                setCustomer({
                  role: Roles.COMPANY_MEMBER,
                  companiesID:
                    authUser.role === Roles.SUPER_ADMIN
                      ? ""
                      : authUser.companiesID,
                });
                setAlert(true);
              }}
            >
              Add
            </Button>
            {/* <h4 className={classes.cardIconTitle}>Company Admin</h4> */}
          </CardHeader>
          <CardBody>
            <Table
              tableHead={columns}
              tableData={data}
              customCellClasses={[classes.center, classes.left, classes.right]}
              customClassesForCells={[0, 5]}
              customHeadCellClasses={[
                classes.center,
                classes.left,
                classes.right,
              ]}
              customHeadClassesForCells={[0, 5]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <SimpleModal
        open={alert}
        onClose={onCancel}
        title="New Company"
        icon={<MailOutline />}
        disableBackdropClick
      >
        <GridContainer>
          <GridItem xs={6}>
            <CustomInput
              labelText="First Name"
              id="first_name"
              formControlProps={{
                fullWidth: true,
                required: true,
              }}
              inputProps={{
                type: "text",
                value: customer.firstName,
                onChange: (e) =>
                  setCustomer({ ...customer, firstName: e.target.value }),
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomInput
              labelText="Last Name"
              id="last_name"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: customer.lastName,
                onChange: (e) =>
                  setCustomer({ ...customer, lastName: e.target.value }),
              }}
            />
          </GridItem>
        </GridContainer>

        <CustomInput
          labelText="Email"
          id="email"
          formControlProps={{
            fullWidth: true,
            required: true,
            disabled: !!customer.id,
          }}
          inputProps={{
            type: "email",
            value: customer.email,
            onChange: (e) =>
              setCustomer({ ...customer, email: e.target.value }),
          }}
        />

        <CustomInput
          labelText="Username"
          id="username"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            type: "text",
            value: customer.username,
            onChange: (e) =>
              setCustomer({ ...customer, username: e.target.value }),
          }}
        />

        <GridContainer>
          <GridItem xs={6}>
            <CustomMenu
              label="Choose Role"
              formControlProps={{
                required: true,
              }}
              value={customer.role}
              disabled
              items={Object.values(Roles)}
              onChange={(value) => {
                setCustomer({ ...customer, role: value });
              }}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomMenu
              label="Choose Company"
              value={customer.companiesID}
              // disabled
              items={companies.map((item) => {
                return { value: item.id, label: item.name };
              })}
              disabled={authUser.role !== Roles.SUPER_ADMIN}
              onChange={(value) => {
                setCustomer({ ...customer, companiesID: value });
              }}
              required
            />
          </GridItem>
        </GridContainer>
        <Grid container justify="flex-end">
          <Button color="rose" onClick={onSubmit}>
            Submit
          </Button>
          <Button color="default" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </SimpleModal>
    </GridContainer>
  );
}
