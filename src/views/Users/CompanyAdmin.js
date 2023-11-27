import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import MailOutline from "@material-ui/icons/MailOutline";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
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
import { DataStore, Predicates } from "aws-amplify";
import { Companies, Customers, Roles, CustomersCompanies } from "../../models";
import { Grid } from "@material-ui/core";
import CustomMenu from "components/CustomMenu/CustomMenu";
import { createUser } from "util/Api";
import { updateUser } from "util/Api";
import { useAuth } from "util/use-auth";
import { deleteUser } from "util/Api";
import { Cookies } from "react-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getRolesData, getRoleLabel } from "util/RiskData";
import { useBackdrop } from "util/use-load";
import * as _ from "lodash";

const MySwal = withReactContent(Swal);

const useStyles = makeStyles((theme) => ({
  ...styles,
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  btnTd: {
    minWidth: "150px",
  },
}));

let columns = [
  "#",
  "First Name",
  "Last Name",
  "Email",
  "Username",
  "Role",
  "Company",
  "Action",
];

export default function CompanyAdmin() {
  const classes = useStyles();
  const [customer, setCustomer] = useState({
    name: null,
  });

  const [userRoles, setUserRoles] = useState([]);

  const [companies, setCompanies] = useState([]);

  const [customerCompany, setCustomerCompany] = useState({});

  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [canDelete, setCanDelete] = useState(true);
  const { authUser } = useAuth();

  const companyId = new Cookies().get("companyId");

  const fetching = useBackdrop();

  const roundButtons = (item) => {
    return [
      { color: "success", icon: Edit, event: () => onEdit(item) },
      { color: "danger", icon: Close, event: () => onDelete(item) },
    ].map((prop, key) => {
      if (!canEdit && key === 0) return [];
      if (!canDelete && key === 1) return [];
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
    const companiesId = [];

    if (customerCompany[item.id]) {
      customerCompany[item.id].forEach((company) => {
        companiesId.push(company.companies.id);
      });
    }

    setCustomer({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      username: item.username,
      role: item.role,
      companiess: companiesId,
    });

    setAlert(true);
  };

  const onDelete = async (item) => {
    const record = await DataStore.query(Customers, item.id);

    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You are about to delete!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#f6a117",
      cancelButtonColor: "#999",
    });

    if (result.value) {
      await deleteUser({
        email: record.email,
        username: record.username,
        role: record.role,
      });

      MySwal.fire({
        title: "Deleted!",
        text: "It is deleted.",
        icon: "success",
        confirmButtonColor: "#f6a117",
        cancelButtonColor: "#999",
      });

      if (customerCompany[item.id]) {
        customerCompany[item.id].forEach(async (element) => {
          await DataStore.delete(CustomersCompanies, element.id);
        });
      }

      await DataStore.save(
        Customers.copyOf(record, (updated) => {
          updated.isArchive = true;
        })
      );

      setCompanyData();
    } else {
      MySwal.fire({
        title: "Cancelled",
        text: "It is safe :)",
        icon: "error",
        confirmButtonColor: "#f6a117",
        cancelButtonColor: "#999",
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (authUser.role !== Roles.SUPER_ADMIN) {
        columns = columns.filter((item) => item !== "Company");
      }
      
      if (authUser.role === Roles.SUPER_ADMIN) {
        setUserRoles(
          getRolesData([
            Roles.SUPER_ADMIN,
            Roles.COMPANY_ADMIN,
            Roles.COMPANY_MEMBER,
            Roles.GUEST,
          ])
        );
      } else if (authUser.role === Roles.COMPANY_ADMIN) {
        setUserRoles(
          getRolesData([Roles.COMPANY_ADMIN, Roles.COMPANY_MEMBER, Roles.GUEST])
        );
      } else if (authUser.role === Roles.COMPANY_MEMBER) {
        setUserRoles(getRolesData([Roles.COMPANY_MEMBER, Roles.GUEST]));
        setCanEdit(false);
        setCanDelete(false);
      } else if (authUser.role === Roles.GUEST) {
        setUserRoles(getRolesData([Roles.GUEST]));
        setCanEdit(false);
        setCanDelete(false);
      }
      await setRelationShip();
      await setCompanyData();
    })();
  }, [authUser]);

  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies, userRoles, customerCompany]);

  const setRelationShip = async () => {
    const results = await DataStore.query(CustomersCompanies, Predicates.ALL);
    const customers = {};
    results.forEach((result) => {
      if (!customers[result.customers.id]) customers[result.customers.id] = [];
      customers[result.customers.id].push(result);
    });

    setCustomerCompany(customers);
  };

  const getCustomers = async () => {
    let queryFunc = null;
    let data = [];
    //const data1 = await DataStore.query(CustomersCompanies, Predicates.ALL);
    if (authUser.role === Roles.SUPER_ADMIN) {
      queryFunc = (c) => c.role("ne", Roles.SUPER_ADMIN).isArchive("ne", true);
      data = await DataStore.query(Customers, queryFunc);
    } else if (
      authUser.role === Roles.COMPANY_ADMIN ||
      authUser.role === Roles.COMPANY_MEMBER
    ) {
      data = (await DataStore.query(CustomersCompanies))
        .filter(
          (item) =>
            item.companies.id === companyId && item.customers.id !== authUser.id
        )
        .map((item) => item.customers)
        .filter((item) => item.isArchive !== true);
    } else {
      return;
    }

    setData(
      data.map((item, index) => {
        if (authUser.role !== Roles.SUPER_ADMIN) {
          return [
            index + 1,
            item.firstName,
            item.lastName,
            item.email,
            item.username,
            getRoleLabel(item.role),
            roundButtons(item),
          ];
        }
        return [
          index + 1,
          item.firstName,
          item.lastName,
          item.email,
          item.username,
          getRoleLabel(item.role),
          findCompany(item.id),
          roundButtons(item),
        ];
      })
    );
  };

  const findCompany = (id) => {
    let str = "";

    if (customerCompany[id]) {
      customerCompany[id].forEach((company, index) => {
        if (index === 0) str += company.companies.name;
        else str += ", " + company.companies.name;
      });
    }

    return str;
  };

  const onCancel = () => {
    setAlert(false);
  };

  const setCompanyData = async () => {
    const data = await DataStore.query(Companies);
    setCompanies(data);
  };

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const onSubmit = async () => {
    // if (!customer.firstName || !customer.email || !customer.companiess) {
    //   window.alert("Please check the required fields");
    //   return;
    // }
    // validation
    if (!customer.firstName) {
      setCustomer({
        ...customer,
        error: {
          ...customer.error,
          firstName: "Must have First Name!",
        },
      });
      return;
    }

    if (!customer.username) {
      setCustomer({
        ...customer,
        error: {
          ...customer.error,
          username: "Must have Username(it will be used in signin)!",
        },
      });
      return;
    }

    if (!customer.email || !validateEmail(customer.email)) {
      setCustomer({
        ...customer,
        error: {
          ...customer.error,
          email: "Invalid Email!",
        },
      });
      return;
    }

    if (!customer.role) {
      setCustomer({
        ...customer,
        error: {
          ...customer.error,
          role: "Must have role!",
        },
      });
      return;
    }

    if (!customer.companiess) {
      setCustomer({
        ...customer,
        error: {
          ...customer.error,
          companies: "Must have one company!",
        },
      });
      return;
    }

    fetching(true);

    if (!customer.id) {
      let queryFunc = (c) =>
        c.isArchive("ne", true).email("eq", customer.email);
      let emailRecord = await DataStore.query(Customers, queryFunc);

      if (emailRecord.length) {
        window.alert("Already Email Exist!");
        fetching(false);
        return;
      }

      const records = await DataStore.query(Customers, (c) =>
        c.username("eq", customer.username)
      );

      if (records.length) {
        window.alert("Already Username Exist!");
        fetching(false);
        return;
      }

      let companyCode = [];
      if (customer.companiess) {
        for (let comId of customer.companiess) {
          const company: Companies = companies.find(
            (company) => company.id === comId
          );
          companyCode.push(company.code);
        }
      }

      await createUser({
        email: customer.email,
        username: customer.username,
        role: customer.role,
        companyCode: companyCode?.join(", "),
        fullName: `${customer.firstName} ${customer.lastName}`,
      });

      const newCustomer = await DataStore.save(
        new Customers({
          ...customer,
        })
      ); 

      if (customer.companiess) {
        for (let comId of customer.companiess) {
          const company = companies.find((company) => company.id === comId);

          await DataStore.save(
            new CustomersCompanies({
              customers: newCustomer,
              companies: company,
            })
          );
        }
      }
    } else {
      let queryFunc = (c) =>
        c.isArchive("ne", true).email("eq", customer.email);
      let emailRecord = await DataStore.query(Customers, queryFunc);
      const record = await DataStore.query(Customers, customer.id);

      if (emailRecord.length && record?.email !== customer?.email) {  
          window.alert("Already Email Exist!");
          fetching(false);
          return;
      }

      await updateUser({
        email: customer.email,
        username: customer.username,
        role: customer.role,
      });

      const newCustomer = await DataStore.save(
        Customers.copyOf(record, (updated) => {
          updated.firstName = customer.firstName;
          updated.lastName = customer.lastName;
          updated.username = customer.username;
          updated.email = customer.email;
          updated.role = customer.role;
        })
      );

      customer.companiess = _.uniqBy(customer.companiess, (val) => val);

      if (customerCompany[customer.id]) {
        for (let item of customerCompany[customer.id]) {
          await DataStore.delete(CustomersCompanies, item.id);
        }
      }

      if (customer.companiess) {
        for (let comId of customer.companiess) {
          const company = companies.find((company) => company.id === comId);

          await DataStore.save(
            new CustomersCompanies({
              customers: newCustomer,
              companies: company,
            })
          );
        }
      }
    }
    fetching(false);
    setRelationShip();
    setAlert(false);
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" stats icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
            {(authUser.role === Roles.SUPER_ADMIN ||
              authUser.role === Roles.COMPANY_ADMIN) && (
              <Button
                color="primary"
                size="lg"
                onClick={() => {
                  setCustomer({
                    companiess:
                      authUser.role === Roles.SUPER_ADMIN ? [] : [companyId],
                  });
                  setAlert(true);
                }}
              >
                Add
              </Button>
            )}

            {/* <h4 className={classes.cardIconTitle}>Company Admin</h4> */}
          </CardHeader>
          <CardBody>
            <Table
              tableHead={columns}
              tableData={data}
              customCellClasses={[classes.right]}
              customClassesForCells={[7]}
              customHeadCellClasses={[classes.btnTd]}
              customHeadClassesForCells={[7]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <SimpleModal
        open={alert}
        onClose={onCancel}
        title={customer.id ? "Edit Customer" : "New Customer"}
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
                  setCustomer({
                    ...customer,
                    firstName: e.target.value,
                    error: {
                      ...customer.error,
                      firstName: "",
                    },
                  }),
              }}
              error={customer.error?.firstName}
              helperText={customer.error?.firstName}
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
            // disabled: !!customer.id,
          }}
          inputProps={{
            type: "email",
            value: customer.email,
            onChange: (e) =>
              setCustomer({
                ...customer,
                email: e.target.value,
                error: {
                  ...customer.error,
                  email: "",
                },
              }),
          }}
          error={customer.error?.email}
          helperText={customer.error?.email}
        />

        <CustomInput
          labelText="Username"
          id="username"
          formControlProps={{
            fullWidth: true,
            disabled: !!customer.id,
          }}
          inputProps={{
            type: "text",
            value: customer.username,
            onChange: (e) =>
              setCustomer({
                ...customer,
                username: e.target.value,
                error: { ...customer.error, username: "" },
              }),
          }}
          error={customer.error?.username}
          helperText={customer.error?.username}
        />

        <GridContainer>
          <GridItem xs={6}>
            <CustomMenu
              label="Choose Role"
              value={customer.role}
              // disabled
              onChange={(value) => {
                setCustomer({ ...customer, role: value });
              }}
              required
              error={customer.error?.role}
              helperText={customer.error?.role}
              items={userRoles}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomMenu
              label="Choose Company"
              value={customer.companiess}
              disabled={authUser.role !== Roles.SUPER_ADMIN}
              items={companies.map((item) => {
                return { value: item.id, label: item.name };
              })}
              multiple
              onChange={(value) => {
                setCustomer({
                  ...customer,
                  companiess: value,
                  error: {
                    ...customer.error,
                    companies: null,
                  },
                });
              }}
              required
              error={customer.error?.companies}
              helperText={customer.error?.companies}
            />
          </GridItem>
        </GridContainer>
        <Grid container justify="flex-end">
          <Button color="warning" onClick={onSubmit}>
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
