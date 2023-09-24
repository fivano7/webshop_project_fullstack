import { loadStripe } from "@stripe/stripe-js";

export const finishCheckout = async ({ lineItems }) => {
  let stripePromise = null;
  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API);
    }
    return stripePromise;
  };

  const stripe = await getStripe();

  await stripe.redirectToCheckout({
    mode: "payment",
    lineItems,
    successUrl: `${window.location.origin}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/checkout/failure`,
  });
};
