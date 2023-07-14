const stripe = require('stripe')('sk_test_51MeEnySDJyp0mFKa6BuBTWkybMkgzgR5Jq4iSPT2OXXJopNlMKHr5xiIMru8VtcxLSEZiOkWMeARE1z44tEMlJDj00bcP8uKfj'); 

// Set your secret API key

async function createPaymentLink(amount: number): Promise<string> {
  // Create a Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: amount * 100, // Stripe amount is in cents, so multiply by 100
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://your-website.com/success',
    cancel_url: 'https://your-website.com/cancel',
  });

  // Get the generated payment link
  const paymentLink = session.url;

  return paymentLink;
}

// Example usage
const paymentAmount = 10; // Get the desired payment amount from user input
createPaymentLink(paymentAmount)
  .then((paymentLink) => console.log(paymentLink))
  .catch((error) => console.error(error));
