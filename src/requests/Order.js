import { R3ClientWithoutAuth } from "../clients/R3Client";

const checkout_endpoint = "ps-event/v1/events/register";
const submitOrder = (order_params) => {
  return R3ClientWithoutAuth.post(checkout_endpoint, order_params);
};

const payment_endpoint = "ps-event/v1/events/payment";
const submitPayment = (payment_params) => {
  return R3ClientWithoutAuth.post(payment_endpoint, payment_params);
};

const stripe_key_endpoint = "ps-event/v1/events/options";
const getStripeKey = () => {
  return R3ClientWithoutAuth.get(stripe_key_endpoint);
};

export { submitOrder, submitPayment, getStripeKey };
