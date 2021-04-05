import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useMutation } from "react-query";

import api, { ApiError } from "../util/api";

const useStyles = makeStyles((theme) => ({
  toolbarTitle: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const classes = useStyles();

  const { isLoading: isLoggingOut, mutate: logout } = useMutation<
    void,
    ApiError,
    void
  >(() => api.delete("/users/session"));

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.toolbarTitle} noWrap variant="h6">
            Miniature Wisdom
          </Typography>
          <Button
            color="inherit"
            disabled={isLoggingOut}
            onClick={(event) => {
              event.preventDefault();
              logout();
              // get query client to refetch user
            }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
