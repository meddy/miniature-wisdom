export class ApiError extends Error {
  messages;

  constructor(generalMessage: string, messages?: Record<string, string[]>) {
    super(generalMessage);
    this.messages = messages;
  }
}

export function get<TData>(url: string) {
  return doFetch<TData>(url, "GET");
}

export function post<TData>(url: string, body: object) {
  return doFetch<TData>(url, "POST", body);
}

async function doFetch<TData>(
  url: string,
  method: "GET" | "POST",
  body?: object
) {
  const options: RequestInit = { method };
  if (body) {
    options.headers = {
      "content-type": "application/json;charset=UTF-8",
    };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  type JSONResponse = {
    data?: TData;
    error?: string;
    errors?: Record<string, string[]>;
  };

  const data: JSONResponse = await response.json();
  if (!response.ok) {
    if (data.errors) {
      throw new ApiError("payload error", data.errors);
    }

    if (data.error) {
      throw new ApiError(data.error);
    }
  }

  return data;
}
