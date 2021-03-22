import React from "react";
import { useQuery } from "react-query";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import * as messages from "minature-wisdom-lib/messages";

import SignIn from "./SignIn";
import Home from "./Home";

function App() {
  // get admin
  // if no admin -> create admin
  // if admin but not authenticated -> login
  const { isError, error } = useQuery<any, Error>(
    "admin",
    async () => {
      const response = await fetch("/api/users/admin");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    { retry: false }
  );

  // how share errors
  if (isError && error && error.message === messages.ADMIN_UNDEFINED) {
    console.log("test");
  }

  return (
    <BrowserRouter>
      <CssBaseline />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/sign-in" component={SignIn} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
