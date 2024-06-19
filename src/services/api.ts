import axios from 'axios';
import { paths } from '@/paths';

const url = paths.api;

 export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

export const loginUser = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axios.post(`${url}auth/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al intentar iniciar sesión:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error desconocido al intentar iniciar sesión');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error inesperado al intentar iniciar sesión');
    }
  }
};

export const createUser = async (name: string, surname: string, email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post<User>(`${url}user/`, { name, surname, email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al intentar crear usuario:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Error desconocido al intentar crear al usuario');
    } else {
      console.error('Error inesperado:', error);
      throw new Error('Error inesperado al intentar crear usuario');
    }
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(`${url}user/`);
    return response.data;
  } catch (error) {
    console.error('Error inesperado:', error);
    throw new Error('Error inesperado al intentar obtener usuarios');
  }
};
