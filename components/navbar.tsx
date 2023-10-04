import { UserButton, auth } from '@clerk/nextjs';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { getAPILimit } from '@/lib/api-limits';
import { checkSubscription } from '@/lib/subscription';

export const Navbar = async () => {
    const { userId } = auth()
    const count = userId ? (await getAPILimit(userId))?.count || 0 : 0;
    const isPro = await checkSubscription();

    return (
        <div className='flex items-center p-4'>
            <MobileSidebar isPro={isPro} apiLimitCount={count} />
            <div className='flex w-full justify-end'>
                <UserButton afterSignOutUrl='/' />
            </div>
        </div>
    )
}