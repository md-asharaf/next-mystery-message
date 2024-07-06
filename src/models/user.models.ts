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
        default: Math.floor(100000 + Math.random() * 900000).toString(),
    },
    verifyCodeExpires: {
        type: Date,
        default: new Date(Date.now() + 3600000),
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
        default: [],
    },
});

export default (models?.User as Model<IUser>) ||
    model<IUser>("User", UserSchema);
