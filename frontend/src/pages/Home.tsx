import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { addtoCart, getCart } from "@/features/cart/cart.api";
import { getProducts } from "@/features/product/product.api";
import { IndianRupeeIcon, Minus, Plus, ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  category_products_categoryTocategory: Category;
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: string;
}

interface CartItem {
  product: string;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  description?: string; 
}

export const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const res = await getCart();
        const formattedResult = res.items.map(
          (item: { product: { id: string }; quantity: number }) => ({
            product: item.product.id,
            quantity: item.quantity,
          })
        );
        setCartItems(formattedResult ?? []);
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
    const currentCartItems = [...cartItems];

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

  const removeFromCart = async (product: string) => {
    const currentCartItems = [...cartItems];

    const existingItemIndex = currentCartItems.findIndex(
      (item) => item.product === product
    );

    if (existingItemIndex !== -1) {
      const existingItem = currentCartItems[existingItemIndex];

      if (existingItem.quantity > 1) {
        // Decrease quantity by 1
        existingItem.quantity -= 1;
      } else {
        // Remove the item completely if quantity is 1
        currentCartItems.splice(existingItemIndex, 1);
      }

      try {
        await addtoCart(currentCartItems);
        setCartItems(currentCartItems);
        console.log(`Removed one '${product}' from cart`);
      } catch (error) {
        console.log("Failed to update cart", error);
      }
    } else {
      console.log(`Product '${product}' not found in cart`);
    }
  };

  const groupProductsByCategory = (products: Product[]) => {
    const grouped: { [category: string]: Product[] } = {};
    products.forEach((product) => {
      const categoryName = product.category_products_categoryTocategory?.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });
    return grouped;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      {Object.entries(groupProductsByCategory(products)).map(
        ([name, products]) => (
          <div key={name} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 ">{name}</h2>
            <Carousel className="w-full">
              <CarouselContent className="ml-2">
                {products.map((product) => {
                  const cartItem = cartItems.find(
                    (item) => item.product === product.id
                  );

                  return (
                    <CarouselItem
                      key={product.id}
                      className="pl-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <Card className="h-full flex flex-col shadow-md">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-40 w-full object-cover rounded-t-xl"
                        />
                        <CardContent className="p-4 flex flex-col justify-between flex-1">
                          <div>
                            <h2 className="text-lg font-semibold">
                              {product.name}
                            </h2>
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
                          </div>
                          <div>
                            {cartItem ? (
                              <div className="flex items-center gap-2 mt-2">
                                <Button onClick={() => removeFromCart(product.id)}>
                                  <Minus />
                                </Button>
                                <span className="font-semibold">
                                  {cartItem.quantity}
                                </span>
                                <Button onClick={() => addToCart(product.id)}>
                                  <Plus />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                className="mt-2"
                                onClick={() => addToCart(product.id)}
                              >
                                <ShoppingCartIcon />
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )
      )
      }
    </div>
  );
}