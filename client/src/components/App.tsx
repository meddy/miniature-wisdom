import * as messages from "minature-wisdom-lib/messages";
import React from "react";
import { useQuery } from "react-query";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import api, { ApiError } from "../util/api";
import AppLoading from "./AppLoading";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function App() {
  const { pathname: path } = useLocation();

  const { isLoading, isError, error, data: user } = useQuery<any, ApiError>(
    "admin",
    () => api.get("/users/admin"),
    { retry: false }
  );

  if (isLoading) {
    return <AppLoading />;
  }

  console.log(isError, error, user);

  return (
    <Switch>
      {isError &&
        error?.message === messages.ADMIN_UNDEFINED &&
        path !== "/sign-up" && <Redirect to="/sign-up" />}
      {isError &&
        error?.message === messages.UNAUTHENTICATED &&
        path !== "/sign-in" && <Redirect to="/sign-in" />}
      {user && ["/sign-up", "/sign-in"].includes(path) && <Redirect to="/" />}
      <Route component={Home} exact path="/" />
      <Route component={SignIn} path="/sign-in" />
      <Route component={SignUp} path="/sign-up" />
    </Switch>
  );
}
