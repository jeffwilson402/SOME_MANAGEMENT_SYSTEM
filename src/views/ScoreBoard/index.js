import React, { useEffect, useState } from "react";
// react plugin for creating charts

import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Pie3 from "./Pie3";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import DataLables from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "util/use-auth";
import { Roles, Risks } from "../../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { getImpactCostData } from "util/RiskData";
import { getIndicativeData } from "util/RiskData";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { RiskType as RiskData } from "util/RiskData";
import { RiskType } from "components/d3-bubble-radar";
import { Cookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { subCategoryState } from "../../store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DataLables
);

const GreenCheckbox = withStyles({
  root: {
    color: "#6bc3ce",
    "&$checked": {
      color: "#6bc3ce",
    },
    padding: "2px 9px",
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const customStyles = {
  ...styles,
  main: {
    width: "100%",
    height: "100%",
  },
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Indicative Live Exposure (£000s)",
    },
    datalabels: {
      display: true,
      color: "black",
      anchor: "end",
      align: "end",
      offset: 2,
      formatter: (value) => {
        return "£" + value?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
      },
    },
  },
  layout: {
    padding: {
      left: 20,
      right: 60,
    },
  },
};

const useStyles = makeStyles(customStyles);

export default function ScoreBoard() {
  const classes = useStyles();
  const [initData, setInitData] = useState([]);
  const [data, setData] = useState([]);
  const [type, setType] = useState({
    Technology: true,
    Process: true,
    Data: true,
    Asset: true,
  });

  const [subCategory, setSubCategory] = useRecoilState(subCategoryState);
  const [subCategoryStatus, setSubCategoryStatus] = useState({});

  const { authUser } = useAuth();
  const companyId = new Cookies().get("companyId");

  // const getSubCategories = () => {
  //   const subItems = {};

  //   Object.keys(type).forEach((key) => {
  //     Array.isArray(RiskData[key]) &&
  //       RiskData[key].forEach((item) => {
  //         subItems[item] = true;
  //       });
  //   });

  //   setSubCategory(subItems);
  // };

  const getData = async () => {
    let records = [];
    if (authUser.role === Roles.SUPER_ADMIN) {
      records = await DataStore.query(Risks, Predicates.ALL);
    } else {
      records = await DataStore.query(Risks, (c) =>
        c.companiesID("eq", companyId)
      );
    }

    setInitData(
      records.map((element) => {
        const item = { ...element };
        item.total = item.total || item.impact * item.probability;
        item.impactCost = item.impactCost || getImpactCostData(item);
        item.indicativeLiveExposure =
          item.indicativeLiveExposure || getIndicativeData(item);

        return {
          ...item,
          type: item.riskType,
        };
      })
    );
  };

  const checkStatus = () => {
    const subItems = {};

    Object.keys(type).forEach((key) => {
      Array.isArray(RiskData[key]) &&
        RiskData[key].forEach((item) => {
          subItems[item] = type[key];
        });
    });

    setSubCategoryStatus(subItems);
  };

  // useEffect(() => {
  //   getSubCategories();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const getRiskGroupData = () => {
    const jsonData = new Map();

    data.forEach((item) => {
      if (!jsonData.has(item.type)) jsonData.set(item.type, 0);
      jsonData.set(item.type, jsonData.get(item.type) + 1);
    });

    return [
      { label: "Asset", value: jsonData.get("Asset") || 0, color: "#8d8d8c" },
      {
        label: "Data & Access",
        value: jsonData.get("Data") || 0,
        color: "#006fb5",
      },
      {
        label: "People & Process",
        value: jsonData.get("Process") || 0,
        color: "#ef0036",
      },
      {
        label: "Technology",
        value: jsonData.get("Technology") || 0,
        color: "#4caeb9",
      },
    ];
  };

  const colorData = [
    { "Infrastructure Capacity": "#006eb4" },
    { "Aging Equipment": "#8a8a89" },
    { "SPOF / Resilience": "#3f3f44" },
    { "Aging Apps / OS": "#e20033" },
    { Monitoring: "#cacaca" },
    { Environmental: "#54bdc9" },
    { "Disaster Recovery": "#346caf" },
    { "Process & Standards": "#cacaca" },
    { "Key Person Dependency": "#52b9c5" },
    { "People Capacity": "#dc0031" },
    { "Project Deployment": "#0071b8" },
    { "Supplier Management": "#80807f" },
    { "Logical Access": "#006cb1" },
    { "Physical Access": "#de0032" },
    { Data: "#868685" },
    { Vulnerabilities: "#55c0cc" },
    { Licensing: "#346caf" },
    { "Loss of IT asset": "#a4302d" },
  ];

  const getBarChartData = () => {
    const labels = ["Asset", "Data & Access", "People & Access", "Technology"];
    const types = ["Asset", "Data", "Process", "Technology"];

    const jsonData = new Map();
    data.forEach((item) => {
      if (!jsonData.has(item.type)) jsonData.set(item.type, 0);
      jsonData.set(
        item.type,
        jsonData.get(item.type) + (item.indicativeLiveExposure || 0)
      );
    });

    return {
      labels,
      datasets: [
        {
          data: types.map((key) => jsonData.get(key) || 0),
          backgroundColor: ["#8d8d8c", "#006fb5", "#ef0036", "#4caeb9"],
        },
      ],
    };
  };

  const filterData = () => {
    const allowedCategory = Object.keys(subCategory).filter(
      (key) => subCategory[key] && subCategoryStatus[key]
    );

    const filterData = cloneObject(initData)
      .filter(
        (item) =>
          item.type &&
          item.subCategory &&
          allowedCategory.includes(item.subCategory)
      )
      .map((item) => {
        const index = RiskType[item.type].indexOf(item.subCategory) + 1;
        item.subCategoryIndex = index;
        return item;
      });
    setData(filterData);
  };

  const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategory, subCategoryStatus, initData]);

  const getDataAccessRisks = (type) => {
    const jsonData = new Map();

    data
      .filter((item) => item.type === type)
      .forEach((item) => {
        if (!jsonData.has(item.subCategory)) jsonData.set(item.subCategory, 0);
        jsonData.set(item.subCategory, jsonData.get(item.subCategory) + 1);
      });

    return Array.from(jsonData.keys()).map((key) => {
      return {
        label: key,
        value: jsonData.get(key),
        color: colorData.find((item) => item[key])[key],
      };
    });
  };

  const dataGroupData = getRiskGroupData();

  return (
    <div className={classes.main}>
      <GridContainer spacing={5} style={{ paddingBottom: 20 }}>
        <GridItem xs={12} md={6}>
          <Pie3
            width={500}
            height={300}
            responsive={true}
            title={"Open Risk by Risk Group"}
            data={dataGroupData}
          />
        </GridItem>
        <GridItem xs={12} md={6}>
          <Bar
            options={options}
            data={getBarChartData()}
            height={120}
            width={null}
            style={{ background: "white" }}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} md={3}>
          <Pie3
            height={300}
            rx={170}
            title={"Data & Access Risks"}
            legendTextSize={9}
            legendPadding={2}
            data={getDataAccessRisks("Data")}
          />
        </GridItem>
        <GridItem xs={12} md={3}>
          <Pie3
            height={300}
            rx={170}
            legendTextSize={8}
            legendPadding={2}
            title={"Asset"}
            data={getDataAccessRisks("Asset")}
          />
        </GridItem>
        <GridItem xs={12} md={3}>
          <Pie3
            height={300}
            rx={170}
            legendTextSize={8}
            legendPadding={2}
            title={"People & Process"}
            data={getDataAccessRisks("Process")}
          />
        </GridItem>
        <GridItem xs={12} md={3}>
          <Pie3
            height={300}
            rx={170}
            legendTextSize={8}
            legendPadding={2}
            title={"Technology"}
            data={getDataAccessRisks("Technology")}
          />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" className={classes.legend}>
              Risk Type
            </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <GreenCheckbox
                    checked={type.Technology}
                    onChange={() =>
                      setType({ ...type, Technology: !type.Technology })
                    }
                    name="technology"
                  />
                }
                label="Technology"
                style={{ color: "#fff" }}
              />
              <FormControlLabel
                control={
                  <GreenCheckbox
                    checked={type.Process}
                    onChange={() =>
                      setType({ ...type, Process: !type.Process })
                    }
                    name="process"
                  />
                }
                label="Process"
                style={{ color: "#fff" }}
              />
              <FormControlLabel
                control={
                  <GreenCheckbox
                    checked={type.Data}
                    onChange={() => setType({ ...type, Data: !type.Data })}
                    name="data"
                  />
                }
                label="Data"
                style={{ color: "#fff" }}
              />
              <FormControlLabel
                control={
                  <GreenCheckbox
                    checked={type.Asset}
                    onChange={() => setType({ ...type, Asset: !type.Asset })}
                    name="asset"
                  />
                }
                label="Asset"
                style={{ color: "#fff" }}
              />
            </FormGroup>
          </FormControl>

          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" className={classes.legend}>
              Risk SubCategory
            </FormLabel>
            <FormGroup>
              {Object.keys(subCategory).map((key) => (
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      checked={subCategory[key]}
                      onChange={() =>
                        setSubCategory({
                          ...subCategory,
                          [key]: !subCategory[key],
                        })
                      }
                      name={key}
                    />
                  }
                  key={`${key}-subcategory`}
                  label={key}
                  disabled={!subCategoryStatus[key]}
                  style={{ color: "#fff" }}
                />
              ))}
            </FormGroup>
          </FormControl>
        </GridItem>
      </GridContainer>
    </div>
  );
}
