import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { getAPILimit } from '@/lib/api-limits';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const { userId } = auth()
    const count = userId ? (await getAPILimit(userId))?.count || 0 : 0;
    const isPro = await checkSubscription();

    return (
        <div className='h-full relative'>
            <div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[50] bg-gray-900'>
                <Sidebar apiLimitCount={count} isPro={isPro} />
            </div>
            <main className='md:pl-72'>
                <Navbar />
                {children}
            </main>
        </div>
    )
}