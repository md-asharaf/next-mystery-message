import { Schema, Document, model, models, Model } from "mongoose";
import { IMessage } from "./message.models";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: IMessage[];
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, "Please fill a valid username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please fill a valid email address"],
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Please fill a valid password"],
    },
    verifyCode: {
        type: String,
        required: [true, "Please fill a valid verify code"],
    },
    verifyCodeExpires: {
        type: Date,
        required: [true, "Please fill a valid verify code expires"],
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
});

export default (models.User as Model<IUser>) ||
    model<IUser>("User", UserSchema);
