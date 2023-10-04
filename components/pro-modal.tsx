'use client'
import { useEffect, useState } from 'react';
import { useProModal } from '@/hooks/use-pro-modal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/models/route';
import { Check, Zap } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';

export const ProModal = () => {
    const proModal = useProModal();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null
    }

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stripe');
            window.location.href = response.data.url
        } catch (error) {
            console.log(error, 'STRIPE_CLIENT_ERROR');
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex justify-center items-center flex-col gap-y-4 pb-2'>
                        <div className='flex items-center gap-x-2 font-bold py-1'>
                        Upgrade to 
                        <Badge variant='premium' className='uppercase text-sm py-1'>pro</Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className='text-center pt-2 space-y-2 text-zinc-900 font-medium'>
                        {ROUTES.map((item) => (
                            <Card key={item.label} className='p-3 border-black/5 flex items-center justify-between'>
                                <div className='flex items-center gap-x-4'>
                                    <div className={cn('p-2 w-fit rounded-md', item.bgColor)}>
                                        <item.icon className={cn('w-6 h-6', item.color)}></item.icon>
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        {item.label}
                                    </div>
                                </div>
                                <Check className='text-primary w-5 h-5' />
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={loading} onClick={onSubscribe} variant='premium' size='lg' className='w-full'>
                        Upgrade <Zap className='w-4 h-4 ml-2 fill-white' />
                        </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

