import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { Typography } from "@material-ui/core";
import Email from "@material-ui/icons/Email";
import SimpleModal from "components/Modal";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-dashboard-react/views/loginPageStyle.js";
import { useAuth } from "../../util/use-auth";
import { useHistory } from "react-router-dom";
import { MailOutline } from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import { updatePassword } from "../../util/Api";
import { useBackdrop } from "util/use-load";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Companies, Customers, CustomersCompanies, Roles } from "../../models";
import CustomMenu from "components/CustomMenu/CustomMenu";
import { Cookies } from "react-cookie";
import { Auth } from "aws-amplify";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [forgotPassword, setForgotPassword] = React.useState({
    sent: false,
    code: "",
    newPassword: "",
    confirmPassword: "",
    destination: "",
  });

  const { authUser, userLogin, isLoading, error } = useAuth();
  const history = useHistory();
  const fetching = useBackdrop();
  const [openModal, setOpenModal] = React.useState(false);
  const [chooseModal, setChooseModal] = React.useState(false);
  const [forgotModal, setForgotModal] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [afterModal, setAfterModal] = React.useState(false);
  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });

  const handleSubmit = () => {
    // userSignup({email, password});
    // return

    if (email.length === 0) {
      alert("Please enter your email");
      return;
    }

    if (password.length === 0) {
      alert("Please enter your password");
      return;
    }

    fetching(true);
    userLogin({ email, password })
      .then(async (username) => {
        const user = await DataStore.query(Customers, (q) =>
          q.username("eq", username)
        );
        let filterCompanies = [];
        if (user[0]?.role === Roles.SUPER_ADMIN) {
          const results = await DataStore.query(Companies);
          filterCompanies = results.map((result) => {
            return {
              label: result.name,
              value: result.id,
            };
          });
        } else {
          const results = await DataStore.query(
            CustomersCompanies,
            Predicates.ALL
          );
          filterCompanies = results
            .filter((result) => result.customers.username === username)
            .map((result) => {
              return {
                label: result.companies.name,
                value: result.companies.id,
              };
            });
        }

        setCompanies(filterCompanies);

        fetching(false);
        if (!user[0]?.isTemp) {
          setOpenModal(true);
          setAfterModal(true);
        } else if (user[0]?.role !== Roles.SUPER_ADMIN) {
          if (filterCompanies.length === 1) {
            chooseCompany(filterCompanies[0]);
          } else {
            setChooseModal(true);
          }
        } else {
          const cookies = new Cookies();
          cookies.set("companyId", "");
          history.push("/admin/dashboard");
          // setChooseModal(true);
        }
      })
      .catch((error) => {
        fetching(false);
      });
  };

  const chooseCompany = (comp) => {
    const cookies = new Cookies();
    cookies.set("companyId", comp.value);
    history.push("/admin/dashboard");
  };

  React.useEffect(() => {
    if (error && !isLoading) {
      alert(error);
      fetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isLoading]);

  const classes = useStyles();

  const onCancel = () => {
    setOpenModal(false);
    if (afterModal) {
      if (companies.length === 1) {
        chooseCompany(companies[0]);
      } else {
        setChooseModal(true);
      }
    } else {
      history.push("/admin/dashboard");
    }
  };

  const onClick = () => {
    fetching(true);
    setOpenModal(false);
    updatePassword({
      email: authUser.username,
      password: newPassword,
      reason: "forgot",
    })
      .then(async () => {
        const record = await DataStore.query(Customers, authUser.id);

        await DataStore.save(
          Customers.copyOf(record, (update) => {
            update.isTemp = true;
          })
        );
      })
      .catch(() => {})
      .finally(() => {
        fetching(false);
        if (afterModal) {
          if (companies.length === 1) {
            chooseCompany(companies[0]);
          } else {
            setChooseModal(true);
          }
        } else {
          history.push("/admin/dashboard");
        }
      });
  };

  const onChooseCompay = () => {
    if (companies.find((item) => item.value === company)) {
      const cookies = new Cookies();
      cookies.set("companyId", company);
      history.push("/admin/dashboard");
    } else {
      window.alert("You must select a company");
    }
  };

  const resetPass = () => {
    if (!forgotPassword.sent) {
      fetching(true);
      Auth.forgotPassword(email)
        .then((data) => {
          setForgotPassword({
            sent: true,
            destination: data?.CodeDeliveryDetails?.Destination,
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          fetching(false);
        });
    } else {
      if (
        !forgotPassword.code ||
        !forgotPassword.newPassword ||
        !forgotPassword.confirmPassword
      ) {
        window.alert("Please check Empty Fields");
        return;
      }

      if (forgotPassword.newPassword !== forgotPassword.confirmPassword) {
        window.alert("Don't match confirm password");
        return;
      }

      Auth.forgotPasswordSubmit(
        email,
        forgotPassword.code,
        forgotPassword.newPassword
      )
        .then((res) => {
          if (res === "SUCCESS") {
            window.alert("Updated password!");
            setForgotModal(false);
            return;
          } else {
            window.alert("Failed update password, Try again later!");
            setForgotModal(false);
            return;
          }
        })
        .catch((err) => {
          window.alert(err.message);
          setForgotModal(false);
          return;
        });
    }
  };

  const moveForget = () => {
    // history.push("/admin/dashboard");
    setForgotModal(true);
  };

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="primary"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
                <p>demo account</p>
                <div>username: sabirli31@gmail.com</div>
                <span>Passwd: password</span>
              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="Username..."
                  id="username"
                  formControlProps={{
                    fullWidth: true,
                    required: true,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    onChange: (e) => setEmail(e.target.value.trim()),
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                    required: true,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                    onChange: (e) => setPassword(e.target.value.trim()),
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button
                  color="primary"
                  block
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  Let{"'"}s Go
                </Button>
                <div
                  role="presentation"
                  className={classes.forgetPass}
                  onClick={moveForget}
                >
                  <Typography
                    className={classes.forgetText}
                    variant="h6"
                    color="primary"
                  >
                    Forgot Password
                  </Typography>
                </div>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>

      <SimpleModal
        open={chooseModal}
        title="Choose Company"
        icon={<MailOutline />}
        disableBackdropClick
        styleProps={{
          width: "30%",
        }}
      >
        <GridContainer>
          <GridItem xs={12}>
            <CustomMenu
              label="Select a Company(required)"
              value={company}
              controlled
              // disabled
              onChange={(value) => {
                setCompany(value);
              }}
              items={companies}
            />
          </GridItem>
        </GridContainer>
        <Grid container justify="flex-end">
          <Button color="rose" onClick={onChooseCompay}>
            Choose
          </Button>
        </Grid>
      </SimpleModal>

      <SimpleModal
        open={openModal}
        title="Need to update the password"
        icon={<MailOutline />}
        disableBackdropClick
        styleProps={{
          width: "30%",
        }}
      >
        <GridContainer>
          <GridItem xs={12}>
            <CustomInput
              labelText="New Password"
              id="new_password"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: "password",
                value: newPassword,
                onChange: (e) => setNewPassword(e.target.value),
              }}
            />
          </GridItem>
        </GridContainer>
        <Grid container justify="flex-end">
          <Button color="rose" onClick={onClick}>
            Change Password
          </Button>
          <Button color="info" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </SimpleModal>

      <SimpleModal
        open={forgotModal}
        title="Forgot password"
        icon={<MailOutline />}
        disableBackdropClick
        styleProps={{
          width: "30%",
        }}
      >
        {!forgotPassword.sent && (
          <GridContainer>
            <GridItem xs={12}>
              <CustomInput
                labelText="Username"
                id="new_email"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                }}
              />
            </GridItem>
          </GridContainer>
        )}

        {forgotPassword.sent && (
          <GridContainer>
            <GridItem xs={12}>
              {forgotPassword.destination && (
                <Typography>
                  Check Email {forgotPassword.destination}
                </Typography>
              )}
              <CustomInput
                labelText="Code"
                id="code"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "text",
                  value: forgotPassword.code,
                  onChange: (e) =>
                    setForgotPassword({
                      ...forgotPassword,
                      code: e.target.value,
                    }),
                }}
              />
              <CustomInput
                labelText="New Password"
                id="forgot_password"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "password",
                  value: forgotPassword.newPassword,
                  onChange: (e) =>
                    setForgotPassword({
                      ...forgotPassword,
                      newPassword: e.target.value,
                    }),
                }}
              />
              <CustomInput
                labelText="Confirm Password"
                id="forgot_confirmPassword"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "password",
                  value: forgotPassword.confirmPassword,
                  onChange: (e) =>
                    setForgotPassword({
                      ...forgotPassword,
                      confirmPassword: e.target.value,
                    }),
                }}
              />
            </GridItem>
          </GridContainer>
        )}
        <Grid container justify="flex-end">
          <Button
            color="rose"
            onClick={() => {
              setForgotPassword({
                sent: false,
                code: "",
                newPassword: "",
                confirmPassword: "",
                destination: "",
              });
              setForgotModal(false);
            }}
          >
            Cancel
          </Button>
          <Button color="info" onClick={resetPass}>
            {!forgotPassword.sent ? "Send" : "Confirm"}
          </Button>
        </Grid>
      </SimpleModal>
    </div>
  );
}
