import { Container, makeStyles } from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";

const useStyles = makeStyles((theme) => ({
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(359deg)" },
  },
  container: {
    textAlign: "center",
  },
  loader: {
    marginTop: theme.spacing(2),
    fontSize: "5em",
    animation: "$spin 2s linear infinite",
  },
}));

export default function AppLoading() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <LoopIcon className={classes.loader} />
    </Container>
  );
}
