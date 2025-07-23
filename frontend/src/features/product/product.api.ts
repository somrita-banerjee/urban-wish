import { axiosAuth } from "@/lib/axios";

export const getProducts = async () => {
  const response = await axiosAuth.get("/product");
  return response.data;
};
