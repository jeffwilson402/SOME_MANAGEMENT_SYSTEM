// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Roles = {
  "SUPER_ADMIN": "SUPER_ADMIN",
  "COMPANY_ADMIN": "COMPANY_ADMIN",
  "COMPANY_MEMBER": "COMPANY_MEMBER",
  "GUEST": "GUEST"
};

const Yn = {
  "Y": "Y",
  "N": "N"
};

const RiskStatus = {
  "NEW": "NEW",
  "OPEN": "OPEN",
  "CLOSED_DUPLICATE": "CLOSED_DUPLICATE",
  "CLOSED_ELIMINATED": "CLOSED_ELIMINATED",
  "TOLERATED": "TOLERATED"
};

const Funding = {
  "FUNDED": "FUNDED",
  "NOTFUNDED": "NOTFUNDED"
};

const { Customers, CustomersCompanies, Companies, Risks, Action } = initSchema(schema);

export {
  Customers,
  CustomersCompanies,
  Companies,
  Risks,
  Roles,
  Yn,
  RiskStatus,
  Funding,
  Action
};