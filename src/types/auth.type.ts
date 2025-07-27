import User from "./user.type";

export default interface AuthResponse {
  access_token: string;
  expires: string;
  user: User;
}
