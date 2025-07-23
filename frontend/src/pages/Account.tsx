import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getMe } from "@/features/auth/auth.api";
import { useEffect, useState } from "react";

export const Account = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    type: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      setUser(res);
    };

    fetchUser();
  }, []);

  return (
    <Card className="justify-between shadow-sm border-b flex flex-col">
      <CardHeader className="justify-between font-bold ">
        <CardTitle>Profile Section</CardTitle>
      </CardHeader>
      <Separator className="shadow-sm" />
      <CardContent >
        <h2>Name</h2>
        <p>{user.name}</p>
      </CardContent>
      <Separator className="shadow-sm" />
      <CardContent>
        <h2>Email</h2>
        <p>{user.email}</p>
      </CardContent>
      <Separator className="shadow-sm" />
      <CardContent>
        <h2>Address</h2>
        <p>{user.address}</p>
      </CardContent>
      <Separator className="shadow-sm" />
      <CardContent>
        <h2>Phone</h2>
        <p>{user.phone}</p>
      </CardContent>
      <Separator className="shadow-sm" />
      <CardContent>
        <h2>Who are You?</h2>
        <p>{user.type}</p>
      </CardContent>
    </Card>
  );
};
