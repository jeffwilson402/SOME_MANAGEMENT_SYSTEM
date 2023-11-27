import API from "@aws-amplify/api";
import axios from "axios";
import awsConfig from '../aws-exports';

export const httpClient = axios.create({
  baseURL: "/api", //YOUR_API_URL HERE
  // baseURL: `http://g-axon.work/jwtauth/api/`, //YOUR_API_URL HERE
  headers: {
    "Content-Type": "application/json",
  },
});

const API_NAME = 'api729b5b04';
const PATH = '/users';

export async function createUser(payload) {
  try {
    let apiName = API_NAME;
    let path = PATH;
    const myInit = {
      body: {
        email: payload.email,
        user_poll_id: awsConfig.aws_user_pools_id,
        name: payload.username,
        role: payload.role,
        code: payload.companyCode,
        fullName: payload.fullName
      },
      headers: {
      },
    };
    return await API.post(apiName, path, myInit);
  } catch (error) {
    return Promise.reject(error.message);
  }
}



export async function updateUser(payload) {
  try {
    let apiName = API_NAME;
    let path = PATH;
    let myInit = {
      body: {
        email: payload.email,
        user_poll_id: awsConfig.aws_user_pools_id,
        name: payload.username,
        role: payload.role
      },
      headers: {
      },
    };
    return await API.put(apiName, path, myInit);
  } catch (error) {
    console.log(error);
    return Promise.reject(error.message);
  }
}

export async function deleteUser(payload) {
  try {
    let apiName = API_NAME;
    let path = PATH;
    let myInit = {
      body: {
        email: payload.email,
        user_poll_id: awsConfig.aws_user_pools_id,
        name: payload.username,
        role: payload.role
      },
      headers: {
      },
    };
    return await API.del(apiName, path, myInit);
  } catch (error) {
    console.log(error);
    return Promise.reject(error.message);
  }
}

export async function updatePassword(payload) {
  try {
    let apiName = API_NAME;
    let path = `${PATH}/updatePassword`;
    let myInit = {
      body: {
        email: payload.email,
        user_poll_id: awsConfig.aws_user_pools_id,
        password: payload.password,
      },
      headers: {
      },
    };
    return await API.put(apiName, path, myInit);
  } catch (error) {
    console.log(error);
    return Promise.reject(error.message);
  }
}
