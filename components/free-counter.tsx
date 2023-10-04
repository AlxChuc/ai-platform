import { MAX_FREE_COUNTS } from '@/config/constants';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { useProModal } from '@/hooks/use-pro-modal';

export const FreeCounter = ({ count, isPro = false }: { count: number; isPro: boolean }) => {
    const proModal = useProModal();

    if (isPro) {
        return null;
    }

    return (
        <div className='px-3'>
            <Card className='bg-white/10 border-0'>
                <CardContent className='py-6'>
                    <div className='text-center text-sm text-white mb-4 space-y-2'>
                        <p>{count} / {MAX_FREE_COUNTS} Free Generations</p>
                        <Progress className='h-3' value={count / MAX_FREE_COUNTS * 100} />
                    </div>
                    <Button variant='premium' className='w-full' onClick={proModal.onOpen}>
                        Upgrade <Zap className='w-4 h-4 ml-2 fill-white' />
                        </Button>
                </CardContent>
            </Card>
        </div>
    );
}