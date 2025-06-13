import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://algebraestudentepartneriapi20250329050348.azurewebsites.net/api';
const API_BASE_URL = API_URL;

// Helper to get token from AsyncStorage
const getAuthToken = async () => {
  return await AsyncStorage.getItem('jwtToken');
};

axios.defaults.baseURL = API_URL;

// Axios request interceptor for adding Authorization header
axios.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)

);

// Axios response interceptor for handling 401s
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('jwtToken');
      // Optionally trigger a logout or navigation event here
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials: any) => {
    const response = await axios.post('/Auth/GoogleLogin', credentials);
    if (response.data.token) {
      await AsyncStorage.setItem('jwtToken', response.data.token);
      await AsyncStorage.setItem('userId', String(response.data.userId));
     
    }
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('userId');
  },
  register: async (userData: any) => {
    const response = await axios.post('/Auth/Register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await axios.get('/Auth/Me');
    return response.data;
  }
};

// Partner Service
export const ePartnerService = {
  getAllPartners: async () => {
    const response = await axios.get('/EPartner/ReadAll');
    return response.data;
  },
  getPartnerById: async (id: number) => {
    const response = await axios.get(`/EPartner/Read/${id}`);
    return response.data;
  },
  createPartner: async (partnerData: any) => {
    const response = await axios.post('/EPartner/Create', partnerData);
    return response.data;
  },
  updatePartner: async (id: number, partnerData: any) => {
    const response = await axios.put(`/EPartner/Update/${id}`, partnerData);
    return response.data;
  },
  deletePartner: async (id: number) => {
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