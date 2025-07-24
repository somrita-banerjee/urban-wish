import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addtoCart, getCart } from "@/features/cart/cart.api";
import { getProducts } from "@/features/product/product.api";
import { IndianRupeeIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
}

interface CartItem {
  product: string;
  quantity: number;
}

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        console.log(res);
        setProducts(res);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const res = await getCart();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
    fetchCartItems();
  }, []);

  const originalPriceSimulator = (price: string) => {
    const n = parseFloat(price);
    const rand = Math.random();
    const newPrice = (1 + rand) * n;
    return newPrice.toFixed(2);
  };

  const addToCart = async (product: string) => {
    const currentCartItems = cartItems;

    const existingItemIndex = currentCartItems.findIndex(
      (item) => item.product === product
    );

    if (existingItemIndex !== -1) {
      currentCartItems[existingItemIndex].quantity += 1;
    } else {
      currentCartItems.push({ product, quantity: 1 });
    }

    try {
      await addtoCart(currentCartItems);
      setCartItems(currentCartItems);
    } catch (error) {
      console.log("Failed to update cart", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg: grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="shadoww-md">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-40 w-full object-cover rounded-t-xl"
            />
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {product.description}
              </p>
              <div className="text-green-600 font-bold mb-2 flex">
                <IndianRupeeIcon className="mt-1" size={25} />
                <div className="text-3xl">{product.price}</div>
                <s className="font-semibold text-sm px-2 flex flex-col-reverse">
                  {originalPriceSimulator(product.price)}
                </s>
              </div>
              <Button
                onClick={() => {
                  addToCart(product.id);
                }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
