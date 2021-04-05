import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";

import api, { ApiError } from "../util/api";
import AuthForm, { Credentials } from "./AuthForm";

export default function SignIn() {
  const { data, isLoading, mutate, error } = useMutation<
    any,
    ApiError,
    Credentials
  >((credentials) => api.post("/users/session", credentials));

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
      title="Sign In"
    />
  );
}
