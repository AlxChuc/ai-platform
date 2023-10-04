import { Avatar, AvatarImage } from './ui/avatar';

export const BotAvatar = () => {
    return (
        <Avatar>
            <AvatarImage className='p-2' src='/logo.svg' />
        </Avatar>
    );
}