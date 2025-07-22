import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { login } from "./auth.api";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPasssword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerPassword, setRegistePassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [type, setType] = useState("");

  const handleLogin = async () => {
    console.log("Login:", { loginEmail, loginPassword });
    const resp = await login(loginEmail, loginPassword);
    console.log(resp);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Welcome to Urban Wish</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPasssword(e.target.value)}
              className="mb-4"
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </TabsContent>

          <TabsContent value="register">
            <Input
              type="username"
              placeholder="Username"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              className="mb-4"
            />
            <Input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="mb-4"
            />
            <Input
              type="useraddress"
              placeholder="Address"
              value={registerAddress}
              onChange={(e) => setRegisterAddress(e.target.value)}
              className="mb-4"
            />
            <Input
              type="phone"
              placeholder="Phone Number"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
              className="mb-4"
            />
            <Input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegistePassword(e.target.value)}
              className="mb-4"
            />
            <Input
              type="type"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mb-4"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
