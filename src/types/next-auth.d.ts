import "next-auth";
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        username?: string;
        isAcceptingMessages?: boolean;
        isVerified?: boolean;
    }
    interface JWT {
        id?: string;
        username?: string;
        isAcceptingMessages?: boolean;
        isVerified?: boolean;
    }
}
