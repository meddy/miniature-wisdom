import React from "react";
import { useMutation } from "react-query";

import api, { ApiError } from "../util/api";
import AuthForm, { Credentials } from "./AuthForm";

export default function CreateAdmin() {
  const { isLoading, mutate, error } = useMutation<any, ApiError, Credentials>(
    (credentials) => api.post("/users/admin", credentials)
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
