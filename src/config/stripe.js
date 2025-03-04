/* import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req, res) => {
  const { userId, email } = req.body

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      mode: 'subscription',
      line_items: [
        {
          price: 'price_xxx', // ID del precio de Stripe
          quantity: 1,
        }
      ],
      success_url: 'https://tuapp.com/success',
      cancel_url: 'https://tuapp.com/cancel'
    })
    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
*/