import React from "react";
// react plugin for creating charts

import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { AgGridColumn, AgGridReact } from "ag-grid-react";
// import { ChangeDetectionStrategyType } from 'ag-grid-react/lib/changeDetectionService'
import { useEffect, useState } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useAuth } from "util/use-auth";
import {
  Risks,
  Roles,
  Customers,
  CustomersCompanies,
  Action,
  Companies,
} from "../../models";
import { DataStore, Predicates, SortDirection } from "@aws-amplify/datastore";
import { Cookies } from "react-cookie";
import CustomEditorComponent from "components/AgGrid/CustomEditorComponent.js";
import ReactSelectCellEditor from "components/AgGrid/ReactSelectCellEditor.js";

// Aggrid
import { StatusType, Probability, Impact } from "util/RiskData";
import AddModal from "./AddModal";
import { useBackdrop } from "util/use-load";
import moment from "moment";
import Button from "components/CustomButtons/Button.js";
import GridComponents from "components/AgGrid/Components";
import "./app.css";
const dateFormat = "YYYY-MM-DD";

export default function EntriesView() {
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [customers, setCustomers] = useState();
  const [alert, setAlert] = useState(false);
  const { authUser } = useAuth();
  const companyId = new Cookies().get("companyId");
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

    setRowData(
      records.map((element: Risks) => {
        const item: Risks = { ...element };
        const action: Action = item.actions.length ? item.actions[0] : {};
        item.total = item.total || item.impact * item.probability;
        item.impactCost = item.impactCost || getImpactCostData(item);
        item.indicativeLiveExposure =
          item.indicativeLiveExposure || getIndicativeData(item);
        return {
          ...item,
          action: action.Action,
          actionDueDate: action.ActionDueDate,
        };
      })
    );
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
    } else if (authUser.role !== undefined) {
      records = [await DataStore.query(Customers, authUser.id)];
    }

    setCustomers(
      Array.isArray(records) &&
        records.map((item: Customers) => {
          return {
            label: item.firstName + " " + item.lastName,
            value: item.id,
          };
        })
    );
  };

  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (customers) {
      getRiskData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onCellValueChanged = (params) => {
    const colId = params.colDef.field;
    if (colId === "impactCost" || colId === "indicativeLiveExposure") return;

    params.node.setDataValue("impactCost", getImpactCostData(params.data));
    params.node.setDataValue(
      "indicativeLiveExposure",
      getIndicativeData(params.data)
    );

    if (window.agGrid?.editing) {
      window.agGrid.editing = false;
      gridApi.stopEditing(true);
    }

    savingTime = setTimeout(() => {
      if (params.data.id) {
        saveEntries(params.data);
      }
      if (savingTime) {
        clearTimeout(savingTime);
      }
    }, 500);
  };

  const getImpactCostData = (data: Risks) => {
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

  const getIndicativeData = (data: Risks) => {
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
        })
      );
    }
  };

  // const subCategoryCellEditorParams = (params) => {
  //   const selectedType = params.data.riskType;
  //   const allowedCategories = RiskType[selectedType];
  //   return {
  //     cellHeight: 40,
  //     values: allowedCategories,
  //   };
  // };

  const frameworkComponents = {
    simpleEditor: GridComponents.SimpleEditor,
    customEditor: CustomEditorComponent,
    dateEditor: GridComponents.DateEditor,
    customselectEditor: ReactSelectCellEditor,
    actionsRenderer: GridComponents.ActionsRenderer,
  };

  function pad(n: number) {
    var s = "0000" + (n + 1);
    return s.substr(s.length - 5);
  }

  const entrySubmit = async (risk: Risks) => {
    if (!risk.id) {
      if (!risk.companiesID) {
        window.alert("Please select one company");
        return;
      }

      if (!risk.riskType || !risk.status) {
        window.alert("Please check Require fields");
        return;
      }

      if (!risk.subCategory) {
        window.alert("Please check SubCategory field");
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

      const company: Companies = await DataStore.query(
        Companies,
        risk.companiesID
      );

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
          probability: risk.probability || 1,
          impact: risk.impact || 1,
          owner: authUser.id,
          action: risk.action,
          actions: [
            {
              Action: risk.actions,
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
        })
      );
    }
    Fetching(false);
    setAlert(false);
    getRiskData();
  };

  const onRowEditingStarted = (params) => {
    params.node.setDataValue("actions", true);
    const event = new CustomEvent("editStarted", {
      detail: { params },
    });

    document.dispatchEvent(event);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" stats icon>
              <CardIcon color="primary">
                <Icon>content_copy</Icon>
              </CardIcon>
              <Button
                color="primary"
                size="lg"
                onClick={() => {
                  setAlert(true);
                }}
              >
                Add
              </Button>
            </CardHeader>
            <CardBody>
              <div
                id="myGrid"
                className="ag-theme-alpine"
                style={{ height: 600, width: "100%" }}
              >
                <AgGridReact
                  rowData={rowData}
                  getRowNodeId={(data) => data.id}
                  defaultColDef={{
                    editable: true,
                    resizable: true,
                    cellStyle: {fontSize: '16px'}
                  }}
                  editType="fullRow"
                  onGridReady={onGridReady}
                  onCellValueChanged={onCellValueChanged}
                  frameworkComponents={frameworkComponents}
                  onRowEditingStarted={onRowEditingStarted}
                >
                  <AgGridColumn
                    field="riskId"
                    sortable={true}
                    filter={true}
                    editable={false}
                  />
                  <AgGridColumn
                    field="status"
                    sortable={true}
                    filter={true}
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
                    sortable={true}
                    filter={true}
                    editable={true}
                    cellEditor="customselectEditor"
                    cellEditorParams={{
                      cellHeight: 39,
                    }}
                  />
                  <AgGridColumn
                    field="top10"
                    sortable={true}
                    filter={true}
                    editable={true}
                    cellEditor="agSelectCellEditor"
                    cellEditorParams={{
                      cellHeight: 50,
                      values: ["Y", "N"],
                      formatValue: (value) => (value === "Y" ? "Yes" : "No"),
                    }}
                    valueFormatter={(params) =>
                      params.value === "Y" ? "Yes" : "No"
                    }
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
                    field="dateRaised"
                    cellEditor={"dateEditor"}
                    filter={"agDateColumnFilter"}
                    filterParams={{
                      clearButton: true,
                      suppressAndOrCondition: true,
                      comparator: function (
                        filterLocalDateAtMidnight,
                        cellValue
                      ) {
                        var dateAsString = cellValue;
                        var dateParts = dateAsString.split("/");
                        var cellDate = new Date(
                          Number(dateParts[2]),
                          Number(dateParts[1]) - 1,
                          Number(dateParts[0])
                        );
                        if (
                          filterLocalDateAtMidnight.getTime() ===
                          cellDate.getTime()
                        ) {
                          return 0;
                        }
                        if (cellDate < filterLocalDateAtMidnight) {
                          return -1;
                        }
                        if (cellDate > filterLocalDateAtMidnight) {
                          return 1;
                        }
                      },
                    }}
                  />
                  <AgGridColumn
                    field="dateClosed"
                    cellEditor={"dateEditor"}
                    filter={"agDateColumnFilter"}
                    filterParams={{
                      clearButton: true,
                      suppressAndOrCondition: true,
                      comparator: function (
                        filterLocalDateAtMidnight,
                        cellValue
                      ) {
                        var dateAsString = cellValue;
                        var dateParts = dateAsString.split("/");
                        var cellDate = new Date(
                          Number(dateParts[2]),
                          Number(dateParts[1]) - 1,
                          Number(dateParts[0])
                        );
                        if (
                          filterLocalDateAtMidnight.getTime() ===
                          cellDate.getTime()
                        ) {
                          return 0;
                        }
                        if (cellDate < filterLocalDateAtMidnight) {
                          return -1;
                        }
                        if (cellDate > filterLocalDateAtMidnight) {
                          return 1;
                        }
                      },
                    }}
                  />
                  <AgGridColumn
                    field="impactCost"
                    sortable={true}
                    filter={true}
                    editable={false}
                    valueFormatter={(params) => {
                      const value = params.data.impactCost;
                      if (value) return "£" + value;
                      return "FALSE";
                    }}
                  />
                  <AgGridColumn
                    field="indicativeLiveExposure"
                    sortable={true}
                    filter={true}
                    editable={false}
                    valueFormatter={(params) => {
                      const value = params.value;
                      if (value) return "£" + value;
                      return "FALSE";
                    }}
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
                    valueFormatter={(params) => Probability[params.value - 1]}
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
                    field="total"
                    sortable={true}
                    filter={true}
                    editable={false}
                  />
                  <AgGridColumn
                    field="owner"
                    sortable={true}
                    filter={true}
                    editable={true}
                    cellEditor="agSelectCellEditor"
                    cellEditorParams={{
                      cellHeight: 30,
                      values:
                        Array.isArray(customers) &&
                        customers.map((item) => item.value),
                      formatValue: (value) =>
                        customers.find((item) => item.value === value)?.label,
                    }}
                    valueFormatter={(params) =>
                      customers.find((item) => item.value === params.value)
                        ?.label || "Admin"
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
                    cellEditor={"dateEditor"}
                    filterParams={{
                      clearButton: true,
                      suppressAndOrCondition: true,
                      comparator: function (
                        filterLocalDateAtMidnight,
                        cellValue
                      ) {
                        var dateAsString = cellValue;
                        var dateParts = dateAsString.split("/");
                        var cellDate = new Date(
                          Number(dateParts[2]),
                          Number(dateParts[1]) - 1,
                          Number(dateParts[0])
                        );
                        if (
                          filterLocalDateAtMidnight.getTime() ===
                          cellDate.getTime()
                        ) {
                          return 0;
                        }
                        if (cellDate < filterLocalDateAtMidnight) {
                          return -1;
                        }
                        if (cellDate > filterLocalDateAtMidnight) {
                          return 1;
                        }
                      },
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
                  />
                </AgGridReact>
              </div>
            </CardBody>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
        {alert && (
          <AddModal
            alert={alert}
            setAlert={setAlert}
            selectedRowData={[]}
            customers={customers}
            onSubmit={entrySubmit}
            onEditSubmit={entryEditSubmit}
          />
        )}
      </GridContainer>
    </div>
  );
}
