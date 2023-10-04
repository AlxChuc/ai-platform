import { AuthRequiredError } from './exceptions';
import { auth } from '@clerk/nextjs';

export const getAuthUser = () => {
    const { user } = auth();
    console.log('function', user);

    if (!user) {
        throw new AuthRequiredError();
    }

    return user;
}