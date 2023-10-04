import { Loader2, Loader2Icon } from 'lucide-react';

export const Loader = () => {

return (
<div className='h-full flex flex-col gap-y-4 items-center justify-center'>
    <div className='w-10 h-10 relative'>
        <Loader2Icon className='animate-spin w-full h-full' />
    </div>
    <p className='text-sm text-muted-foreground'>thinking...</p>
</div>);
}