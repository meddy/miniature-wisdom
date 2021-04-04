import React from "react";
import { useMutation } from "react-query";

import { post } from "../util/api";
import AuthForm, { Credentials } from "./AuthForm";

export default function CreateAdmin() {
  const { isLoading, mutate } = useMutation<any, Error, Credentials>(
    (credentials) => post("/api/users/admin", credentials)
  );

  return (
    <AuthForm
      loading={isLoading}
      title="Setup"
      submitLabel="Create Admin Account"
      onSubmit={mutate}
    />
  );
}
