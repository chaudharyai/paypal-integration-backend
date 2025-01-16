const express = require('express');
const paypal = require('paypal-rest-sdk');
const app = express();
const PORT = 3000;

// PayPal Configuration
paypal.configure({
  mode: 'sandbox', // Keep 'sandbox' for testing
  client_id: 'AY6KYZmxKXvVyQAX7cRxjgxNDB7eK6Na7B235NgZyzNri3n1O7WMcrLu2gaXKDLapG7rR97FTTS_aRau', // Replace with your actual Client ID
  client_secret: 'EEJCtrEha4AVX5oigENZBMx6Tq-yjmbmlMg_wvkyhHMxSj4CyOaB6TrwCbEBPkYvZ69k3P_G0sWmuFAK' // Replace with your actual Secret Key
});

app.use(express.json());

// Payment Route
app.post('/pay', (req, res) => {
  const { amount, currency, description } = req.body; // Example input from Postman

  const paymentData = {
    intent: 'sale',
    payer: { payment_method: 'paypal' },
    transactions: [
      {
        amount: { total: amount, currency },
        description,
      }
    ],
    redirect_urls: {
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    }
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error('Error creating payment:', error);
      return res.status(500).send('Payment creation failed.');
    } else {
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
      res.status(200).json({ approvalUrl });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
