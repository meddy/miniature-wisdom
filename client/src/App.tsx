import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import CreateAdmin from "./CreateAdmin";
import SignIn from "./SignIn";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/setup" component={CreateAdmin} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
