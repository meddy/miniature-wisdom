import * as messages from "minature-wisdom-lib/messages";
import React from "react";
import { useQuery } from "react-query";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import { ApiError, get } from "../util/api";
import AppLoading from "./AppLoading";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function App() {
  const { pathname: path } = useLocation();

  const { isLoading, isError, error, data: user } = useQuery<any, ApiError>(
    "admin",
    () => get("/api/users/admin"),
    { retry: false }
  );

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <Switch>
      {isError &&
        error?.message === messages.ADMIN_UNDEFINED &&
        path !== "/sign-up" && <Redirect to="/sign-up" />}
      {isError &&
        error?.message === messages.UNAUTHENTICATED &&
        path !== "/sign-in" && <Redirect to="/sign-in" />}
      {user && ["/sign-up", "/sign-in"].includes(path) && <Redirect to="/" />}
      <Route exact path="/" component={Home} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
    </Switch>
  );
}
