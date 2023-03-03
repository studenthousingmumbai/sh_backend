"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const middleware_1 = require("../middleware");
// import api routers here 
const users_1 = __importDefault(require("./users"));
const orders_1 = __importDefault(require("./orders"));
const listings_1 = __importDefault(require("./listings"));
const stats_1 = __importDefault(require("./stats"));
const registerResourceRoutes = (app) => {
    // make app.use calls here eg - app.use("/user", userRouter); 
    app.use('/stats', stats_1.default);
    app.use('/user', users_1.default);
    app.use('/order', orders_1.default);
    app.use('/listing', listings_1.default);
};
const registerErrorHandlers = (app) => {
    // handler for any route that does not exist
    app.use("*", (req, res) => {
        throw new errors_1.BadRequestError("Route not found!");
    });
    // error handler for errors thrown in any route 
    app.use(middleware_1.errorHandler);
};
const configureRoutes = (app) => {
    registerResourceRoutes(app);
    registerErrorHandlers(app);
};
exports.default = configureRoutes;
