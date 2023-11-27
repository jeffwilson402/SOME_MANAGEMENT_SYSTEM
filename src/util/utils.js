import { Companies } from "../models";

export const getCapital = (str: string) => {
  str += "AAA";
  str = str.replace(/[^a-zA-Z]+/g, "");
  str = str.toUpperCase();
  return str.substring(0, 4);
};

export function pad(n: number) {
  var s = "000" + (n + 1);
  return s;
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const initialCompany: Companies = {
  name: "",
  phone: "",
  address1: "",
  address2: "",
  vat: "",
  email: "",
  address: "",
  city: "",
  postcode: "",
  country: "",
  note: "",
  code: "",
};
