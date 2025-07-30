/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, addtoCart } from "@/features/cart/cart.api"; // or your correct import path
import {
  ArrowBigLeftDashIcon,
  ArrowBigRightDashIcon,
  IndianRupeeIcon,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { placeOrder } from "@/features/orders/orders.api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Cart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await getCart();
      setCart(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (productId: string) => {
    if (!cart) return;
    setLoadingId(productId);

    const currentCartItems = [...cart.items];
    const itemIndex = currentCartItems.findIndex(
      (i) => i.product.id === productId
    );

    if (itemIndex !== -1) {
      currentCartItems[itemIndex].quantity += 1;
    } else {
      return;
    }

    try {
      await addtoCart(
        currentCartItems.map((i) => ({
          product: i.product.id,
          quantity: i.quantity,
        }))
      );
      await fetchCartItems();
    } catch (error) {
      console.error("Failed to update cart", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!cart) return;
    setLoadingId(productId);

    const currentCartItems = [...cart.items];
    const itemIndex = currentCartItems.findIndex(
      (i) => i.product.id === productId
    );

    if (itemIndex !== -1) {
      if (currentCartItems[itemIndex].quantity > 1) {
        currentCartItems[itemIndex].quantity -= 1;
      } else {
        currentCartItems.splice(itemIndex, 1); // remove item
      }

      try {
        await addtoCart(
          currentCartItems.map((i) => ({
            product: i.product.id,
            quantity: i.quantity,
          }))
        );
        await fetchCartItems();
      } catch (error) {
        console.error("Failed to update cart", error);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please try again later.");
      return;
    }
    if (!cart || cart.items.length === 0) return;
    setPlacingOrder(true);
    try {
      const res = await placeOrder();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: res.total_price,
        currency: "INR",
        name: "Urban Wish",
        description: "Test Transaction",
        order_id: res.razorpay_order_id,
        handler: function (response: any) {
          console.log(response);
          alert(
            `Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`
          );
          // optional: verify payment via backend
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Failed to fetch orderd", error);
    } finally {
      setPlacingOrder(false);
    }
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => {
      return total + parseFloat(item.product.price) * item.quantity;
    }, 0);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-4 border p-4 rounded-md"
          >
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.product.name}</h3>
              <p className="text-gray-600 text-sm flex">
                <IndianRupeeIcon size={15} className="mt-1" />{" "}
                {parseFloat(item.product.price).toFixed(2)}{" "}
                <X size={14} className="mt-1 " /> {item.quantity}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-lg"
                  onClick={() => handleRemove(item.product.id)}
                  disabled={loadingId === item.product.id}
                >
                  <Minus size={15} />
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  className="bg-gray-200 px-2 py-1 rounded text-lg"
                  onClick={() => handleAdd(item.product.id)}
                  disabled={loadingId === item.product.id}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <div className="font-bold text-lg flex">
              <IndianRupeeIcon size={20} className="mt-1" />{" "}
              {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right font-bold text-xl">
        Total: ₹{calculateTotal().toFixed(2)}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded flex "
          onClick={() => navigate("/")}
        >
          <ArrowBigLeftDashIcon size={26} /> Continue Shopping
        </button>
        <button
          className={`${
            placingOrder ? "bg-gray-400" : "bg-green-600"
          } text-white px-4 py-2 rounded flex`}
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? "Placing..." : "Place Order"}{" "}
          <ArrowBigRightDashIcon size={30} className="px-1" />
        </button>
      </div>
    </div>
  );
};
