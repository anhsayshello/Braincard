import { useGoogleLogin as useGoogleSignIn } from "@react-oauth/google";
import authApi from "@/apis/auth.api";
import { useState } from "react";

export default function useGoogleLogin() {
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

  const googleLogin = useGoogleSignIn({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return { isLoading, googleLogin };
}
