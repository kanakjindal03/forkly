const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api/v1";

function makeRequest(path, options, accessToken) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      ...options.headers,
    },
  });
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(
    "forkly:refreshToken"
  );

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(
    `${API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Your session has expired");
  }

  localStorage.setItem(
    "forkly:accessToken",
    result.data.accessToken
  );

  localStorage.setItem(
    "forkly:refreshToken",
    result.data.refreshToken
  );

  return result.data.accessToken;
}

export async function apiRequest(
  path,
  options = {}
) {
  let accessToken = localStorage.getItem(
    "forkly:accessToken"
  );

  let response = await makeRequest(
    path,
    options,
    accessToken
  );

  const isAuthenticationRequest =
  path === "/auth/login" ||
  path === "/auth/register" ||
  path === "/auth/google" ||
  path === "/auth/refresh";

  if (
    response.status === 401 &&
    !isAuthenticationRequest
  ) {
    try {
      accessToken = await refreshAccessToken();

      response = await makeRequest(
        path,
        options,
        accessToken
      );
    } catch {
      localStorage.removeItem(
        "forkly:accessToken"
      );
      localStorage.removeItem(
        "forkly:refreshToken"
      );

      throw new Error(
        "Your session has expired. Please sign in again."
      );
    }
  }

  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error?.message ||
        "Something went wrong"
    );
  }

  return result.data;
}