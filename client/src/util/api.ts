export class ApiError extends Error {
  messages;

  constructor(generalMessage: string, messages?: Record<string, string>) {
    super(generalMessage);
    this.messages = messages;
  }
}

async function doFetch<TData>(
  endpoint: string,
  method: "GET" | "POST" | "DELETE",
  body?: object
) {
  const options: RequestInit = { method };
  if (body) {
    options.headers = {
      "content-type": "application/json;charset=UTF-8",
    };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`/api/${endpoint}`, options);

  type JSONResponse = {
    data?: TData;
    error?: string;
    errors?: Record<string, string>;
  };

  const { data, error, errors }: JSONResponse = await response.json();
  if (!response.ok) {
    if (errors) {
      throw new ApiError("validation error", errors);
    }

    if (error) {
      throw new ApiError(error);
    }
  }

  return data;
}

const api = {
  get<TData>(url: string) {
    return doFetch<TData>(url, "GET");
  },

  post<TData>(url: string, body: object) {
    return doFetch<TData>(url, "POST", body);
  },

  delete(url: string) {
    return doFetch<void>(url, "DELETE");
  },
};

export default api;
