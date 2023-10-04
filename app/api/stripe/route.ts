import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { absoluteURL } from '@/lib/utils';
import prisma from '@/lib/prisma'
const settingsURL = absoluteURL('/settings');

export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const userSubscription = await prisma.userSubscription.findUnique({
            where: {
                userId
            }
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsURL
            })

            return new NextResponse(JSON.stringify({ url: stripeSession.url }))
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsURL,
            cancel_url: settingsURL,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: user.emailAddresses.at(0)?.emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: 'Platform',
                            description: 'Unlimited AI Generations'
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId
            }

        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    } catch (error) {
        console.log('[STRIPE_ERROR', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}