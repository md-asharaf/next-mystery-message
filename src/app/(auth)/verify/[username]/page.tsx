"use client";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
const Page = () => {
    const [OTP, setOTP] = useState("");
    const [res, setRes] = useState({
        success: true,
        message: "email sent successfully!",
    });
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(120);
    const { toast } = useToast();
    const { username } = useParams();
    const router = useRouter();
    const verifyOtp = async () => {
        setRes({ success: false, message: "" });
        try {
            const response = await axios.post(`/api/verify-code`, {
                username,
                OTP,
            });
            toast({
                title: "Account Verified",
                description: "welcome to our platform",
            });
            router.push("/");
        } catch (error) {
            if (error instanceof AxiosError) {
                setRes({
                    success: false,
                    message:
                        error?.response?.data.message || "An error occurred",
                });
            }
        }
    };
    const resendEmail = async () => {
        setRes({ success: false, message: "" });
        setIsResending(true);
        try {
            const response = await axios.patch(`/api/resend-email`, {
                username,
            });
            setRes({ success: true, message: response.data.message });
            toast({
                title: "Email Sent",
                description: "Please check your email",
            });
            setTimer(120);
            startCountdown();
        } catch (error) {
            if (error instanceof AxiosError) {
                setRes({
                    success: false,
                    message:
                        error?.response?.data.message || "An error occurred",
                });
            }
        }
        setIsResending(false);
    };
    useEffect(() => {
        startCountdown();
    }, []);
    const startCountdown = async () => {
        const interval = setInterval(() => {
            console.log("in time interval");
            setTimer((prev) => {
                if (prev === 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent to your email
                    </p>
                </div>
                <p
                    className={`${
                        res.success ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {res.message}
                </p>
                <div className="space-y-6">
                    <Input onChange={(e) => setOTP(e.target.value)} />
                    <Button onClick={verifyOtp} disabled={OTP == ""}>
                        Verify
                    </Button>
                    <Button
                        onClick={resendEmail}
                        variant={"outline"}
                        disabled={timer > 0}
                        className="ml-2"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </>
                        ) : timer ? (
                            `${timer} s`
                        ) : (
                            "Resend Email"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page;
