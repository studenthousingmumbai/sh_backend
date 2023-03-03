import IBed from "../types/IBed";
import mongoose, { model, Schema } from 'mongoose';

const bbSchema = new Schema({ 
    x: Number, 
    y: Number, 
    w: Number, 
    h: Number
});

const bedSchema = new Schema<IBed>(
    {
        appartment: { type: String, required: true }, 
        available: { type: Boolean, required: false, default: true }, 
        locked: { type: Boolean, required: false, default: false }, 
        bounding_box: { type: bbSchema, required: false }, 
        deleted: { type: Boolean, required: false, default: false }, 
        room_no: { type: Number, required: true }, 
        bed_no: { type: String, required: false }, 
        locked_by: { type: String, required: false }, 
        locked_at: { type: Number, required: false }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

const Bed = model<IBed>("Bed", bedSchema);
 
export default Bed;