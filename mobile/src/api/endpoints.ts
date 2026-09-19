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

  FOODS: {
    LIST: "/foods",
    BY_ID: (foodId: number) => `/foods/${foodId}`,
    SEARCH: (name: string) => `/foods/search?name=${encodeURIComponent(name)}`,
    RECENT: "/foods/recent",
    RECORD_SEARCH: (foodId: number) => `/foods/${foodId}/search`,
  },

  MEALS: {
    LIST: "/meals",
    CREATE: "/meals",
    BY_DATE: (date: string) => `/meals/date/${date}`,
  },

  NUTRITION: {
    TARGET: "/nutrition/target",
    CALCULATE_TARGET: "/nutrition/target/calculate",
    DAILY: (date: string) => `/nutrition/daily/${date}`,
  },
} as const;
