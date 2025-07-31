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

export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
) => {
  const res = await axiosAuth.post("/order/payment-verify", {
    razorpay_payment_id: paymentId,
    razorpay_order_id: orderId,
    razorpay_signature: signature
  });
  return res.data;
}
