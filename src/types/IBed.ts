import mongoose from 'mongoose';

export default interface IBed { 
    _id?: mongoose.Types.ObjectId;
    appartment: mongoose.Types.ObjectId | null,             // will store a reference to an appartment object   
    available: boolean, 
    locked: boolean, 
    locked_by?: mongoose.Types.ObjectId,
    locked_at?: number,
    bounding_box: { 
        x: number, 
        y: number,
        w: number, 
        h: number 
    },
    room_no: number, 
    bed_no?: string, 
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
};