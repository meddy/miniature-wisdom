import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import api, { ApiError } from "../api";

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
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
      queryClient.invalidateQueries("admin");
    }
  }, [loggedOut, queryClient]);

  return (
    <AppBar className={classes.container} position="static">
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
          }}
        >
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
