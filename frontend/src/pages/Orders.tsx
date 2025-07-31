import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrders } from "@/features/orders/orders.api";

interface Product {
  id: string;
  name: string;
  price: string;
  image_url: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: string;
  status:
    | "payment_pending"
    | "order_placed"
    | "payment_failed"
    | "order_cancelled";
  price: number;
  items: OrderItem[];
}

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrders();
        setOrders(res);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Orders</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">You haven’t placed any orders yet.</p>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Link
              to={`${order.id}`}
              key={order.id}
              className="border shadow-md rounded-lg p-4 bg-white"
            >
              <div className="text-sm text-gray-500 mb-2">
                Order ID:{" "}
                <span className="font-mono text-gray-700">{order.id}</span> •{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <div className="mt-1">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    order.status === "payment_pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "order_placed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "payment_failed"
                      ? "bg-red-100 text-red-800"
                      : order.status === "order_cancelled"
                      ? "bg-gray-100 text-gray-800"
                      : ""
                  }`}
                >
                  {order.status?.replace("_", " ")}
                </span>
              </div>

              <div className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-3 flex items-center gap-4"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        ₹{parseFloat(item.product.price).toFixed(2)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold text-right text-base">
                      ₹
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right font-bold text-lg">
                Order Total: ₹{order.price}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
