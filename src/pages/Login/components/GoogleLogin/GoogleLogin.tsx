import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/images/google-icon.svg";
import useGoogleLogin from "@/hooks/useGoogleLogin";

export default function GoogleLogin() {
  const { isLoading, googleLogin } = useGoogleLogin();

  return (
    <Button
      variant="outline"
      className="cursor-pointer flex items-center gap-4"
      onClick={googleLogin}
      disabled={isLoading}
    >
      <img className="w-4 aspect-square" src={GoogleIcon} alt="google-icon" />
      Continue with Google
    </Button>
  );
}
