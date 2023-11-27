/*!

=========================================================
* Material Dashboard PRO React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";

import App from "./app";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
import { AuthProvider } from "./util/use-auth";
import BackdropProvider from "./util/use-load";

import { AppContainer } from "react-hot-loader";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <AppContainer>
    <React.Fragment>
      <BackdropProvider>
        <AuthProvider>
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </AuthProvider>
      </BackdropProvider>
    </React.Fragment>
  </AppContainer>,
  document.getElementById("root")
);
