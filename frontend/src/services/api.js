import axios from 'axios';

const getBaseApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://nestcares-in.onrender.com/api';
};

const BASE_URL = getBaseApiUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

// Request interceptor to dynamically inject authorization tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('healthcare_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: a 401 on an authenticated request means the session
// is no longer valid, so tell AuthContext to sign out.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      console.warn('[API] Authorization expired or invalid token.');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

// Pulls a readable message out of an axios error
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  if (!err?.response) return 'Cannot reach the server. Check your connection and try again.';
  return err.response?.data?.message || fallback;
};

// AUTH API
export const authAPI = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  }
};

// UPLOAD API
export const uploadAPI = {
  image: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

// BOOKINGS API
export const bookingsAPI = {
  createBooking: async (data) => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },
  getAllBookings: async (params = {}) => {
    const res = await apiClient.get('/bookings', { params });
    return res.data;
  },
  getBookings: async (params = {}) => {
    const res = await apiClient.get('/bookings', { params });
    return res.data;
  },
  getBookingById: async (id) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },
  updateBookingStatus: async (id, status, notes = '') => {
    const res = await apiClient.put(`/bookings/${id}/status`, { status, notes });
    return res.data;
  },
  deleteBooking: async (id) => {
    const res = await apiClient.delete(`/bookings/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await apiClient.get('/bookings/stats');
    return res.data;
  },
  getBookingStats: async () => {
    const res = await apiClient.get('/bookings/stats');
    return res.data;
  }
};

// SERVICES API
export const servicesAPI = {
  getAll: async () => {
    const res = await apiClient.get('/services');
    return res.data;
  },
  // Admin view: includes hidden services so they can be shown again
  getAllIncludingHidden: async () => {
    const res = await apiClient.get('/services', { params: { includeHidden: 'true' } });
    return res.data;
  },
  getBySlug: async (slug) => {
    const res = await apiClient.get(`/services/slug/${slug}`);
    return res.data;
  },
  reorder: async (orderedIds) => {
    const res = await apiClient.put('/services/reorder/list', { orderedIds });
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/services', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/services/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/services/${id}`);
    return res.data;
  }
};

// DOCTORS / CLINICIANS API
export const doctorsAPI = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/doctors', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await apiClient.get(`/doctors/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post('/doctors', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/doctors/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/doctors/${id}`);
    return res.data;
  }
};

// SETTINGS API
export const settingsAPI = {
  // All public settings keyed by name: { web, contact, homepage, ... }
  getAll: async () => {
    const res = await apiClient.get('/settings');
    return res.data;
  },
  update: async (key, value) => {
    const res = await apiClient.put(`/settings/${key}`, { value });
    return res.data;
  },
  getEmailConfig: async () => {
    const res = await apiClient.get('/settings/admin/email-config');
    return res.data;
  },
  getCloudinaryConfig: async () => {
    const res = await apiClient.get('/settings/admin/cloudinary-config');
    return res.data;
  },
  sendTestEmail: async (targetEmail) => {
    const res = await apiClient.post('/settings/admin/test-email', { targetEmail });
    return res.data;
  },
  getWebSettings: async () => {
    const res = await apiClient.get('/settings/web');
    return res.data;
  },
  updateWebSettings: async (data) => {
    const res = await apiClient.put('/settings/web', data);
    return res.data;
  },
  getContactSettings: async () => {
    const res = await apiClient.get('/settings/contact');
    return res.data;
  },
  updateContactSettings: async (data) => {
    const res = await apiClient.put('/settings/contact', data);
    return res.data;
  }
};

// Basic CRUD helpers for simple collections
const crud = (path) => ({
  getAll: async () => {
    const res = await apiClient.get(path);
    return res.data;
  },
  create: async (data) => {
    const res = await apiClient.post(path, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await apiClient.put(`${path}/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await apiClient.delete(`${path}/${id}`);
    return res.data;
  }
});

// TESTIMONIALS API
export const testimonialsAPI = crud('/testimonials');

// FAQS API
export const faqsAPI = crud('/faqs');

export default apiClient;
