import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import paymentService from '../services/payments/paymentService';

const PaymentForm = ({ bookingData, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const { data } = await paymentService.createPaymentIntent(
        bookingData.amount,
        bookingData.currency,
        { bookingId: bookingData.bookingId }
      );

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: bookingData.customerName || 'Customer',
              email: bookingData.customerEmail || '',
            },
          }
        }
      );

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
        toast.error(`Payment failed: ${stripeError.message}`);
        onPaymentError?.(stripeError);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await paymentService.confirmPayment(paymentIntent.id);
        
        toast.success('Payment successful!');
        onPaymentSuccess?.(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      onPaymentError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
        Payment Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
            loading || !stripe
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Pay {bookingData.currency} {bookingData.amount}
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>Your payment information is secure and encrypted.</p>
        <p>Test card: 4242 4242 4242 4242</p>
      </div>
    </div>
  );
};

export default PaymentForm;
