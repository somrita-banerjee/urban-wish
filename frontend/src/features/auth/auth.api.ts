import { axiosPublic } from "@/lib/axios"

export const login = async (email: string, password: string) => {
    const response = await axiosPublic.post('/auth/login', {
        email,
        password
    });
    return response.data;
};

export const register = async (
  name: string,
  email: string,
  phone: string,
  address: string,
  password: string,
  type: string
) => {
  const response = await axiosPublic.post("/auth/register", {
    name,
    email,
    address,
    phone,
    password,
    type,
  });
  return response.data;
};

export const getMe = async () => {
    const response = await axiosPublic.get('/auth/me');
    return response.data;
}