import { getOrder } from "@/features/orders/orders.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  price: number;
  status:
    | "payment_pending"
    | "  order_placed"
    | "payment_failed"
    | "order_cancelled";
  createdAt: string;
  items: OrderItem[];
}

export const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) fetchOrder(id);
  }, [id]);

  const fetchOrder = async (id: string) => {
    const res = await getOrder(id);
    setOrder(res);
  };

  if (!order) return <>Something went wrong</>;

  return (
    <div key={order.id} className="border shadow-md rounded-lg p-4 bg-white">
      <div className="text-sm text-gray-500 mb-2">
        Order ID: <span className="font-mono text-gray-700">{order.id}</span> •{" "}
        {new Date(order.createdAt).toLocaleString()}
        <div className="mt-1">
          Status:{" "}
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
              order.status === "payment_pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "  order_placed"
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
      </div>

      <div className="divide-y divide-gray-200">
        {order.items.map((item) => (
          <div key={item.product.id} className="py-3 flex items-center gap-4">
            <img
              src={item.product.image_url}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-600">
                ₹{parseFloat(item.product.price).toFixed(2)} × {item.quantity}
              </p>
            </div>
            <div className="font-semibold text-right text-base">
              ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right font-bold text-lg">
        Order Total: ₹{order.price}
      </div>
    </div>
  );
};
