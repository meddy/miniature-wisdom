import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import api, { ApiError } from "../api";
import AuthForm, { Credentials } from "./AuthForm";

export default function CreateAdmin() {
  const { data, isLoading, mutate, error } = useMutation<
    any,
    ApiError,
    Credentials
  >((credentials) => api.post("/users/admin", credentials));

  const queryClient = useQueryClient();
  useEffect(() => {
    if (data) {
      queryClient.setQueryData("admin", data);
    }
  }, [data, queryClient]);

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
