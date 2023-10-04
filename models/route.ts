import {
    LayoutDashboard,
    MessageSquare,
    ImageIcon,
    VideoIcon,
    Music,
    Code,
    Settings
} from 'lucide-react';

export const ROUTES = [
    {
        label: 'Conversation',
        icon: MessageSquare,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10',
        href: '/conversation'
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        color: 'text-pink-700',
        bgColor: 'bg-pink-700/10',//500
        href: '/image'
    },
    {
        label: 'Video Generation',
        icon: VideoIcon,
        color: 'text-orange-700',
        bgColor: 'bg-orange-700/10',//500
        href: '/video'
    },
    {
        label: 'Music',
        icon: Music,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        href: '/music'
    },
    {
        label: 'Code Generation',
        icon: Code,
        color: 'text-green-700',
        bgColor: 'bg-green-700/10',//500
        href: '/code'
    }
] as const;