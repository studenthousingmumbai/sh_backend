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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const beds_1 = __importDefault(require("./models/beds"));
const orders_1 = __importDefault(require("./models/orders"));
const app = (0, express_1.default)();
exports.app = app;
const stripe = require('stripe')('sk_test_51MeEnySDJyp0mFKa6BuBTWkybMkgzgR5Jq4iSPT2OXXJopNlMKHr5xiIMru8VtcxLSEZiOkWMeARE1z44tEMlJDj00bcP8uKfj');
const endpointSecret = "whsec_867ea4680dc2930a091113d19540feabb6fdaafe7cc8f3305e2245467853e7d9";
// register mandatory middleware 
app.use((0, cors_1.default)());
app.post('/webhook', express_1.default.raw({ type: 'application/json' }), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutComplete = event.data.object;
            const { payment_status, metadata, status, amount_total } = checkoutComplete;
            if (payment_status === 'paid' && status === 'complete') {
                const { user, appartment, bed, floor, course, year, listing } = metadata;
                // create order in DB here 
                const selected_bed = yield beds_1.default.findById(bed);
                selected_bed.set({ available: false, locked: false });
                yield selected_bed.save();
                // create new order and save 
                const order = new orders_1.default({
                    user,
                    listing,
                    bed,
                    amount: amount_total,
                    appartment,
                    floor,
                    course,
                    year
                });
                yield order.save();
                console.log("Payment processed & created new order successfully: ", order);
            }
            else {
                const session = event.data.object;
                yield stripe.checkout.sessions.cancel(session.id);
                console.log("Oops something went wrong! Destroyed session: ", checkoutComplete);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(function (req, response, next) {
    response.contentType('application/xml');
    next();
});
app.get('/', (req, res) => {
    res.status(200).send("all good");
});
(0, routes_1.default)(app);
