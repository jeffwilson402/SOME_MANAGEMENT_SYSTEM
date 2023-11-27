/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCustomers = /* GraphQL */ `
  query GetCustomers($id: ID!) {
    getCustomers(id: $id) {
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
export const listCustomers = /* GraphQL */ `
  query ListCustomers(
    $filter: ModelCustomersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncCustomers = /* GraphQL */ `
  query SyncCustomers(
    $filter: ModelCustomersFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCustomers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getCompanies = /* GraphQL */ `
  query GetCompanies($id: ID!) {
    getCompanies(id: $id) {
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
export const listCompanies = /* GraphQL */ `
  query ListCompanies(
    $filter: ModelCompaniesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncCompanies = /* GraphQL */ `
  query SyncCompanies(
    $filter: ModelCompaniesFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCompanies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getRisks = /* GraphQL */ `
  query GetRisks($id: ID!) {
    getRisks(id: $id) {
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
export const listRisks = /* GraphQL */ `
  query ListRisks(
    $filter: ModelRisksFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRisks(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
      startedAt
    }
  }
`;
export const syncRisks = /* GraphQL */ `
  query SyncRisks(
    $filter: ModelRisksFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRisks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
      nextToken
      startedAt
    }
  }
`;
export const syncCustomersCompanies = /* GraphQL */ `
  query SyncCustomersCompanies(
    $filter: ModelCustomersCompaniesFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCustomersCompanies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
        }
      }
      nextToken
      startedAt
    }
  }
`;
