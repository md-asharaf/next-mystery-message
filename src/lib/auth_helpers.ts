"use server"
import { signIn,signOut } from "@/app/api/auth/[...nextauth]/auth";

export async function signInHelper(data:{email:string,password:string}){
    try{
        await signIn("credentials",{
            redirect:false,
            ...data
        });
    }catch(error:any){
        throw error;
    }
}

export async function signOutHelper(){
    try{
        await signOut({redirect:false});
    }catch(error:any){
        throw error;
    }
}