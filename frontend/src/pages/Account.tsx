import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Profile Section</CardTitle>
      </CardHeader>
      <CardContent>
        <h2>Name</h2>
        <p>{user.name}</p>
      </CardContent>
      <CardContent>
        <h2>Email</h2>
        <p>{user.email}</p>
      </CardContent>
      <CardContent>
        <h2>Address</h2>
        <p>{user.address}</p>
      </CardContent>
      <CardContent>
        <h2>Phone</h2>
        <p>{user.phone}</p>
      </CardContent>
      <CardContent>
        <h2>Who are You?</h2>
        <p>{user.type}</p>
      </CardContent>
    </Card>
  );
};
