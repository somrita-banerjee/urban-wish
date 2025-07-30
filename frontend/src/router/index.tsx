import MainLayout from "@/layout/MainLayout";
import { Account } from "@/pages/Account";
import { Cart } from "@/pages/Cart";
import { Home } from "@/pages/Home";
import { Order } from "@/pages/Order";
import { Orders } from "@/pages/Orders";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "order",
        element: <Orders />,
      },
      {
        path: "order/:id",
        element: <Order />,
      },
      {
        path: "me",
        element: <Account />,
      },
    ],
  },
]);

export default router;
