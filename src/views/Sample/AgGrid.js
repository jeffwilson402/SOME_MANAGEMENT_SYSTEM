import React, { useRef } from "react";
// react plugin for creating charts

import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// import { MenuModule } from "@ag-grid-enterprise/menu";
// import { LicenseManager } from "ag-grid-enterprise";

const useStyles = makeStyles(styles);

export default function AgGridSample() {
  // LicenseManager.setLicenseKey(
  //   "Peace_OTY2OTQ1OTQ1Njk3Mw==7e213e88aef89910e528cf77b5ac1af0"
  // );

  const classes = useStyles();
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const onButtonClick = (e) => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.make} ${node.model}`)
      .join(", ");
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="primary">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>AgGrid Sample</p>
            </CardHeader>
            <CardBody>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: "100%" }}
              >
                <button onClick={onButtonClick}>Get selected rows</button>
                <AgGridReact
                  rowData={rowData}
                  ref={gridRef}
                  rowSelection="multiple"
                  sideBar={true}
                  animateRows={true}
                  // immutableData
                  reactNext={true}
                  rowGroupPanelShow={"always"}
                  pivotPanelShow={"always"}
                >
                  <AgGridColumn
                    field="make"
                    sortable={true}
                    filter={true}
                    checkboxSelection={true}
                  ></AgGridColumn>
                  <AgGridColumn
                    field="model"
                    sortable={true}
                    filter={true}
                  ></AgGridColumn>
                  <AgGridColumn
                    field="price"
                    sortable={true}
                    filter={true}
                  ></AgGridColumn>
                </AgGridReact>
              </div>
            </CardBody>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
