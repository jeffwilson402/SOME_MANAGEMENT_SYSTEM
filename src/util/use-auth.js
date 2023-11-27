import React, { useState, useEffect, useContext, createContext } from "react";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../aws-exports";

import { Cookies } from "react-cookie";
import { DataStore } from "aws-amplify";
import { Customers } from "../models";

const authContext = createContext();
Amplify.configure(awsconfig);
// Provider component that wraps app and makes auth object ..
// ... available to any child component that calls useAuth().

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const [authUser, setAuthUser] = useState({});
  const [loadingAuthUser, setLoadingAuthUser] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isAuthentication, setIsAuthentication] = useState(false);

  const fetchStart = () => {
    setLoading(true);
    setError("");
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError("");
  };

  const fetchError = (error) => {
    setLoading(false);
    setError(error);
  };

  const userLogin = (data) => {
    fetchStart();
    return new Promise((resolve, reject) => {
      Auth.signIn(data.email, data.password)
        .then(async (user) => {
          if (user) {
            fetchSuccess();
            getAuthUser(resolve, reject);
            // setAuthUser({ username: user.username }); 
            // resolve(user.username);
          } else {
            fetchError("not Found User data!");
            reject("Not Found User data!");
          }
        })
        .catch(function (error) {
          Auth.signOut();
          fetchError(error.message);
          reject(error);
        });
    });
  };

  const getUserProfile = (username, callback, rejectCallback) => {
    return new Promise((resolve, reject) => {
      DataStore.query(Customers, (qu) => qu.username("eq", username))
        .then((record) => {
          if (record.length) {
            const user = record[0];
            setAuthUser({
              role: user.role,
              email: user.email,
              companiesID: user.companiesID,
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              isTemp: user.isTemp,
              loading: authUser.loading ? authUser.loading + 1 : 1,
            });
            if(callback) callback(username);
            resolve(true);
          } else {
            if(rejectCallback) rejectCallback('No User!')
            fetchError('No User!!');
            reject('No User!!')
          }
        })
        .catch((error) => {
          fetchError(error.message);
          reject(false);
        });
    });
  };

  const userSignup = (data, callbackFun) => {
    fetchStart();
    // Auth.confirmSignUp("sabirli31@gmail.com", "852787").then(res => {
    //   console.log(res);
    // })
    // return;
    Auth.signUp({
      username: data.email,
      password: data.password,
      attributes: {
        email: data.email,
      },
    })
      .then(({ user }) => {
        if (user) {
          fetchSuccess();
          Auth.setPreferredMFA(user, "NOMFA").then((res) => {
          });
          if (callbackFun) callbackFun();
        } else {
          fetchError("Not found user data!");
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const userSignOut = (callbackFun) => {
    fetchStart();
    Auth.signOut()
      .then(() => {
        fetchSuccess();
        setAuthUser(false);
        const cookies = new Cookies();
        cookies.remove("token");
        if (callbackFun) callbackFun();
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const getAuthUser = (callback, reject) => {
    fetchStart();
    Auth.currentAuthenticatedUser({
      bypassCache: true,
    })
      .then((user) => {
        getUserProfile(user.username, callback, reject);
      })
      .catch(function (error) {
        fetchError(error.message);
        reject(error.message)
      });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    })
      .then((user) => {
        if (user) {
          getUserProfile(user.username).then(() => {
            setLoadingAuthUser(false);
          });
        }
      })
      .catch(function (error) {
        setLoadingAuthUser(false);
        setAuthUser(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsAuthentication(authUser?.id);
  }, [authUser]);

  // Return the user object and auth methods
  return {
    loadingAuthUser,
    isLoading,
    isAuthentication,
    authUser,
    error,
    setAuthUser,
    getAuthUser,
    userLogin,
    userSignup,
    userSignOut,
    getUserProfile,
  };
};

export const isUnRestrictedRoute = (pathname) => {
  return (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  );
};
