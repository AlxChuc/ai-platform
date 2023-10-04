import { checkAPILimit, increaseAPILimit } from '@/lib/api-limits';
import { checkSubscription } from '@/lib/subscription';
import { ChatMessageParam } from '@/models';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI, { ClientOptions } from 'openai';

const options: ClientOptions = {
    organization: 'org-f6uJUyBENKuvfRsCSzM6jCWA',
    apiKey: process.env.OPENAI_API_KEY
};

const openai = new OpenAI(options);
const instructions: ChatMessageParam = {
    role: 'system',
    content: 'You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations'
};

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = '512x512' } = body;

        if (!userId) {
            const error = new NextResponse('Unauthorized', { status: 401});
            return error.json();
        }

        if (!options.apiKey) {
            return new NextResponse('OpenAI API KEY not configured', { status: 500 });
        }

        if (!prompt) {
            return new NextResponse('Prompt is required', { status: 400 });
        }

        if (!amount) {
            return new NextResponse('Amount is required', { status: 400 });
        }

        if (!resolution) {
            return new NextResponse('Resolution is required', { status: 400 });
        }

        const [continueFreeTrial, isPro] = await Promise.all([
            checkAPILimit(),
            checkSubscription()
        ])
        // const continueFreeTrial = await checkAPILimit();

        if (!continueFreeTrial && !isPro) {
            return new NextResponse('Free trial has expired', { status: 403 });
        }
        
        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
        });

        if (!isPro) {
            await increaseAPILimit();
        }
        
        return NextResponse.json(response.data);

    } catch (error) {
        console.log('[IMAGE_ERROR]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
};
