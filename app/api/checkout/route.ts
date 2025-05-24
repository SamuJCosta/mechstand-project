import Stripe from 'stripe'
import { verifyAccessToken } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), {
      status: 401,
    })
  }

  const decoded = verifyAccessToken(token)

  if (!decoded || typeof decoded !== 'object') {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 403,
    })
  }

  const { titulo, preco, anuncioId } = await req.json()

  if (!titulo || !preco || !anuncioId) {
    return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
      status: 400,
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: titulo,
            },
            unit_amount: Math.round(preco * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/payment/sucesso?anuncioId=${anuncioId}`,
      cancel_url: `${req.headers.get('origin')}/cancelado`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    })
  } catch (err) {
    console.error('Erro no checkout:', err)
    return new Response(JSON.stringify({ error: 'Erro ao criar sessão' }), {
      status: 500,
    })
  }
}
