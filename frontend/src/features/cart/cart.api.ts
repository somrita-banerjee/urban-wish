import { axiosAuth } from "@/lib/axios";

export const addtoCart = async (
  items: { product: string; quantity: number }[]
) => {
  const res = await axiosAuth.patch("/order/cart", { items });
  return res.data;
};

export const getCart = async () => {
  const res = await axiosAuth.get("/order/cart");
  return res.data;
};
