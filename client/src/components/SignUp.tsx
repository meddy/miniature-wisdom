import React from "react";
import { useMutation } from "react-query";

import { ApiError, post } from "../util/api";
import AuthForm, { Credentials } from "./AuthForm";

export default function CreateAdmin() {
  const { isLoading, mutate, error } = useMutation<any, ApiError, Credentials>(
    (credentials) => post("/api/users/admin", credentials)
  );

  return (
    <AuthForm
      errors={error?.messages}
      loading={isLoading}
      onSubmit={mutate}
      submitLabel="Create Admin Account"
      title="Setup"
    />
  );
}
