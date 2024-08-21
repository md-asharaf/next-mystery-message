"use client";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IMessage } from "@/models/message.model";
import { useToast } from "./ui/use-toast";
import axios from "axios";
interface MessageCardProps {
    message: IMessage;
    onDelete: (messageId: string) => void;
}
const MessageCard: React.FC<MessageCardProps> = ({ message, onDelete }) => {
    const { toast } = useToast();
    const deleteMessage = async () => {
        try {
            await axios.delete(
                `/api/delete-message/${message.id}`
            );
            toast({
                title: "Message deleted",
                description: "Message has been deleted successfully",
            });
            onDelete(message.id);
        } catch (error) {}
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Send Message</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">
                            <X className="w-5 h-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete(message.id)}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
        </Card>
    );
};

export default MessageCard;
