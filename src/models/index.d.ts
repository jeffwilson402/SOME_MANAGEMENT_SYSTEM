import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Roles {
  SUPER_ADMIN = "SUPER_ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  COMPANY_MEMBER = "COMPANY_MEMBER",
  GUEST = "GUEST"
}

export enum Yn {
  Y = "Y",
  N = "N"
}

export enum RiskStatus {
  NEW = "NEW",
  OPEN = "OPEN",
  CLOSED_DUPLICATE = "CLOSED_DUPLICATE",
  CLOSED_ELIMINATED = "CLOSED_ELIMINATED",
  TOLERATED = "TOLERATED"
}

export enum Funding {
  FUNDED = "FUNDED",
  NOTFUNDED = "NOTFUNDED"
}

export declare class Action {
  readonly Action?: string;
  readonly ActionDueDate?: string;
  readonly ActionOwner?: string;
  constructor(init: ModelInit<Action>);
}

type CustomersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CustomersCompaniesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CompaniesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RisksMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Customers {
  readonly id: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly username?: string;
  readonly role?: Roles | keyof typeof Roles;
  readonly CustomersCompanies?: (CustomersCompanies | null)[];
  readonly isTemp?: boolean;
  readonly isArchive?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Customers, CustomersMetaData>);
  static copyOf(source: Customers, mutator: (draft: MutableModel<Customers, CustomersMetaData>) => MutableModel<Customers, CustomersMetaData> | void): Customers;
}

export declare class CustomersCompanies {
  readonly id: string;
  readonly customers: Customers;
  readonly companies: Companies;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<CustomersCompanies, CustomersCompaniesMetaData>);
  static copyOf(source: CustomersCompanies, mutator: (draft: MutableModel<CustomersCompanies, CustomersCompaniesMetaData>) => MutableModel<CustomersCompanies, CustomersCompaniesMetaData> | void): CustomersCompanies;
}

export declare class Companies {
  readonly id: string;
  readonly name?: string;
  readonly address?: string;
  readonly address1?: string;
  readonly address2?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly city?: string;
  readonly postcode?: string;
  readonly country?: string;
  readonly vat?: string;
  readonly note?: string;
  readonly customerss?: (CustomersCompanies | null)[];
  readonly code?: string;
  readonly Risks?: (Risks | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Companies, CompaniesMetaData>);
  static copyOf(source: Companies, mutator: (draft: MutableModel<Companies, CompaniesMetaData>) => MutableModel<Companies, CompaniesMetaData> | void): Companies;
}

export declare class Risks {
  readonly id: string;
  readonly riskId: string;
  readonly riskType: string;
  readonly top10?: Yn | keyof typeof Yn;
  readonly subCategory?: string;
  readonly riskDescription?: string;
  readonly status: RiskStatus | keyof typeof RiskStatus;
  readonly dateClosed?: string;
  readonly impactCost?: number;
  readonly indicativeLiveExposure?: number;
  readonly probability?: number;
  readonly impact?: number;
  readonly total?: number;
  readonly owner?: string;
  readonly actions?: (Action | null)[];
  readonly comments?: string;
  readonly projectRequired?: Yn | keyof typeof Yn;
  readonly projectFunded?: Funding | keyof typeof Funding;
  readonly title?: string;
  readonly dateRaised: string;
  readonly companiesID?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Risks, RisksMetaData>);
  static copyOf(source: Risks, mutator: (draft: MutableModel<Risks, RisksMetaData>) => MutableModel<Risks, RisksMetaData> | void): Risks;
}