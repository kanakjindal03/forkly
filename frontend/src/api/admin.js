const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api/v1";

const ACCESS_TOKEN_KEY =
  "forkly:admin:accessToken";

const REFRESH_TOKEN_KEY =
  "forkly:admin:refreshToken";

const USER_KEY = "forkly:admin:user";

async function readResponse(response) {
  if (response.status === 204) return null;

  const result = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Something went wrong"
    );
  }

  return result.data;
}

async function refreshAdminToken() {
  const refreshToken = sessionStorage.getItem(
    REFRESH_TOKEN_KEY
  );

  if (!refreshToken) {
    throw new Error("Admin session has expired");
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

async function adminRequest(path, options = {}) {
  let accessToken = sessionStorage.getItem(
    ACCESS_TOKEN_KEY
  );

  const makeRequest = (token) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    });

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    accessToken = await refreshAdminToken();
    response = await makeRequest(accessToken);
  }

  return readResponse(response);
}

export async function loginAdmin(
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await readResponse(response);

  if (data.user.role !== "ADMIN") {
    throw new Error(
      "This account is not an admin account"
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

export function getSavedAdmin() {
  try {
    const saved =
      sessionStorage.getItem(USER_KEY);

    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function logoutAdmin() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getAdminStats() {
  return adminRequest("/admin/stats");
}

export function getRestaurantApplications() {
  return adminRequest(
    "/admin/restaurants/applications"
  );
}

export function reviewRestaurantApplication(
  restaurantId,
  approve
) {
  return adminRequest(
    `/admin/restaurants/${restaurantId}/review`,
    {
      method: "PATCH",
      body: JSON.stringify({ approve }),
    }
  );
}

export function getPartnerApplications() {
  return adminRequest(
    "/admin/delivery-partners/applications"
  );
}

export function reviewPartnerApplication(
  partnerId,
  approve
) {
  return adminRequest(
    `/admin/delivery-partners/${partnerId}/review`,
    {
      method: "PATCH",
      body: JSON.stringify({ approve }),
    }
  );
}

export function getAdminUsers() {
  return adminRequest(
    "/admin/users?role=CUSTOMER&limit=100"
  );
}

export function setAdminUserActive(userId, isActive) {
  return adminRequest(`/admin/users/${userId}/active`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export function getAdminRestaurants() {
  return adminRequest("/admin/restaurants?limit=100");
}

export function setAdminRestaurantStatus(restaurantId, status) {
  return adminRequest(
    `/admin/restaurants/${restaurantId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}
export function getAdminPartners() {
  return adminRequest(
    "/admin/delivery-partners?limit=100"
  );
}

export function setAdminPartnerStatus(
  partnerId,
  status
) {
  return adminRequest(
    `/admin/delivery-partners/${partnerId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}
export function getAdminOrders() {
  return adminRequest("/admin/orders?limit=100");
}

export function getAdminCategories() {
  return adminRequest("/categories");
}

export function createAdminCategory(categoryData) {
  return adminRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
}

export function getAdminOffers() {
  return adminRequest("/admin/offers");
}

export function toggleAdminOffer(offerId) {
  return adminRequest(
    `/admin/offers/${offerId}/toggle`,
    {
      method: "PATCH",
    }
  );
}