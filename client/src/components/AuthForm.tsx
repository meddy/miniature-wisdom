import {
  Avatar,
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export interface Credentials {
  username: string;
  password: string;
}

interface AuthFormProps {
  title: string;
  submitLabel?: string;
  onSubmit: (credentials: Credentials) => void;
  loading: boolean;
  errors?: {
    username?: string;
    password?: string;
  };
}

export default function AuthForm(props: AuthFormProps) {
  const { title, submitLabel, onSubmit, loading, errors } = props;
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(errors?.username);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(errors?.password);

  useEffect(() => {
    setUsernameError(errors?.username);
    setPasswordError(errors?.password);
  }, [errors]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ username, password });
          }}
        >
          <TextField
            autoComplete="username"
            autoFocus
            disabled={loading}
            error={!!usernameError}
            fullWidth
            helperText={usernameError}
            id="username"
            label="Username"
            margin="normal"
            name="username"
            onChange={(event) => {
              setUsername(event.target.value);
              setUsernameError(undefined);
            }}
            required
            value={username}
            variant="outlined"
          />
          <TextField
            autoComplete="on"
            disabled={loading}
            error={!!passwordError}
            fullWidth
            helperText={passwordError}
            id="password"
            label="Password"
            margin="normal"
            name="password"
            onChange={(event) => {
              setPassword(event.target.value);
              setPasswordError(undefined);
            }}
            required
            type="password"
            value={password}
            variant="outlined"
          />
          <Button
            className={classes.submit}
            color="primary"
            disabled={loading}
            fullWidth
            type="submit"
            variant="contained"
          >
            {submitLabel ?? title}
          </Button>
        </form>
      </div>
    </Container>
  );
}
