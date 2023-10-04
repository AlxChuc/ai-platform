import { checkAPILimit, increaseAPILimit } from '@/lib/api-limits';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI, { ClientOptions } from 'openai';

const options: ClientOptions = {
    organization: 'org-f6uJUyBENKuvfRsCSzM6jCWA',
    apiKey: process.env.OPENAI_API_KEY
};

const openai = new OpenAI(options);

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401});
        }

        if (!options.apiKey) {
            return new NextResponse('OpenAI API KEY not configured', { status: 500 });
        }

        if (!messages) {
            return new NextResponse('Messages are required', { status: 400 });
        }

        const [continueFreeTrial, isPro] = await Promise.all([
            checkAPILimit(),
            checkSubscription()
        ])
        // const continueFreeTrial = await checkAPILimit();

        if (!continueFreeTrial && !isPro) {
            return new NextResponse('Free trial has expired', { status: 403 });
        }

        const response = await openai.chat.completions.create({
            messages,
            model: 'gpt-3.5-turbo'
        });

        if (!isPro) {
            await increaseAPILimit();
        }

        return NextResponse.json(response.choices[0].message)

    } catch (error) {
        console.log('[CONVERSATION_ERROR]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
};
