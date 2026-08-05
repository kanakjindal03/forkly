const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api/v1";

const ACCESS_TOKEN_KEY =
  "forkly:owner:accessToken";

const REFRESH_TOKEN_KEY =
  "forkly:owner:refreshToken";

const USER_KEY = "forkly:owner:user";

async function readResponse(response) {
  if (response.status === 204) {
    return null;
  }

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

async function refreshOwnerToken() {
  const refreshToken = sessionStorage.getItem(
    REFRESH_TOKEN_KEY
  );

  if (!refreshToken) {
    throw new Error(
      "Owner session has expired"
    );
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

async function ownerRequest(
  path,
  options = {}
) {
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

  let response = await makeRequest(
    accessToken
  );

  if (response.status === 401) {
    accessToken = await refreshOwnerToken();

    response = await makeRequest(
      accessToken
    );
  }

  return readResponse(response);
}

export async function loginOwner(
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

  if (
    data.user.role !== "RESTAURANT_OWNER"
  ) {
    throw new Error(
      "This account is not a restaurant owner account"
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

export function getSavedOwner() {
  try {
    const saved =
      sessionStorage.getItem(USER_KEY);

    return saved
      ? JSON.parse(saved)
      : null;
  } catch {
    return null;
  }
}

export function logoutOwner() {
  sessionStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  sessionStorage.removeItem(
    REFRESH_TOKEN_KEY
  );

  sessionStorage.removeItem(USER_KEY);
}

export function getOwnerRestaurant() {
  return ownerRequest("/restaurants/me");
}
export function updateOwnerRestaurant(
  restaurantData
) {
  return ownerRequest(
    "/restaurants/me",
    {
      method: "PATCH",
      body: JSON.stringify(
        restaurantData
      ),
    }
  );
}
export function getOwnerAnalytics() {
  return ownerRequest(
    "/restaurants/me/analytics"
  );
}
export function getOwnerOrders() {
  return ownerRequest(
    "/orders/restaurant?limit=100"
  );
}

export function updateOwnerOrderStatus(
  orderId,
  status
) {
  return ownerRequest(
    `/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

export function createOwnerFoodItem(itemData) {
  return ownerRequest("/restaurants/me/food-items", {
    method: "POST",
    body: JSON.stringify(itemData),
  });
}

export function updateOwnerFoodItem(
  itemId,
  itemData
) {
  return ownerRequest(
    `/restaurants/me/food-items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify(itemData),
    }
  );
}

export function deleteOwnerFoodItem(itemId) {
  return ownerRequest(
    `/restaurants/me/food-items/${itemId}`,
    {
      method: "DELETE",
    }
  );
}

export function toggleOwnerFoodItemAvailability(
  itemId
) {
  return ownerRequest(
    `/restaurants/me/food-items/${itemId}/availability`,
    {
      method: "PATCH",
    }
  );
}
export async function registerRestaurantOwner(
  applicationData
) {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api/v1";

  const response = await fetch(
    `${apiUrl}/auth/register/restaurant-owner`,
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
        "Unable to submit restaurant application"
    );
  }

  return result?.data || result;
}
export function clearOwnerSession() {
  const ownerSessionKeys = [
    "forkly_owner_access_token",
    "forkly_owner_refresh_token",
    "forkly_owner_user",
    "forkly_owner_session",
  ];

  ownerSessionKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });
}
export function createOwnerMenuCategory(
  categoryData
) {
  return ownerRequest(
    "/restaurants/me/menu-categories",
    {
      method: "POST",
      body: JSON.stringify(categoryData),
    }
  );
}