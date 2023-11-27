import { atom } from "recoil";
import { RiskType as RiskData } from "util/RiskData";

const type = {
  Technology: true,
  Process: true,
  Data: true,
  Asset: true,
};

const getSubCategories = () => {
  const subItems = {};

  Object.keys(type).forEach((key) => {
    Array.isArray(RiskData[key]) &&
      RiskData[key].forEach((item) => {
        subItems[item] = true;
      });
  });

  return subItems;
};

export const subCategoryState = atom({
  key: "subCategory",
  default: getSubCategories(),
});
