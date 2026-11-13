// API Endpoints Configuration

export const ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile', // Typically requires Bearer token
    REFRESH_TOKEN: '/auth/refresh',
  },

  // User endpoints
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string | number) => `/users/${id}`,
    UPDATE: (id: string | number) => `/users/${id}`,
    DELETE: (id: string | number) => `/users/${id}`,
  },

  // Dashboard / Vendor specific endpoints (as per your folder structure)
  VENDOR: {
    DASHBOARD: '/vendor/dashboard',
    OPPORTUNITIES: '/vendor/opportunities',
    OPPORTUNITY_DETAILS: (id: string | number) => `/vendor/opportunities/${id}`,
  },

  // Example generic resources
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id: string | number) => `/products/${id}`,
    CREATE: '/products',
  },
};
