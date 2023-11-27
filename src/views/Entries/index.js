import React, { useState, useEffect } from "react";
// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { Auth, DataStore, Predicates, SortDirection } from "aws-amplify";
import {
  Risks,
  Customers,
  Roles,
  Action,
  CustomersCompanies,
  Companies,
} from "../../models";
import AddModal from "./AddModal";
import { useAuth } from "util/use-auth";
import { RiskType } from "util/RiskData";
import { Probability } from "util/RiskData";
import { Impact, StatusType } from "util/RiskData";
import moment from "moment";
import { Cookies } from "react-cookie";
import { useBackdrop } from "util/use-load";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import CustomEditorComponent from 'components/AgGrid/CustomEditorComponent.js';
import ReactSelectCellEditor from 'components/AgGrid/ReactSelectCellEditor.js';
// import Button from "components/CustomButtons/Button.js";
import GridComponents from "components/AgGrid/Components";
import { useHistory } from "react-router-dom";
import './app.css';

const dateFormat = "YYYY-MM-DD";

export default function EntriesPage() {
  const cookie = new Cookies();

  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [customers, setCustomers] = useState();
  const [allCompanies, setAllCompanies] = useState([]); 
  const [alert, setAlert] = useState(false);
  const { authUser } = useAuth();
  const history = useHistory()
  
  const companyId = cookie.get("companyId");
  const Fetching = useBackdrop();

  let savingTime;
  
  const getRiskData = async () => {
    let records: Risks[];

    if (authUser.role === Roles.SUPER_ADMIN) {
      records = await DataStore.query(Risks, Predicates.ALL, {
        sort: (s) => s.riskId(SortDirection.ASCENDING),
      });
    } else {
      records = await DataStore.query(
        Risks,
        (c) => c.companiesID("eq", companyId),
        {
          sort: (s) => s.riskId(SortDirection.ASCENDING),
        }
      );
    }
    records.push({
      actions: [
        {
          Action: "",
          ActionDueDate: "",
          ActionOwner: "",
        }
      ],
      comments: '',
      companiesID: "",
      id: "",
      impact: '',
      owner: "",
      probability: '',
      riskDescription: "",
      riskId: "",
      riskType: "",
      status: "",
      subCategory: "",
      title: '',
      action: '',
    });

    

    setRowData(
      records.map((element: Risks) => {
        const item: Risks = { ...element };
        const action: Action = item.actions.length ? item.actions[0] : {};
        item.total = item.total || item.impact * item.probability;
        return {
          ...item,
          action: action.Action,
          actionDueDate: action.ActionDueDate,
        };
      })
    );

    const cookies = new Cookies();
    const filter = cookies.get('filter');
    gridApi.setFilterModel(filter);
    console.log({setRowData : filter})

  };

  const getCustomers = async () => {
    let records;
    if (authUser.role === Roles.SUPER_ADMIN) {
      records = await DataStore.query(Customers);
    } else if (authUser.role === Roles.COMPANY_ADMIN) {
      records = await DataStore.query(CustomersCompanies, Predicates.ALL);
      records = records
        .filter((item) => item.companies.id === companyId)
        .map((item) => item.customers);
    } else {
      records = [await DataStore.query(Customers, authUser.id)];
    }

    setCustomers(
      Array.isArray(records) && records.map((item: Customers) => {
        return {
          label: item.firstName + " " + item.lastName,
          value: item.id,
        };
      })
    );
  };

  const getCompanies = async () => {
    const records = await DataStore.query(Companies);
    setAllCompanies(
      records.map(record => {
        return {
          label: record.name,
          value: record.id
        }
      })
    )
  }

  useEffect(() => {
    getCustomers();
    getCompanies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (customers) {
      getRiskData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers]);


  const frameworkComponents = {
    simpleEditor: GridComponents.SimpleEditor,
    customEditor: CustomEditorComponent,
    dateEditor: GridComponents.DateEditor,
    customselectEditor: ReactSelectCellEditor,
    actionsRenderer: GridComponents.ActionsRenderer,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    
    // params.api.sizeColumnsToFit();
  };

  const onFilterChanged = (params) => {
    const cookies = new Cookies();
    const filterCookie = cookies.get('filter');
    let filter = gridApi.getFilterModel();
    debugger
    // if(filter && Object.keys(filter).length === 0 && Object.getPrototypeOf(filter) === Object.prototype) {
    //   filter = filterCookie;
    // }

    if(JSON.stringify(filterCookie) !== JSON.stringify(filter) ){
      cookies.set('filter', filter, { path: '/' });
    }
    else{
      if(filterCookie){
        setTimeout(function(){
          gridApi.setFilterModel(filter);
        }, 100)
      }
    }
  }

  const onCellValueChanged = (params) => {
    if (window.agGrid?.editing) {
      window.agGrid.editing = false;
      gridApi.stopEditing(true)
    }
    
    savingTime = setTimeout(() => {
      saveEntries(params.data);
      if (savingTime) {
        clearTimeout(savingTime)
      }
    }, 500);
  };

  const saveEntries = async (risk: Risks) => {
    if (risk.id) {
      const record = await DataStore.query(Risks, risk.id);
      await DataStore.save(
        Risks.copyOf(record, (update) => {
          update.status = risk.status;
          update.riskType = risk.riskType;
          update.subCategory = risk.subCategory;
          update.title = risk.title;
          update.riskDescription = risk.riskDescription;
          update.probability = risk.probability;
          update.impact = risk.impact;
          update.owner = risk.owner;
          update.actions = [
            {
              Action: risk.action,
              ActionOwner: risk.owner,
              ActionDueDate: risk.actionDueDate,
            },
          ];
          update.action = risk.action;
          update.comments = risk.comments;
          update.companiesID = companyId
          update.dateRaised = moment().format(dateFormat);
          update.dateClosed = moment().format(dateFormat);
        })
      );
    }
    const cookies = new Cookies();
    const filter = cookies.get('filter');
    gridApi.setFilterModel(filter);
    console.log({saveEntries : filter})
  };

  function pad(n: number) {
    var s = "0000" + (n + 1);
    return s.substr(s.length - 5);
  }

  const entrySubmit = async (risk: Risks) => {
    if (!risk.id) {
      if (!risk.riskType || !risk.status) {
        window.alert("Please check Require fields");
        return;
      }

      if(!risk.companiesID && authUser.role === Roles.SUPER_ADMIN) {
        risk.companiesID = allCompanies[0]?.value;
      } else if(!risk.companiesID && authUser.role !== Roles.SUPER_ADMIN) {
        risk.companiesID = companyId
      } else if(!risk.companiesID && !companyId) {
        window.alert('No Company Id, You need to login again!!');
        Auth.signOut();
        history.push('/signin');
        return;
      }

      Fetching(true);
      const records = await DataStore.query(
        Risks,
        (c) => c.companiesID("eq", risk.companiesID),
        {
          sort: (s) => s.riskId(SortDirection.DESCENDING),
          page: 0,
          limit: 1,
        }
      );
      
      const company: Companies = await DataStore.query(Companies, risk.companiesID); 

      let riskId = company.code + "-";

      if (records.length) {
        const record = records[0];
        riskId += pad(record.riskId ? record.riskId.substring(9) * 1 : 0);
      } else {
        riskId += pad(0);
      }
      
      await DataStore.save(
        new Risks({
          riskId: riskId,
          status: StatusType.find((ele) => ele.label === risk.status)?.value,
          riskType: risk.riskType,
          subCategory: risk.subCategory,
          title: risk.title,
          riskDescription: risk.riskDescription,
          probability: risk.probability || null,
          impact: risk.impact || null,
          owner: authUser.id,
          action: risk.action,
          actions: [
            {
              Action: risk.action,
              ActionOwner: risk.owner,
              ActionDueDate: risk.actionDueDate,
            },
          ],
          comments: risk.comments,
          dateRaised: moment().format(dateFormat),
          dateClosed: moment().format(dateFormat),
          companiesID: risk.companiesID,
        })
      );
    }
    setAlert(false);
    Fetching(false);
    getRiskData();
  };

  const entryEditSubmit = async (risk: Risks) => {
    if (risk.id) {
      if (!risk.riskType || !risk.status) {
        window.alert("Please check Require fields");
        return;
      }
      Fetching(true);
      const record = await DataStore.query(Risks, risk.id);
      await DataStore.save(
        Risks.copyOf(record, (update) => {
          update.status = StatusType.find(
            (ele) => ele.label === risk.status
          )?.value;
          update.riskType = risk.riskType;
          update.subCategory = risk.subCategory;
          update.title = risk.title;
          update.riskDescription = risk.riskDescription;
          update.probability = risk.probability;
          update.impact = risk.impact;
          update.owner = authUser.id;
          update.action = risk.action;
          update.actions = [
            {
              Action: risk.action,
              ActionOwner: risk.owner,
              ActionDueDate: risk.actionDueDate,
            },
          ];
          update.comments = risk.comments;
          update.dateRaised = moment().format(dateFormat);
          update.dateClosed = moment().format(dateFormat);
          update.companiesID = companyId
        })
      );
    }
    Fetching(false);
    setAlert(false);
    getRiskData();
  };

  const onRowEditingStarted = (params) => {
    params.node.setDataValue('actions', true)
    const event = new CustomEvent('editStarted', {
      detail: { params }
    })

    document.dispatchEvent(event)
  }

  const addRows = (props) => {
    gridApi.redrawRows();
    props.api.stopEditing(true);
    const risk = props.data;
    risk.status = 'New';
    if (!risk.riskType) {
      risk.riskType = 'Technology'
    }
    entrySubmit(risk);
  }

  const externalFilterChanged = (newValue) => {
    console.log(newValue)
    gridApi.onFilterChanged();
  };

  const isExternalFilterPresent = () => {
    console.log()
    return false;
  };

  const doesExternalFilterPass = (node) => {
    console.log(node)
  };

  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader color="rose" stats icon>
            <CardIcon color="primary">
              <Assignment />
            </CardIcon>
          </CardHeader>
          <CardBody>
            <div
              id="myGrid"
              className="ag-theme-alpine"
              style={{ height: 600, width: "100%" }}
            >
              <AgGridReact
                rowData={rowData}
                getRowNodeId={data => data.id}
                defaultColDef={{
                  editable: true,
                  resizable: true,
                  sortable: true,
                  filter: true
                }}
                editType="fullRow"
                onGridReady={onGridReady}
                onCellValueChanged={onCellValueChanged}
                frameworkComponents={frameworkComponents}
                onRowEditingStarted={onRowEditingStarted}
                onFilterChanged={onFilterChanged}
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
              >
                <AgGridColumn
                  field="riskId"
                  editable={false}
                />
                {authUser.role === Roles.SUPER_ADMIN && (
                  <AgGridColumn
                    field="companiesID"
                    cellEditor="agSelectCellEditor"
                    cellEditorParams={{
                      cellHeight: 50,
                      values: allCompanies.map(item => item.value),
                      formatValue: (value) =>
                        allCompanies.find((item) => item.value === value)?.label,
                    }}
                    valueFormatter={(params) =>
                      allCompanies.find((item) => item.value === params.value)
                        ?.label
                    }
                  />
                )}
                <AgGridColumn
                  field="status"
                  cellEditor="agSelectCellEditor"
                  cellEditorParams={{
                    cellHeight: 50,
                    values: StatusType.map((item) => item.value),
                    formatValue: (value) =>
                      StatusType.find((item) => item.value === value)?.label,
                  }}
                  valueFormatter={(params) =>
                    StatusType.find((item) => item.value === params.value)
                      ?.label
                  }
                />
                <AgGridColumn
                  field="riskType"
                  onChange={() => externalFilterChanged('everyone')}
                  // cellEditor="agSelectCellEditor"
                  cellEditor="customselectEditor"
                  cellEditorParams={{
                    values: Object.keys(RiskType),
                    cellHeight: 39,
                  }}                  
                />
                <AgGridColumn
                  field="subCategory"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="customselectEditor"
                  cellEditorParams={{
                    cellHeight: 40,
                  }}
                />
                <AgGridColumn
                  headerName="Title"
                  field="title"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="simpleEditor"
                />
                <AgGridColumn
                  headerName="Description"
                  field="riskDescription"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="simpleEditor"
                />
                <AgGridColumn
                  field="probability"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="agSelectCellEditor"
                  cellEditorParams={{
                    cellHeight: 50,
                    values: Probability.map((_, index) => index + 1),
                    formatValue: (value) => Probability[value - 1],
                  }}
                  cellStyle= {params => {
                    if (params.value === 1) {
                      //green
                      return {backgroundColor: '#2dc937'};
                    }
                    if (params.value === 2) {
                      //mark police cells as red
                      return {backgroundColor: '#99c140'};
                    }
                    if (params.value === 3) {
                    //mark police cells as red
                    return {backgroundColor: '#e7b416'};
                    }
                    if (params.value === 4) {
                    //mark police cells as red
                    return {backgroundColor: '#db7b2b'};
                    }
                    if (params.value === 5) {
                    //mark police cells as red
                    return {backgroundColor: '#cc3232'};
                    }
                    return null;
                }}
                  valueFormatter={(params) => Probability[params.value - 1]}
                  
                />
                <AgGridColumn
                  field="impact"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="agSelectCellEditor"
                  cellEditorParams={{
                    cellHeight: 50,
                    values: Impact.map((_, index) => index + 1),
                    formatValue: (value) => Impact[value - 1],
                  }}
                  maxWidth={100}
                  valueFormatter={(params) => Impact[params.value - 1]}
                />
                <AgGridColumn
                  field="owner"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="agSelectCellEditor"
                  cellEditorParams={{
                    cellHeight: 30,
                    values: Array.isArray(customers) && customers.map((item) => item.value),
                    formatValue: (value) =>
                      customers.find((item) => item.value === value)?.label,
                  }}
                  valueFormatter={(params) =>
                    customers.find((item) => item.value === params.value)
                      ?.label || ""
                  }
                />
                <AgGridColumn
                  field="action"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="simpleEditor"
                />
                <AgGridColumn
                  field="actionDueDate"
                  cellEditor={'dateEditor'}
                  filterParams={{
                    clearButton: true,
                    suppressAndOrCondition: true,
                    comparator: function (filterLocalDateAtMidnight, cellValue) {
                      var dateAsString = cellValue;
                      var dateParts = dateAsString.split("/");
                      var cellDate = new Date(
                        Number(dateParts[2]),
                        Number(dateParts[1]) - 1,
                        Number(dateParts[0])
                      );
                      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                        return 0;
                      }
                      if (cellDate < filterLocalDateAtMidnight) {
                        return -1;
                      }
                      if (cellDate > filterLocalDateAtMidnight) {
                        return 1;
                      }
                    }
                  }}
                />
                <AgGridColumn
                  field="comments"
                  sortable={true}
                  filter={true}
                  editable={true}
                  cellEditor="simpleEditor"
                />
                <AgGridColumn
                  field="actions"
                  headerName=""
                  colId="actions"
                  filter={false}
                  editable={false}
                  cellRenderer="actionsRenderer"
                  cellEditorParams={{
                    addRows: (index) => addRows(index)
                  }}
                />
              </AgGridReact>
            </div>
          </CardBody>
        </Card>
      </GridItem>
      <AddModal
        alert={alert}
        setAlert={setAlert}
        selectedRowData={[]}
        customers={customers}
        onSubmit={entrySubmit}
        onEditSubmit={entryEditSubmit}
      />
    </GridContainer>
  );
}
