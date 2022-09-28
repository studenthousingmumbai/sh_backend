import { IUser } from "../types/IUser";
import { model, Schema } from 'mongoose';
import { Password } from '../utils/password';

const addressSchema = new Schema({ 
    line_1: { type: String , required: true},
    line_2: { type: String , required: false},
    city: { type: String , required: true},
    state: { type: String , required: true}, 
    zip: { type: String , required: true}
})

const userSchema = new Schema<IUser>(
    {
        firstname: { type: String, required: true }, 
        lastname: { type: String, required: true }, 
        email: { type: String, required: true }, 
        password: { type: String, required: false }, 
        phone_number: { type: String, required: false }, 
        dob: { type: Date, required: true }, 
        google_signin: { type: Boolean, required: false }, 
        address: { type: addressSchema, required: true }, 
        deleted: { type: Boolean, required: false }
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

userSchema.pre("save", async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    
    done();
})

const User = model<IUser>("User", userSchema);
 
export default User;