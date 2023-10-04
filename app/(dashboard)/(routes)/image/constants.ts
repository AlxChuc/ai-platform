import * as zod from 'zod';

export type FormType = zod.infer<typeof formSchema>;

export const formSchema = zod.object({
    prompt: zod.string().min(1, {
        message: 'Image Prompt is required',
    }),
    amount: zod.string().min(1),
    resolution: zod.string().min(1)
})

export const amountOptions = [
    {
        value: '1',
        label: '1 Photo'
    },
    {
        value: '2',
        label: '2 Photos'
    },
    {
        value: '3',
        label: '3 Photos'
    },
    {
        value: '4',
        label: '4 Photos'
    },
    {
        value: '5',
        label: '5 Photos'
    },
]

export const resolutionOptions = [
    {
        value: '256x256',
        label: '256 x 256'
    },
    {
        value: '512x512',
        label: '512 x 512'
    },
    {
        value: '1024x1024',
        label: '1024 x 1024'
    },
]