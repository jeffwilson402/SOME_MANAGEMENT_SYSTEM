import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import BubbleRadar, { RiskType } from "components/d3-bubble-radar";

import { Grid } from "@material-ui/core";

import { useAuth } from "util/use-auth";
import { Roles, Risks } from "../../models";
import { DataStore, Predicates } from "@aws-amplify/datastore";
import { Cookies } from "react-cookie";

const customStyles = {
  ...styles,
  main: {
    background: "#292929",
    width: "100%",
    height: 700,
  },
  title: {
    color: "white",
    fontWeight: 600,
  },
  formControl: {
    margin: 1,
  },
  legend: {
    color: "#fff !important",
  },
};


const useStyles = makeStyles(customStyles);

export default function RadarEntries() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [initData, setInitData] = useState([]);
  const { authUser } = useAuth();
  const companyId = new Cookies().get("companyId");
  const filter = new Cookies().get('filter');

  const filterData = () => {    
    const filterData = cloneObject(initData)

    if(filterData.length > 0 && filter){
      let result = getTypeFilter(filter.riskType, filterData);
      result = getSubCatFilter(filter.subCategory, result);

      const resultList = result.map((item) => {
        const index = RiskType[item.type].indexOf(item.subCategory) + 1;
        return  { impact: item.impact, probability: item.probability, subCategory: item.subCategory, total: item.total, type: item.type, subCategoryIndex: index };
      });
      setData(resultList);
    }
    else{
      const resultList = filterData.map((item) => {
        const index = RiskType[item.type].indexOf(item.subCategory) + 1;
        return  { impact: item.impact, probability: item.probability, subCategory: item.subCategory, total: item.total, type: item.type, subCategoryIndex: index };
      });
      setData(resultList);
    }
  };

  const getTypeFilter = (obj, data) => {
    if(!obj) return data;

    let result = [];
    let conditions = [];
    if(obj.operator) {
      for (let [key, value] of Object.entries(obj)) {
        if(key !==  "filterType" && key !==  "operator"){
            conditions.push({key, value})
        }                
      }

      const type_1 = conditions[0].value.type;
      const type_2 = conditions[1].value.type;

      const filter_1 = conditions[0].value.filter;
      const filter_2 = conditions[1].value.filter;

      if(obj.operator === "OR"){  
        result = data.filter(s => (type_1 === "contains" ? s.type.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "notContains" ? !s.type.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "equals" ? s.type.toLowerCase() === filter_1.toLowerCase() : 
                                  (type_1 === "notEqual" ? s.type.toLowerCase() === filter_1.toLowerCase() :
                                  (type_1 === "startsWith" ? s.type.toLowerCase().startsWith(filter_1.toLowerCase()) : 
                                  (s.type.toLowerCase().endsWith(filter_1.toLowerCase()))))))) || 
                                  (type_2 === "contains" ? s.type.toLowerCase().includes(filter_2.toLowerCase()) : 
                                  (type_2 === "notContains" ? !s.type.toLowerCase().includes(filter_2.toLowerCase()) : 
                                  (type_2 === "equals" ? s.type.toLowerCase() === filter_2.toLowerCase() : 
                                  (type_2 === "notEqual" ? s.type.toLowerCase() === filter_2.toLowerCase() :
                                  (type_2 === "startsWith" ? s.type.toLowerCase().startsWith(filter_2.toLowerCase()) : 
                                  (s.type.toLowerCase().endsWith(filter_2.toLowerCase()))))))))
        
      }
      else{
        result = data.filter(s => (type_1 === "contains" ? s.type.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "notContains" ? !s.type.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "equals" ? s.type.toLowerCase() === filter_1.toLowerCase() : 
                                  (type_1 === "notEqual" ? s.type.toLowerCase() === filter_1.toLowerCase() :
                                  (type_1 === "startsWith" ? s.type.toLowerCase().startsWith(filter_1.toLowerCase()) : 
                                  (s.type.toLowerCase().endsWith(filter_1.toLowerCase()))))))) && 
                                  (type_2 === "contains" ? s.type.toLowerCase().includes(filter_2.toLowerCase()) : 
                                  (type_2 === "notContains" ? !s.type.toLowerCase().includes(filter_2.toLowerCase()) : 
                                  (type_2 === "equals" ? s.type.toLowerCase() === filter_2.toLowerCase() : 
                                  (type_2 === "notEqual" ? s.type.toLowerCase() === filter_2.toLowerCase() :
                                  (type_2 === "startsWith" ? s.type.toLowerCase().startsWith(filter_2.toLowerCase()) : 
                                  (s.type.toLowerCase().endsWith(filter_2.toLowerCase()))))))))
      }
    }
    else{
      const _type = obj.type;
      const filter = obj.filter;

      result = data.filter(s => (_type === "contains" ? s.type.toLowerCase().includes(filter.toLowerCase()) : 
                                (_type === "notContains" ? !s.type.toLowerCase().includes(filter.toLowerCase()) : 
                                (_type === "equals" ? s.type.toLowerCase() === filter.toLowerCase() : 
                                (_type === "notEqual" ? s.type.toLowerCase() === filter.toLowerCase() :
                                (_type === "startsWith" ? s.type.toLowerCase().startsWith(filter.toLowerCase()) : 
                                (s.type.toLowerCase().endsWith(filter.toLowerCase()))))))))
    }
    return result;
  }


  const getSubCatFilter = (obj, data) => {
    if(!obj) return data;

    let result = [];
    let conditions = [];
    if(obj.operator) {
      for (let [key, value] of Object.entries(obj)) {
        if(key !==  "filterType" && key !==  "operator"){
            conditions.push({key, value})
        }                
      }

      const type_1 = conditions[0].value.type;
      const type_2 = conditions[1].value.type;

      const filter_1 = conditions[0].value.filter;
      const filter_2 = conditions[1].value.filter;

      if(obj.operator === "OR"){  
        result = data.filter(s => (type_1 === "contains" ? s.subCategory.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "notContains" ? !s.subCategory.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "equals" ? s.subCategory.toLowerCase() === filter_1.toLowerCase() : 
                                  (type_1 === "notEqual" ? s.subCategory.toLowerCase() === filter_1.toLowerCase() :
                                  (type_1 === "startsWith" ? s.subCategory.toLowerCase().startsWith(filter_1.toLowerCase()) : 
                                  (s.subCategory.toLowerCase().endsWith(filter_1.toLowerCase()))))))) || 
                                  (type_2 === "contains" ? s.subCategory.toLowerCase().includes(filter_2) : 
                                  (type_2 === "notContains" ? !s.subCategory.toLowerCase().includes(filter_2) : 
                                  (type_2 === "equals" ? s.subCategory.toLowerCase() === filter_2.toLowerCase() : 
                                  (type_2 === "notEqual" ? s.subCategory.toLowerCase() === filter_2.toLowerCase() :
                                  (type_2 === "startsWith" ? s.subCategory.toLowerCase().startsWith(filter_2.toLowerCase()) : 
                                  (s.subCategory.toLowerCase().endsWith(filter_2.toLowerCase()))))))))
        
      }
      else{
        result = data.filter(s => (type_1 === "contains" ? s.subCategory.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "notContains" ? !s.subCategory.toLowerCase().includes(filter_1.toLowerCase()) : 
                                  (type_1 === "equals" ? s.subCategory.toLowerCase() === filter_1.toLowerCase() : 
                                  (type_1 === "notEqual" ? s.subCategory.toLowerCase() === filter_1.toLowerCase() :
                                  (type_1 === "startsWith" ? s.subCategory.toLowerCase().startsWith(filter_1.toLowerCase()) : 
                                  (s.type.toLowerCase().endsWith(filter_1.toLowerCase()))))))) && 
                                  (type_2 === "contains" ? s.subCategory.toLowerCase().includes(filter_2) : 
                                  (type_2 === "notContains" ? !s.subCategory.toLowerCase().includes(filter_2) : 
                                  (type_2 === "equals" ? s.subCategory.toLowerCase() === filter_2.toLowerCase() : 
                                  (type_2 === "notEqual" ? s.subCategory.toLowerCase() === filter_2.toLowerCase() :
                                  (type_2 === "startsWith" ? s.subCategory.toLowerCase().startsWith(filter_2.toLowerCase()) : 
                                  (s.subCategory.toLowerCase().endsWith(filter_2.toLowerCase()))))))))
      }
    }
    else{
      const _type = obj.type;
      const filter = obj.filter;

      result = data.filter(s => (_type === "contains" ? s.subCategory.toLowerCase().includes(filter.toLowerCase()) : 
                                (_type === "notContains" ? !s.subCategory.toLowerCase().includes(filter.toLowerCase()) : 
                                (_type === "equals" ? s.subCategory.toLowerCase() === filter.toLowerCase() : 
                                (_type === "notEqual" ? s.subCategory.toLowerCase() === filter.toLowerCase() :
                                (_type === "startsWith" ? s.subCategory.toLowerCase().startsWith(filter.toLowerCase()) : 
                                (s.subCategory.toLowerCase().endsWith(filter.toLowerCase()))))))))
    }
    return result;
  }
  
  const cloneObject = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };

  const getData = async () => {
    let records: Risks[] = [];

    if (authUser.role === Roles.SUPER_ADMIN) {
      records = await DataStore.query(Risks, Predicates.ALL);
    } else {
      records = await DataStore.query(Risks, (c) => c.companiesID("eq", companyId));
    }

    setInitData(
      records.map((element) => {
        const item: Risks = { ...element };
        item.total = item.total || item.impact * item.probability;
        return {
          type: item.riskType,
          subCategory: item.subCategory,
          impact: item.impact,
          total: item.total,
          probability: item.probability,
        };
      })
    );
  };

  

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);

  return (
    <div className={classes.main}>
      <Grid container>
        <Grid item>
          <BubbleRadar data={data} />
        </Grid>
       
      </Grid>
    </div>
  );
}
