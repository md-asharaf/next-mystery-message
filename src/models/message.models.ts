import { Schema, Document, model, models, Model } from "mongoose";

export interface IMessage extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default (models.Message as Model<IMessage>) ||
    model<IMessage>("Message", MessageSchema);
