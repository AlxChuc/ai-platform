import * as zod from 'zod';

export type FormType = zod.infer<typeof formSchema>;

export const formSchema = zod.object({
    prompt: zod.string().min(1, {
        message: 'Video Prompt is required'
    })
})