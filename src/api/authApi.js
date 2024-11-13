import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000'
  : 'http://192.168.1.104:3000';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await axios.get(`${API_URL}/users?email=${email}&password=${password}`);
      if (response.data.length > 0) {
        return response.data[0];
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authApi;