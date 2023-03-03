"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const errors_1 = require("../errors");
const auth_1 = require("../utils/auth");
const currentUser = (req, res, next) => {
    console.log("req body: ", req.body);
    if (!req.headers['authorization']) {
        throw new errors_1.NotAuthorizedError();
    }
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const payload = (0, auth_1.verifyToken)(token);
        // @ts-ignore
        req.currentUser = payload;
    }
    catch (err) { }
    next();
};
exports.currentUser = currentUser;
