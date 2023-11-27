import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import { useAuth } from "./util/use-auth";
import SignIn from "./views/SignIn";
import { createBrowserHistory } from "history";
const hist = createBrowserHistory();

const App = () => {
  const { authUser } = useAuth();
  return (
    <HashRouter history={hist}>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/signin" component={SignIn} />
        <Redirect to={authUser ? "/admin/" : "/signin"} />
      </Switch>
    </HashRouter>
  );
};

export default App;
