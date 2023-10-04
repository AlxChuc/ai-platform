import { auth } from '@clerk/nextjs';
import { MAX_FREE_COUNTS } from '../config/constants';
import prisma from '@/lib/prisma';

export const increaseAPILimit = async () => {
    const { userId } = auth()

    if (!userId) return;

    const userApiLimit = await getAPILimit(userId);

    if (userApiLimit) {
        await prisma.userApiLimit.update({
            where: { userId },
            data: { count: userApiLimit.count + 1 }
        });
    } else {
        await prisma.userApiLimit.create({
            data: { userId, count: 1 }
        })
    }
}

export const checkAPILimit = async () => {
    const { userId } = auth();

    if (!userId) return false;

    const userApiLimit = await getAPILimit(userId);

    return !userApiLimit || userApiLimit.count < MAX_FREE_COUNTS

}

export const getAPILimit = async (userId:  string) => {
    let userAPILimit;
    try {
        userAPILimit = await prisma.userApiLimit.findUnique({
            where: {
                userId
            }
        });
        
    } catch (error) {
        
    }

    return userAPILimit;
}