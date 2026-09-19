export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
  },

  USER: {
    ME: "/users/me",
    PROFILE: "/users/me/profile",
    SETTINGS: "/users/me/settings",
  },

  DIETARY_RESTRICTIONS: "/dietary-restrictions",
  HEALTH_CONDITIONS: "/health-conditions",

  NUTRITION: {
    TARGET: "/nutrition/target",
    CALCULATE_TARGET: "/nutrition/target/calculate",
    DAILY: (date: string) => `/nutrition/daily/${date}`,
  },

  MEALS: {
    LIST: "/meals",
    BY_DATE: (date: string) => `/meals/date/${date}`,
  },
} as const;
