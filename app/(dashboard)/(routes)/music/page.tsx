'use client'

import axios from 'axios'
import { Music } from 'lucide-react';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useProModal } from '@/hooks/use-pro-modal';

import { formSchema, FormType } from './constants';

export default function Page() {
    const router = useRouter();
    const [music, setMusic] = useState<string>();
    const proModal = useProModal();
    const { toast } = useToast();

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    });

    const loading = form.formState.isSubmitting,
    onSubmit = async (values: FormType) => {
        try {
            setMusic(undefined);
            const response = await axios.post<{audio: string}>('/api/music', values);
            setMusic(response.data.audio);
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
                title='Music Generation'
                description='Turn your prompt into music.'
                icon={Music}
                iconColor='text-emerald-500'
                bgColor='bg-emerald-500/10'
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
                                    placeholder='Piano solo'
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
                    {!music && !loading && (
                        <Empty label='No music generated' />
                    ) }
                    {music && (
                    // <div className='w-full mt-8'>
                        <audio className='w-full mt-8' controls>
                            <source src={music} />
                        </audio>
                    // </div>
                    )}
                </div>
            </div>
        </div>
    );
}