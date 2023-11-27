import { RiskStatus, Roles } from "../models";

export const RiskType = {
  Technology: [
    "Infrastructure Capacity",
    "Aging Equipment",
    "SPOF / Resilience",
    "Aging Apps / OS",
    "Monitoring",
    "Environmental",
    "Disaster Recovery",
  ],
  'Process': [
    "Process & Standards",
    "Key Person Dependency",
    "People Capacity",
    "Project Deployment",
    "Supplier Management",
  ],
  'Data' : ["Logical Access", "Physical Access", "Data", "Vulnerabilities"],
  Asset: ["Licensing", "Loss of IT asset"],
};

export const Probability = [
  "Unlikely - Unforseeable",
  "Possible < 3 years",
  "Probable < 12 months",
  "Imminent < 3 months",
  "Happening",
];

export const Impact = [
  "Internal Only",
  "Client Recognition",
  "Core Service Outage",
  "Public Reputational Damage",
  "Catastrophic to Business",
];

export const StatusLabels = [
  "New",
  "Open",
  "Closed Duplicate",
  "Closed Eliminated",
  "Tolerated",
];

export const StatusType = [
  {
    label: "New",
    value: RiskStatus.NEW,
  },
  {
    label: "Open",
    value: RiskStatus.OPEN,
  },
  {
    label: "Closed Duplicate",
    value: RiskStatus.CLOSED_DUPLICATE,
  },
  {
    label: "Closed Eliminated",
    value: RiskStatus.CLOSED_ELIMINATED,
  },
  {
    label: "Tolerated",
    value: RiskStatus.TOLERATED,
  },
];

export const YesOrNo = [
  {
    label: "Yes",
    value: "Y",
  },
  {
    label: "No",
    value: "N",
  },
];

export const RolesData = [
  {
    label: "Super Admin",
    value: Roles.SUPER_ADMIN,
  },
  {
    label: "Company Admin",
    value: Roles.COMPANY_ADMIN,
  },
  {
    label: "Company Member",
    value: Roles.COMPANY_MEMBER,
  },
  {
    label: "Guest",
    value: Roles.GUEST,
  },
];

export const getRolesData = (roles = []) => {
  return roles.map((role) => {
    return RolesData.find((item) => item.value === role);
  });
};

export const getRoleLabel = (value) => {
  return RolesData.find((item) => item.value === value)?.label;
};

export const getRoleValue = (label) => {
  return RolesData.find((item) => item.label === label)?.value;
};

export const getImpactCostData = (data) => {
  const impact = data.impact;
  return impact === 1
    ? 0.5
    : impact === 2
    ? 1
    : impact === 3
    ? 10
    : impact === 4
    ? 100
    : impact === 5
    ? 1000
    : false;
};

export const getIndicativeData = (data) => {
  return data.status === "Closed"
    ? ""
    : data.probability === 5
    ? data.impactCost * 3
    : data.probability === 4
    ? data.impactCost * 1
    : data.probability === 3
    ? data.impactCost * 0.5
    : data.probability === 2
    ? data.impactCost * 0.3
    : data.probability === 1
    ? data.impactCost * 0.1
    : "";
};
