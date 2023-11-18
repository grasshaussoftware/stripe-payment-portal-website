const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));

// Your API endpoint for processing payments
app.post('/charge', async (req, res) => {
    const amount = req.body.amount;
    const cardToken = req.body.cardToken;
    const cardHolderName = req.body.cardHolderName;

    try {
        // Create a customer
        const customer = await stripe.customers.create({
            source: cardToken,
            name: cardHolderName,
        });

        // Charge the customer
        const charge = await stripe.charges.create({
            amount: amount,
            currency: 'usd',
            description: 'Payment',
            customer: customer.id,
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
