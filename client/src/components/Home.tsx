import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import api, { ApiError } from "../util/api";

const useStyles = makeStyles((theme) => ({
  toolbarTitle: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const classes = useStyles();

  const {
    isLoading: isLoggingOut,
    mutate: logout,
    isSuccess: loggedOut,
  } = useMutation<void, ApiError, void>(() => api.delete("/users/session"));

  const queryClient = useQueryClient();
  useEffect(() => {
    if (loggedOut) {
      queryClient.setQueryData("admin", undefined);
    }
  }, [loggedOut, queryClient]);

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
