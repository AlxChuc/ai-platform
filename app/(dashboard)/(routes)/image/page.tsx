'use client'

import axios from 'axios'
import { Download, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { Heading } from '@/components/heading';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProModal } from '@/hooks/use-pro-modal';

import { amountOptions, formSchema, FormType, resolutionOptions } from './constants';


export default function Page() {
    const router = useRouter();
    const proModal = useProModal();
    const [images, setImages] = useState<string[]>([]);
    const { toast } = useToast();

    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
            amount: amountOptions[0].value,
            resolution: resolutionOptions[0].value
        }
    });

    const loading = form.formState.isSubmitting,
    onSubmit = async (values: FormType) => {
        try {
            setImages([]);

            const response = await axios.post<{url: string}[]>('/api/image', values);
            const urls = response.data.map(image => image.url)
            setImages(urls);

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
            title='Image Generation'
            description='Turn your prompt into an image.'
            icon={ImageIcon}
            iconColor='text-pink-700'
            bgColor='bg-pink-700/10'
            />
            <div className='px-4 lg:px-8'>
                {/* <div> */}
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'>
                        <FormField
                        name='prompt'
                        render={({ field }) => (
                            <FormItem className='col-span-12 lg:col-span-6'>
                                <FormControl className='m-0 p-0'>
                                    <Input className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                    disabled={loading}
                                    placeholder='A picture of a flying horse'
                                    {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )} />
                        <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => (
                            <FormItem className='col-span-12 lg:col-span-2'>
                                <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {amountOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField
                        control={form.control}
                        name='resolution'
                        render={({ field }) => (
                            <FormItem className='col-span-12 lg:col-span-2'>
                                <Select
                                disabled={loading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {resolutionOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        <div className='p-20'>
                            <Loader />
                        </div>
                    )}
                    {images.length === 0 && !loading && (
                        <Empty label='No images generated' />
                    ) }
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8'>
                        {images.map(src => (
                            <Card key={src} className='rounded-lg overflow-hidden'>
                                <div className='relative aspect-square'>
                                    <Image src={src} alt='Generated AI image' fill />
                                </div>
                                <CardFooter className='p-2'>
                                    <Button onClick={() => window.open(src)}
                                    variant='secondary' className='w-full'>
                                        <Download className='h-4 w-4 mr-2' />
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}