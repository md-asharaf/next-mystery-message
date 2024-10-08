import { Schema, Document, model, models, Model } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Schema.Types.ObjectId[];
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
        required: true,
    },
    verifyCodeExpires: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

export default (models?.User as Model<IUser>) ||
    model<IUser>("User", UserSchema);
