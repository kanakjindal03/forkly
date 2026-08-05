import { apiRequest } from "./client.js";

export function getAddresses() {
  return apiRequest("/users/me/addresses");
}

export function createAddress(addressData) {
  return apiRequest("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify(addressData),
  });
}

export function createOrder(orderData) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function getMyOrders() {
  return apiRequest("/orders");
}

export function getOrder(orderId) {
  return apiRequest(`/orders/${orderId}`);
}

export function cancelOrder(orderId) {
  return apiRequest(`/orders/${orderId}/cancel`, {
    method: "POST",
  });
}

export function deleteAddress(addressId) {
  return apiRequest(
    `/users/me/addresses/${addressId}`,
    {
      method: "DELETE",
    }
  );
}

export function createReview(reviewData) {
  return apiRequest("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}