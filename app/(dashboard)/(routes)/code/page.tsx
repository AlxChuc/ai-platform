'use client'

import axios from 'axios'
import { Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';

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
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { toast } = useToast();
    const proModal = useProModal();

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
            const response = await axios.post('/api/code', {
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
            title='Code Generation'
            description='Generate code using descriptive text.'
            icon={Code}
            iconColor='text-green-700'
            bgColor='bg-green-700/10'
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
                                    placeholder='Simple toggle button using react hooks.'
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
                                    <ReactMarkdown components={{pre: ({node, ...props}) => (
                                        <div className='overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg'>
                                            <pre {...props} />
                                        </div>
                                    ),
                                    code: ({node, ...props}) => (
                                        <code className='bg-black/10 rounded-lg p-1' {...props} />
                                    )
                                    }} className='text-sm overflow-hidden leading-7'>
                                        {message.content || ''}
                                    </ReactMarkdown>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}