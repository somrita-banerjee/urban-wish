import MainLayout from "@/layout/MainLayout";
import { Account } from "@/pages/Account";
import { Cart } from "@/pages/Cart";
import { Home } from "@/pages/Home";
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
        path: "me",
        element: <Account />
      }
    ],
  },
]);

export default router;
