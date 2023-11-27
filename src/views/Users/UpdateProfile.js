import React, { useState, useEffect } from "react";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput";
import { useAuth } from "util/use-auth";
import { updatePassword } from "util/Api";
import { DataStore } from "@aws-amplify/datastore";
import { updateUser } from "util/Api";
import { Customers } from "../../models";
import { useBackdrop } from "util/use-load";

export default function UpdateProfile() {
  const [password, setPassword] = useState(null);
  const { authUser, getUserProfile } = useAuth();
  const [customer, setCustomer] = useState({});
  const fetching = useBackdrop();
  useEffect(() => {
    (async () => {
      const record = await DataStore.query(Customers, authUser.id);
      setCustomer(record);
    })();
  }, [authUser]);

  const onSubmit = () => {
    fetching(true)
    updatePassword({
      email: authUser.username,
      password,
    })
      .then((res) => {
        window.alert(res.success);
      })
      .catch((error) => {
        window.alert(error.message);
      })
      .finally(() => fetching(false));
  };

  const onUpdate = async () => {
    const emailRecord = await DataStore.query(Customers, (cus) =>
      cus.username("eq", customer.username)
    );
    if (emailRecord.length > 1) {
      window.alert("Already Username Exist!");
      return;
    }

    if(emailRecord.length === 0) {
      window.alert('No exist username!');
      return;
    }

    if(emailRecord[0].email !== customer.email) {
      const records = await DataStore.query(Customers, (cus) => cus.email('eq', customer.email));
      if(records.length) {
        window.alert('Already Exist email, You must select another email!!');
        return;
      }
    }
      fetching(true);
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
    getUserProfile(customer.email);
    fetching(false);
  };

  return (
    <GridContainer>
      <GridItem md={12}>
        <Card>
          <CardHeader color="rose" stats icon>
            <CardIcon color="warning">
              <Assignment />
            </CardIcon>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem md={8}>
                <GridContainer>
                  <GridItem md={6}>
                    <CustomInput
                      labelText={
                        <span>
                          First Name
                          {/* <small>(required)</small> */}
                        </span>
                      }
                      id="first_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      labelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        placeholder: "First Name",
                        value: customer.firstName,
                        onChange: (e) =>
                          setCustomer({
                            ...customer,
                            firstName: e.target.value,
                          }),
                      }}
                    />
                  </GridItem>
                  <GridItem md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last_name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      labelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        value: customer.lastName,
                        defaultValue: customer.lastName,
                        onChange: (e) =>
                          setCustomer({
                            ...customer,
                            lastName: e.target.value,
                          }),
                      }}
                    />
                  </GridItem>
                  <GridItem md={12}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                        required: true,
                        // disabled: !!customer.id,
                      }}
                      labelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        value: customer.email,
                        onChange: (e) =>
                          setCustomer({ ...customer, email: e.target.value }),
                      }}
                    />
                  </GridItem>
                  <GridItem md={6}>
                    <CustomInput
                      labelText="Username"
                      id="user_name"
                      formControlProps={{
                        fullWidth: true,
                        disabled: true
                      }}
                      labelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        value: customer.username,
                        onChange: (e) =>
                          setCustomer({
                            ...customer,
                            username: e.target.value,
                          }),
                      }}
                    />
                  </GridItem>

                  <GridItem md={6}>
                    <CustomInput
                      labelText="Role"
                      id="role"
                      formControlProps={{
                        fullWidth: true,
                        disabled: true,
                      }}
                      labelProps={{
                        shrink: true
                      }}
                      inputProps={{
                        value: customer.role,
                        onChange: (e) =>
                          setCustomer({ ...customer, role: e.target.value }),
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <Button color="primary" onClick={onUpdate}>
                  Update
                </Button>
              </GridItem>
            </GridContainer>
            <GridContainer className="mt-4">
              <GridItem md={8}>
                <CustomInput
                  labelText="New Password"
                  id="new-password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                  }}
                />
                <Button color="primary" onClick={onSubmit}>
                  Change Password
                </Button>
              </GridItem>
            </GridContainer>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
