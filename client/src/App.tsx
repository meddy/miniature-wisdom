import React from "react";
import { useQuery } from "react-query";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import SignIn from "./SignIn";
import Home from "./Home";

function App() {
  // get admin
  // if no admin -> create admin
  // if admin but not authenticated -> login
  const { isLoading, error, data } = useQuery("user", async () => {
    const response = await fetch("/api/users/admin");
    return response.json();
  });

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
