'use client'


import axios from 'axios'
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { Heading } from '@/components/heading';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProModal } from '@/hooks/use-pro-modal';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/models';

import { formSchema, FormType } from './constants';

export default function Page() {
    const proModal = useProModal();
    const router = useRouter();
    const { toast } = useToast();
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    });

    const loading = form.formState.isSubmitting,
    onSubmit = async (values: FormType) => {
        try {
            const userMessage: ChatMessage = {
                content: values.prompt,
                role: 'user'
            }
            const newMessages = [...messages, userMessage]
            const response = await axios.post('/api/conversation', {
                messages: newMessages,
            });
            setMessages(prev => [...prev, userMessage, response.data]);
            form.reset()
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Oh! Something went wrong.',
                    description: 'There was a problem with your request'
                });
            }
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading 
            title='Conversation'
            description='Our most advanced conversation model.'
            icon={MessageSquare}
            iconColor='text-violet-500'
            bgColor='bg-violet-500/10'
            />
            <div className='px-4 lg:px-8'>
                {/* <div> */}
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                        <FormField
                        name='prompt'
                        render={({ field }) => (
                            <FormItem className='col-span-12 lg:col-span-10'>
                                <FormControl className='m-0 p-0'>
                                    <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                    disabled={loading}
                                    placeholder='How do I calculate the radius of a circle?'
                                    {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />
                        <Button className='col-span-12 lg:col-span-2 w-full' disabled={loading}>
                            Generate
                        </Button>
                    </form>
                    </Form>
                {/* </div> */}
                <div className='space-y-4 mt-4'>
                    {loading && (
                        <div className='p-8 rounded-lg w-full flex items-center justify-center bg-muted'>
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !loading && (
                        <Empty label='No conversation started' />
                    ) }
                    <div className='flex flex-col-reverse gap-y-4'>
                            {messages.map(message => (
                                <div key={message.content}
                                className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg',
                                message.role === 'user' ? 'bg-white border border-black/10' : 'bg-muted')}>
                                    {message.role === 'user' ? <UserAvatar /> : <BotAvatar /> }
                                    <p className='text-sm'>{message.content}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}