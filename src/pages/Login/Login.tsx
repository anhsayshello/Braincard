import Metadata from "@/components/Metadata";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Link } from "react-router";
import path from "@/constants/path";
import UsernameLogin from "./components/UsernameLogin";
import { House } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import GoogleLogin from "./components/GoogleLogin";

export default function Login() {
  return (
    <>
      <Metadata title="Login" content="login" />
      <div className="fixed inset-0 flex items-center justify-center p-6 z-20 bg-[oklab(0_0_0_/_0.5)]">
        <Card className="w-full max-w-sm gap-5">
          <Link to={path.home} className="flex items-center justify-center">
            <House size={18} />
          </Link>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username below to login to your account
            </CardDescription>
            <CardAction>
              <Link to={path.register}>
                <Button variant="link">Sign Up</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-1.5 flex flex-col">
            <UsernameLogin />
            <div className="relative flex items-center justify-center my-6.5">
              <Separator />
              <div className="absolute text-sm bg-white px-5 text-muted-foreground font-semibold">
                OR
              </div>
            </div>
            <GoogleLogin />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
