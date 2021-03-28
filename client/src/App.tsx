import CssBaseline from "@material-ui/core/CssBaseline";
import * as messages from "minature-wisdom-lib/messages";
import React from "react";
import { useQuery } from "react-query";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./Home";
import SignIn from "./SignIn";

// disable eslint plugin
// apply eslint at lowest level
// full stack spa starter?
// handle eslint through husky and PHP storm

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
