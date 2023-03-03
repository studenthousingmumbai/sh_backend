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
exports.apiAuth = void 0;
const errors_1 = require("../errors");
// import Consumer from '../models/consumers';
const apiAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req headers", req.headers);
    const api_key = req.headers['X-API-KEY'];
    if (!api_key) {
        throw new errors_1.NotAuthorizedError();
    }
    // verify the api key provided 
    try {
        // find a consumer with the api key supplied
        // const consumer = await Consumer.findOne({ api_key });
        // if(!consumer){
        //     throw new NotAuthorizedError();
        // }
    }
    catch (err) {
        throw new errors_1.InternalServerError();
    }
    next();
});
exports.apiAuth = apiAuth;
