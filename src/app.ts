import 'express-async-errors';
import express, { Request, Response } from 'express';
import cors from 'cors';
import configureRoutes from './routes';

import config from './config';
import Bed from './models/beds';
import Order from './models/orders';

const app = express();
const stripe = require('stripe')(config.STRIPE_SECRET_KEY); 
const endpointSecret = config.STRIPE_ENDPOINT_SECRET;

// register mandatory middleware 
app.use(cors());

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err: any) {
        console.log(err);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': 
            const checkoutComplete = event.data.object;
            const { payment_status, metadata, status, amount_total } = checkoutComplete; 

            if(payment_status === 'paid' && status === 'complete') { 
                const { user, appartment, bed, floor, course, year, listing } = metadata; 
                // create order in DB here 
                const selected_bed = await Bed.findById(bed); 
        
                selected_bed!.set({ available: false, locked: false }); 
                await selected_bed!.save(); 

                // create new order and save 
                const order = new Order({ 
                    user, 
                    listing, 
                    bed, 
                    amount: amount_total, 
                    appartment, 
                    floor, 
                    course, 
                    year 
                }); 
                await order.save(); 

                console.log("Payment processed & created new order successfully: ", order);
            } else { 
                const session = event.data.object;
                await stripe.checkout.sessions.cancel(session.id);
                console.log("Oops something went wrong! Destroyed session: ", checkoutComplete); 
            }
            break; 

        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(function (req, response, next) {
    response.contentType('application/xml');
    next();
});

app.get('/', (req:Request, res: Response) => { 
    res.status(200).send("all good");
});

configureRoutes(app);

export { app };