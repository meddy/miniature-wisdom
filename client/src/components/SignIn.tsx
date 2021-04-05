import React from "react";
import { useHistory } from "react-router-dom";

import AuthForm from "./AuthForm";

export default function SignIn() {
  return <AuthForm loading={false} onSubmit={() => {}} title="Sign In" />;
}
