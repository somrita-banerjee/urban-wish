import { axiosAuth } from "@/lib/axios";

export const getOrders = async () => {
  const res = await axiosAuth.get("/order");
  return res.data;
};

export const getOrder = async (id: string) => {
  const res = await axiosAuth.get("/order/" + id);
  return res.data;
};

export const placeOrder = async () => {
  const res = await axiosAuth.post("/order");
  return res.data;
};

