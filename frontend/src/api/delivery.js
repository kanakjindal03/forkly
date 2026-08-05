const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api/v1";

const ACCESS_TOKEN_KEY = "forkly:delivery:accessToken";
const REFRESH_TOKEN_KEY = "forkly:delivery:refreshToken";
const USER_KEY = "forkly:delivery:user";

async function readResponse(response) {
  if (response.status === 204) return null;

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message || "Something went wrong"
    );
  }

  return result.data;
}

async function refreshDeliveryToken() {
  const refreshToken = sessionStorage.getItem(
    REFRESH_TOKEN_KEY
  );

  if (!refreshToken) {
    throw new Error("Delivery partner session has expired");
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await readResponse(response);

  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    data.accessToken
  );

  sessionStorage.setItem(
    REFRESH_TOKEN_KEY,
    data.refreshToken
  );

  return data.accessToken;
}

async function deliveryRequest(path, options = {}) {
  let accessToken = sessionStorage.getItem(
    ACCESS_TOKEN_KEY
  );

  const makeRequest = (token) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },
    });

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    accessToken = await refreshDeliveryToken();
    response = await makeRequest(accessToken);
  }

  return readResponse(response);
}

export async function loginDeliveryPartner(
  email,
  password
) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await readResponse(response);

  if (data.user.role !== "DELIVERY_PARTNER") {
    throw new Error(
      "This account is not a delivery partner account"
    );
  }

  sessionStorage.setItem(
    ACCESS_TOKEN_KEY,
    data.accessToken
  );

  sessionStorage.setItem(
    REFRESH_TOKEN_KEY,
    data.refreshToken
  );

  sessionStorage.setItem(
    USER_KEY,
    JSON.stringify(data.user)
  );

  return data.user;
}

export function getSavedDeliveryPartner() {
  try {
    const saved = sessionStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function logoutDeliveryPartner() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getDeliveryPartnerProfile() {
  return deliveryRequest("/delivery-partners/me");
}

export function getAvailableDeliveries() {
  return deliveryRequest("/orders/deliveries/available");
}

export function getMyDeliveries() {
  return deliveryRequest("/orders/deliveries/mine?limit=100");
}

export function claimDelivery(orderId) {
  return deliveryRequest(`/orders/${orderId}/claim`, {
    method: "POST",
  });
}

export function updateDeliveryStatus(orderId, status) {
  return deliveryRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateDeliveryAvailability(isAvailable) {
  return deliveryRequest(
    "/delivery-partners/me/availability",
    {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    }
  );
}
export async function registerDeliveryPartner(
  applicationData
) {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api/v1";

  const response = await fetch(
    `${apiUrl}/auth/register/delivery-partner`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    }
  );

  const result = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Unable to submit delivery partner application"
    );
  }

  return result?.data || result;
}
export function getDeliveryEarnings() {
  return deliveryRequest(
    "/delivery-partners/me/earnings"
  );
}