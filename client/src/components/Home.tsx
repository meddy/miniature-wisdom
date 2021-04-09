import { Container, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import React from "react";

import Header from "./Header";

export default function Home() {
  return (
    <>
      <Header />
      <Container>
        <IconButton>
          <AddIcon />
        </IconButton>
      </Container>
    </>
  );
}
