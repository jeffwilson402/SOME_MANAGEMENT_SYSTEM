/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCustomers = /* GraphQL */ `
  subscription OnCreateCustomers {
    onCreateCustomers {
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
export const onUpdateCustomers = /* GraphQL */ `
  subscription OnUpdateCustomers {
    onUpdateCustomers {
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
export const onDeleteCustomers = /* GraphQL */ `
  subscription OnDeleteCustomers {
    onDeleteCustomers {
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
export const onCreateCompanies = /* GraphQL */ `
  subscription OnCreateCompanies {
    onCreateCompanies {
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
export const onUpdateCompanies = /* GraphQL */ `
  subscription OnUpdateCompanies {
    onUpdateCompanies {
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
export const onDeleteCompanies = /* GraphQL */ `
  subscription OnDeleteCompanies {
    onDeleteCompanies {
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
export const onCreateRisks = /* GraphQL */ `
  subscription OnCreateRisks {
    onCreateRisks {
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
export const onUpdateRisks = /* GraphQL */ `
  subscription OnUpdateRisks {
    onUpdateRisks {
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
export const onDeleteRisks = /* GraphQL */ `
  subscription OnDeleteRisks {
    onDeleteRisks {
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
export const onCreateCustomersCompanies = /* GraphQL */ `
  subscription OnCreateCustomersCompanies {
    onCreateCustomersCompanies {
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
export const onUpdateCustomersCompanies = /* GraphQL */ `
  subscription OnUpdateCustomersCompanies {
    onUpdateCustomersCompanies {
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
export const onDeleteCustomersCompanies = /* GraphQL */ `
  subscription OnDeleteCustomersCompanies {
    onDeleteCustomersCompanies {
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
