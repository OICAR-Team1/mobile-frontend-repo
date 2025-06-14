import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://algebraestudentepartneriapi20250329050348.azurewebsites.net/api';
axios.defaults.baseURL = API_URL;

// --- Helpers ---
const getAuthToken = async () => await AsyncStorage.getItem('jwtToken');


// --- Auth Service ---
export const authService = {
  login: async (credentials) => {
    const response = await axios.post('/Auth/GoogleLogin', credentials, { withCredentials: true });
    console.log('Login response:', response.data);
    if (response.data.token) {
      await AsyncStorage.setItem('jwtToken', response.data.token);
      if (response.data.userId) {
        await AsyncStorage.setItem('userId', String(response.data.userId));
      }
    }
    return response.data;
  },
  refresh: async () => {
   // Always use withCredentials, no need to send a token in the body
    const response = await axios.post('/Auth/Refresh', {}, { withCredentials: true });
    if (response.data && response.data.token) {
      await AsyncStorage.setItem('jwtToken', response.data.token);
      return response.data.token;
    }
    throw new Error('Refresh failed');
  },
  revoke: async () => {
    await axios.post('/Auth/Revoke', {}, { withCredentials: true });
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userInfo');
  },
  logout: async () => {
    await authService.revoke();
  },
  register: async (userData) => {
    const response = await axios.post('/Auth/Register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await axios.get('/Auth/Me');
    return response.data;
  },
};

// --- Axios Interceptors ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.request.use(
  async config => {
    const token = await getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.withCredentials = true; // important for cookies
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await authService.refresh();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await authService.logout();
        // Optionally trigger a logout UI/navigation here
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// --- Partner Service ---
export const ePartnerService = {
  getAllPartners: async () => {
    const response = await axios.get('/EPartner/ReadAll');
    return response.data;
  },
  getPartnerById: async (id) => {
    const response = await axios.get(`/EPartner/Read/${id}`);
    return response.data;
  },
  createPartner: async (partnerData) => {
    const response = await axios.post('/EPartner/Create', partnerData);
    return response.data;
  },
  updatePartner: async (id, partnerData) => {
    const response = await axios.put(`/EPartner/Update/${id}`, partnerData);
    return response.data;
  },
  deletePartner: async (id) => {
    const response = await axios.delete(`/EPartner/Delete/${id}`);
    return response.data;
  }
};

// Project Service
export const projectService = {
  getAllProjects: async () => {
    const response = await axios.get('/Project/ReadAll');
    return response.data;
  },
  getProjectById: async (id: number) => {
    const response = await axios.get(`/Project/Read/${id}`);
    return response.data;
  },
  createProject: async (projectData: any) => {
    const response = await axios.post('/Project/Create', projectData);
    return response.data;
  },
  updateProject: async (id: number, projectData: any) => {
    const response = await axios.put(`/Project/Update/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id: number) => {
    const response = await axios.delete(`/Project/Delete/${id}`);
    return response.data;
  }
};

// Contact Service
export const contactService = {
  getAllContacts: async () => {
    const response = await axios.get('/Contact/ReadAll');
    return response.data;
  },
  getContactById: async (id: number) => {
    const response = await axios.get(`/Contact/Read/${id}`);
    return response.data;
  },
  createContact: async (contactData: any) => {
    const response = await axios.post('/Contact/Create', contactData);
    return response.data;
  },
  updateContact: async (id: number, contactData: any) => {
    const response = await axios.put(`/Contact/Update/${id}`, contactData);
    return response.data;
  },
  deleteContact: async (id: number) => {
    const response = await axios.delete(`/Contact/Delete/${id}`);
    return response.data;
  }


};


// Activity Service
export const EActivityService = {
  getAllActivitys: async () => {
    const response = await axios.get('/EActivity/ReadAll');
    return response.data;
  },
  getActivityById: async (id: number) => {
    const response = await axios.get(`/EActivity/Read/${id}`);
    return response.data;
  },
  getActivityByPartnerId: async (ePartnerId: number) => {
    const response = await axios.get(`/EActivity/ReadByPartnerId/${ePartnerId}`);
    return response.data;
  },
  createActivity: async (activityData: any) => {
    const response = await axios.post('/EActivity/Create', activityData);
    return response.data;
  },
  updateActivity: async (id: number, activityData: any) => {
    const response = await axios.put(`/EActivity/Update/${id}`, activityData);
    return response.data;
  },
  deleteActivity: async (id: number) => {
    const response = await axios.delete(`/EActivity/Delete/${id}`);
    return response.data;
  }


};


// User Service
export const UserService = {
  getAllUsers: async () => {
    const response = await axios.get('/User');
    return response.data;
  },
  getUserById: async (id: number) => {
    const response = await axios.get(`/User/${id}`);
    return response.data;
  },
  



};