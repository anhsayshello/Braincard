import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@/assets/images/google-icon.svg";
import authApi from "@/apis/auth.api";
import { useState } from "react";

export default function GoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseGoogle = async (authResult: any) => {
    setIsLoading(true);
    try {
      if (authResult.code) {
        await authApi.google(authResult.code);
        console.log(authResult);
      }
    } catch (error) {
      console.error("Error while requesting google code: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <Button
      variant="outline"
      className="cursor-pointer flex items-center gap-4"
      onClick={googleLogin}
      disabled={isLoading}
    >
      <img className="w-4 aspect-square" src={GoogleIcon} alt="google-icon" />
      Login with Google
    </Button>
  );
}
