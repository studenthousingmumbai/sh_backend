"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const password_1 = require("../utils/password");
const addressSchema = new mongoose_1.Schema({
    line_1: { type: String, required: true },
    line_2: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
});
const userSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false },
    scope: { type: String, required: false },
    permissions: { type: [String], required: false },
    phone_number: { type: String, required: false },
    dob: { type: Date, required: false },
    google_signin: { type: Boolean, required: false },
    address: { type: addressSchema, required: false },
    deleted: { type: Boolean, required: false },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
userSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            const hashed = yield password_1.Password.toHash(this.get('password'));
            this.set('password', hashed);
        }
        done();
    });
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
