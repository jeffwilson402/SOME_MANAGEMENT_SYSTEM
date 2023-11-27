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
import { DataStore } from "aws-amplify";
import { Companies } from "../../models";
import { Grid } from "@material-ui/core";
import { useAuth } from "util/use-auth";
import { Roles } from "models";
import { Cookies } from "react-cookie";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { validateEmail, initialCompany } from "util/utils";

const MySwal = withReactContent(Swal);

export default function CompaniesPage() {
  const [company, setCompany] = useState(initialCompany);

  const { authUser } = useAuth();
  const companyId = new Cookies().get("companyId");

  useEffect(() => {
    setCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  const onCancel = () => {
		setCompanyData();
  };

  const setCompanyData = async () => {
    try {
      let queryFunc = null;

      if (authUser.role === Roles.SUPER_ADMIN) {
        queryFunc = null;
      } else if (
        authUser.role === Roles.COMPANY_ADMIN ||
        authUser.role === Roles.COMPANY_MEMBER
      ) {
        queryFunc = (c) => c.id("eq", companyId);
      } else {
        return;
      }
      const companies = await DataStore.query(Companies, queryFunc);
      setCompany(...companies);
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
		MySwal.fire({
			title: "Updated!",
			text: "It is updated.",
			icon: "success",
			confirmButtonColor: "#f6a117",
			cancelButtonColor: "#999",
		});
	setCompanyData();
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
									type: "phone",
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
						</CardBody>	
    			</Card>
    		</GridItem>
    </GridContainer>
  );
}
