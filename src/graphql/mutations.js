/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCustomers = /* GraphQL */ `
  mutation CreateCustomers(
    $input: CreateCustomersInput!
    $condition: ModelCustomersConditionInput
  ) {
    createCustomers(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      username
      role
      isTemp
      isArchive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      CustomersCompanies {
        items {
          id
          customersID
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const updateCustomers = /* GraphQL */ `
  mutation UpdateCustomers(
    $input: UpdateCustomersInput!
    $condition: ModelCustomersConditionInput
  ) {
    updateCustomers(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      username
      role
      isTemp
      isArchive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      CustomersCompanies {
        items {
          id
          customersID
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const deleteCustomers = /* GraphQL */ `
  mutation DeleteCustomers(
    $input: DeleteCustomersInput!
    $condition: ModelCustomersConditionInput
  ) {
    deleteCustomers(input: $input, condition: $condition) {
      id
      firstName
      lastName
      email
      username
      role
      isTemp
      isArchive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      CustomersCompanies {
        items {
          id
          customersID
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const createCompanies = /* GraphQL */ `
  mutation CreateCompanies(
    $input: CreateCompaniesInput!
    $condition: ModelCompaniesConditionInput
  ) {
    createCompanies(input: $input, condition: $condition) {
      id
      name
      address
      address1
      address2
      email
      phone
      city
      postcode
      country
      vat
      note
      code
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      Risks {
        items {
          id
          riskId
          riskType
          top10
          subCategory
          riskDescription
          status
          dateClosed
          impactCost
          indicativeLiveExposure
          probability
          impact
          total
          owner
          comments
          projectRequired
          projectFunded
          title
          dateRaised
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      customerss {
        items {
          id
          customersID
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const updateCompanies = /* GraphQL */ `
  mutation UpdateCompanies(
    $input: UpdateCompaniesInput!
    $condition: ModelCompaniesConditionInput
  ) {
    updateCompanies(input: $input, condition: $condition) {
      id
      name
      address
      address1
      address2
      email
      phone
      city
      postcode
      country
      vat
      note
      code
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      Risks {
        items {
          id
          riskId
          riskType
          top10
          subCategory
          riskDescription
          status
          dateClosed
          impactCost
          indicativeLiveExposure
          probability
          impact
          total
          owner
          comments
          projectRequired
          projectFunded
          title
          dateRaised
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      customerss {
        items {
          id
          customersID
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const deleteCompanies = /* GraphQL */ `
  mutation DeleteCompanies(
    $input: DeleteCompaniesInput!
    $condition: ModelCompaniesConditionInput
  ) {
    deleteCompanies(input: $input, condition: $condition) {
      id
      name
      address
      address1
      address2
      email
      phone
      city
      postcode
      country
      vat
      note
      code
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      Risks {
        items {
          id
          riskId
          riskType
          top10
          subCategory
          riskDescription
          status
          dateClosed
          impactCost
          indicativeLiveExposure
          probability
          impact
          total
          owner
          comments
          projectRequired
          projectFunded
          title
          dateRaised
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
      customerss {
        items {
          id
          customersID
          companiesID
          _version
          _deleted
          _lastChangedAt
          createdAt
          updatedAt
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const createRisks = /* GraphQL */ `
  mutation CreateRisks(
    $input: CreateRisksInput!
    $condition: ModelRisksConditionInput
  ) {
    createRisks(input: $input, condition: $condition) {
      id
      riskId
      riskType
      top10
      subCategory
      riskDescription
      status
      dateClosed
      impactCost
      indicativeLiveExposure
      probability
      impact
      total
      owner
      actions {
        Action
        ActionDueDate
        ActionOwner
      }
      comments
      projectRequired
      projectFunded
      title
      dateRaised
      companiesID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateRisks = /* GraphQL */ `
  mutation UpdateRisks(
    $input: UpdateRisksInput!
    $condition: ModelRisksConditionInput
  ) {
    updateRisks(input: $input, condition: $condition) {
      id
      riskId
      riskType
      top10
      subCategory
      riskDescription
      status
      dateClosed
      impactCost
      indicativeLiveExposure
      probability
      impact
      total
      owner
      actions {
        Action
        ActionDueDate
        ActionOwner
      }
      comments
      projectRequired
      projectFunded
      title
      dateRaised
      companiesID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteRisks = /* GraphQL */ `
  mutation DeleteRisks(
    $input: DeleteRisksInput!
    $condition: ModelRisksConditionInput
  ) {
    deleteRisks(input: $input, condition: $condition) {
      id
      riskId
      riskType
      top10
      subCategory
      riskDescription
      status
      dateClosed
      impactCost
      indicativeLiveExposure
      probability
      impact
      total
      owner
      actions {
        Action
        ActionDueDate
        ActionOwner
      }
      comments
      projectRequired
      projectFunded
      title
      dateRaised
      companiesID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createCustomersCompanies = /* GraphQL */ `
  mutation CreateCustomersCompanies(
    $input: CreateCustomersCompaniesInput!
    $condition: ModelCustomersCompaniesConditionInput
  ) {
    createCustomersCompanies(input: $input, condition: $condition) {
      id
      customersID
      companiesID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      customers {
        id
        firstName
        lastName
        email
        username
        role
        isTemp
        isArchive
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        CustomersCompanies {
          nextToken
          startedAt
        }
      }
      companies {
        id
        name
        address
        address1
        address2
        email
        phone
        city
        postcode
        country
        vat
        note
        code
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        Risks {
          nextToken
          startedAt
        }
        customerss {
          nextToken
          startedAt
        }
      }
    }
  }
`;
export const updateCustomersCompanies = /* GraphQL */ `
  mutation UpdateCustomersCompanies(
    $input: UpdateCustomersCompaniesInput!
    $condition: ModelCustomersCompaniesConditionInput
  ) {
    updateCustomersCompanies(input: $input, condition: $condition) {
      id
      customersID
      companiesID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      customers {
        id
        firstName
        lastName
        email
        username
        role
        isTemp
        isArchive
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        CustomersCompanies {
          nextToken
          startedAt
        }
      }
      companies {
        id
        name
        address
        address1
        address2
        email
        phone
        city
        postcode
        country
        vat
        note
        code
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        Risks {
          nextToken
          startedAt
        }
        customerss {
          nextToken
          startedAt
        }
      }
    }
  }
`;
export const deleteCustomersCompanies = /* GraphQL */ `
  mutation DeleteCustomersCompanies(
    $input: DeleteCustomersCompaniesInput!
    $condition: ModelCustomersCompaniesConditionInput
  ) {
    deleteCustomersCompanies(input: $input, condition: $condition) {
      id
      customersID
      companiesID
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      customers {
        id
        firstName
        lastName
        email
        username
        role
        isTemp
        isArchive
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        CustomersCompanies {
          nextToken
          startedAt
        }
      }
      companies {
        id
        name
        address
        address1
        address2
        email
        phone
        city
        postcode
        country
        vat
        note
        code
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        Risks {
          nextToken
          startedAt
        }
        customerss {
          nextToken
          startedAt
        }
      }
    }
  }
`;
