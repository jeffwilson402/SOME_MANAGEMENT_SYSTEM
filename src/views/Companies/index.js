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
import { DataStore, SortDirection, Predicates } from "aws-amplify";
import { Companies, CustomersCompanies } from "../../models";
import { Grid } from "@material-ui/core";
import { useAuth } from "util/use-auth";
import { Roles } from "models";
import { Cookies } from "react-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { validateEmail, pad, getCapital, initialCompany } from "util/utils";

const MySwal = withReactContent(Swal);

const useStyles = makeStyles((theme) => ({
  ...styles,
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  btnTd: {
    minWidth: '100px'
  }
}));

export default function CompaniesPage() {
  const classes = useStyles();
  const [company, setCompany] = useState(initialCompany);
  const [data, setData] = useState([]);
  const [alert, setAlert] = useState(false);
  const [canAdd, setCanAdd] = useState(false);

  const { authUser } = useAuth();
  const companyId = new Cookies().get("companyId");
  const roundButtons = (item) => {
    return [
      { color: "success", icon: Edit, event: () => onEdit(item) },
      { color: "danger", icon: Close, event: () => onDelete(item) },
    ].map((prop, key) => {
      if (
        authUser.role === Roles.SUPER_ADMIN ||
        (authUser.role === Roles.COMPANY_ADMIN && key !== 1)
      )
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
      else return [];
    });
  };

  const onEdit = (item) => {
    setCompany({
      name: item.name,
      id: item.id,
      address: item.address,
      address1: item.address1,
      address2: item.address2,
      email: item.email,
      phone: item.phone,
      city: item.city,
      postcode: item.postcode,
      country: item.country,
      vat: item.vat,
      note: item.note,
    });

    setAlert(true);
  };

  const onDelete = async (item) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You are about to delete!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#f6a117",
      cancelButtonColor: "#999",
    }).then((result) => {
      return result.value;
    });

    if (result) {
      const record = await DataStore.query(Companies, item.id);
      
      

      const results = await DataStore.query(CustomersCompanies, Predicates.ALL);
      
      for(let result of results) {
        if(result.companies.id === item.id) {
          await DataStore.delete(result)
        }
      }

      await DataStore.delete(record);
      
      setCompanyData()
      MySwal.fire({
        title: "Deleted!",
        text: "It is deleted.",
        icon: "success",
        confirmButtonColor: "#f6a117",
        cancelButtonColor: "#999",
      });
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
    setCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const onCancel = () => {
    setAlert(false);
  };

  const setCompanyData = async () => {
    try {
      let queryFunc = null;

      if (authUser.role === Roles.SUPER_ADMIN) {
        queryFunc = null;
        setCanAdd(true);
      } else if (
        authUser.role === Roles.COMPANY_ADMIN ||
        authUser.role === Roles.COMPANY_MEMBER
      ) {
        queryFunc = (c) => c.id("eq", companyId);
      } else {
        return;
      }
      const companies = await DataStore.query(Companies, queryFunc);
      setData(
        companies.map((item, index) => {
          return [
            // item.code,
            item.name,
            item.address,
            item.email,
            item.phone,
            item.country,
            roundButtons(item),
          ];
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const companySubmit = async () => {
    const regex = new RegExp(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im // eslint-disable-line
    );

    if (!company.name) {
      setCompany({
        ...company,
        error: {
          ...company.error,
          name: "Must have company Name!",
        },
      });
      return;
    }
    if (
      company.postcode &&
      (company.postcode.length < 0 || company.postcode.length > 9)
    ) {
      setCompany({
        ...company,
        error: {
          ...company.error,
          postcode: "Invalid Postcode, Length should be less than 9!",
        },
      });
      return;
    }

    if (company.phone && !regex.test(company.phone)) {
      setCompany({
        ...company,
        error: {
          ...company.error,
          phone: "Invalid Phone Number, Example: +441636363634",
        },
      });
      return;
    }

    if (company.email && !validateEmail(company.email)) {
      setCompany({
        ...company,
        error: {
          ...company.error,
          email: "Invalid email",
        },
      });
      return;
    }

    if (company.name && !company.id) {
      const records = await DataStore.query(
        Companies,
        (c) => c.name("eq", company.name),
        {
          sort: (s) => s.code(SortDirection.DESCENDING),
        }
      );
      let code = getCapital(company.name);
      if (records.length) {
        const record = records[0];
        code += pad(record.code ? record.code.substring(4) * 1 : 0);
      } else {
        code += pad(0);
      }
      const existcode = await DataStore.query(
        Companies,
        (c) => c.code("contains", code.substring(0,4)),
      );
      if (existcode.length>0) {
        code = code.substring(0,4) + pad(existcode[existcode.length-1].code.substring(7) * 1);
      }
      await DataStore.save(
        new Companies({
          name: company.name,
          address: company.address,
          address1: company.address1,
          address2: company.address2,
          email: company.email,
          phone: company.phone,
          city: company.city,
          postcode: company.postcode,
          country: company.country,
          vat: company.vat,
          note: company.note,
          code: code,
        })
      );
    } else if (company.name && company.id) {
      const record = await DataStore.query(Companies, company.id);

      await DataStore.save(
        Companies.copyOf(record, (updated) => {
          updated.name = company.name;
          updated.address = company.address;
          updated.address1 = company.address1;
          updated.address2 = company.address2;
          updated.email = company.email;
          updated.phone = company.phone;
          updated.city = company.city;
          updated.postcode = company.postcode;
          updated.country = company.country;
          updated.vat = company.vat;
          updated.note = company.note;
        })
      );
    }
    setCompanyData();
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
            {canAdd && (
              <Button
                color="primary"
                size="lg"
                onClick={() => {
                  setCompany({});
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
              tableHead={[
                // "code",
                "Name",
                "Address",
                "email",
                "Phone",
                "Country",
                "Actions",
              ]}
              tableData={data}
              customCellClasses={[classes.right]}
              customClassesForCells={[6]}
              customHeadCellClasses={[
                classes.right + " " + classes.btnTd,
              ]}
              customHeadClassesForCells={[6]}
            />
          </CardBody>
        </Card>
      </GridItem>
      <SimpleModal
        open={alert}
        onClose={onCancel}
        title={company.id ? "Edit Company" : "New Company"}
        icon={<MailOutline />}
        disableBackdropClick
        styleProps={{
          width: "50%",
        }}
      >
        <GridContainer>
          <GridItem xs={6}>
            <CustomInput
              labelText="Name"
              id="company_name"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.name,
                onChange: (e) =>
                  setCompany({ ...company, name: e.target.value }),
              }}
              error={company.error?.name}
              helperText={company.error?.name}
            />
            <CustomInput
              labelText="Address"
              id="company_address"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.address,
                onChange: (e) =>
                  setCompany({ ...company, address: e.target.value }),
              }}
            />
            <CustomInput
              labelText="Address 2"
              id="company_address2"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.address2,
                onChange: (e) =>
                  setCompany({ ...company, address2: e.target.value }),
              }}
            />
            <CustomInput
              labelText="Address 3"
              id="company_address3"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.address3,
                onChange: (e) =>
                  setCompany({ ...company, address3: e.target.value }),
              }}
            />
            <CustomInput
              labelText="City"
              id="company_city"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.city,
                onChange: (e) =>
                  setCompany({ ...company, city: e.target.value }),
              }}
            />

            <CustomInput
              labelText="Post Code"
              id="company_postcode"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.postcode,
                onChange: (e) =>
                  setCompany({
                    ...company,
                    postcode: e.target.value,
                    error: {
                      ...company.error,
                      postcode: null,
                    },
                  }),
              }}
              error={company.error?.postcode}
              helperText={company.error?.postcode}
            />
          </GridItem>
          <GridItem xs={6}>
            <CustomInput
              labelText="Phone"
              id="company_phone"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "tel",
                value: company.phone,
                onChange: (e) =>
                  setCompany({ ...company, phone: e.target.value }),
              }}
              error={company.error?.phone}
              helperText={company.error?.phone}
            />
            <CustomInput
              labelText="VAT"
              id="company_vat"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.vat,
                onChange: (e) =>
                  setCompany({ ...company, vat: e.target.value }),
              }}
            />
            <CustomInput
              labelText="Email"
              id="company_email"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "email",
                value: company.email,
                onChange: (e) =>
                  setCompany({ ...company, email: e.target.value }),
              }}
              error={company.error?.email}
              helperText={company.error?.email}
            />

            <CustomInput
              labelText="Country"
              id="company_country"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                value: company.country,
                onChange: (e) =>
                  setCompany({ ...company, country: e.target.value }),
              }}
            />

            <CustomInput
              labelText="Note"
              id="company_note"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "text",
                multiline: true,
                rows: 5,
                value: company.note,
                onChange: (e) =>
                  setCompany({ ...company, note: e.target.value }),
              }}
            />
          </GridItem>
        </GridContainer>
        <Grid container justify="flex-end">
          <Button color="warning" onClick={companySubmit}>
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
