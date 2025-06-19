// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE || 'http://localhost:8000/api',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/google/login',
      CHECK: '/auth/check',
      STATUS: '/auth/status',
      REFRESH: '/auth/refresh',
      DISCONNECT: '/auth/disconnect',
      HEALTH: '/auth/health',
      SERVICES: '/auth/services',
      DEBUG: '/auth/debug'
    },
    DASHBOARD: '/dashboard',
    LEADS: '/leads'
  }
};

// Environment settings
export const ENV_CONFIG = {
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  DEBUG: process.env.NODE_ENV === 'development'
};

export const API_KEY = process.env.REACT_APP_API_KEY || 'demo-key'; 