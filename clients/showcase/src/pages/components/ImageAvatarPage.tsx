import React from 'react';
import { ImageAvatar } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropsTable from '../../components/PropsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PropDef, PlaygroundConfig } from '../../types/playground';

const AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"%3E%3Crect width="160" height="160" rx="80" fill="%232563eb"/%3E%3Ccircle cx="80" cy="62" r="30" fill="white"/%3E%3Cpath d="M35 140c8-32 80-32 90 0" fill="white"/%3E%3C/svg%3E';

const IMAGE_AVATAR_PROPS: PropDef[] = [
    { name: 'src', type: 'string', required: true, description: 'Avatar image source', control: 'text' },
    { name: 'width', type: 'number', description: 'Image width', control: 'number', min: 24, max: 160 },
    { name: 'height', type: 'number', description: 'Image height', control: 'number', min: 24, max: 160 },
    { name: 'title', type: 'string', description: 'Native title attribute', control: 'text' },
    { name: 'alt', type: 'string', description: 'Alt text override', control: 'text' },
    { name: 'cacheKey', type: 'string', description: 'Reserved cache key prop' },
    { name: 'pre', type: 'ReactNode', description: 'Content before avatar', control: 'text' },
    { name: 'post', type: 'ReactNode', description: 'Content after avatar', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on img', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: IMAGE_AVATAR_PROPS,
    defaultProps: {
        src: AVATAR,
        width: 72,
        height: 72,
        title: 'Ada Lovelace',
        alt: 'Ada Lovelace',
        pre: '',
        post: '',
        className: 'rounded-full border object-cover',
        wrapClass: '',
    },
    render: (p) => <ImageAvatar {...p} />,
};

export default function ImageAvatarPage() {
    usePlayground(PLAYGROUND, 'ImageAvatar');

    return (
        <PageLayout title="ImageAvatar" description="Avatar image helper with fallback and localStorage-backed image caching.">
            <Section
                title="Avatar"
                preview={<ImageAvatar src={AVATAR} title="Ada Lovelace" width={72} height={72} className="rounded-full border" />}
                code={`import { ImageAvatar } from 'react-firestrap';

<ImageAvatar src={avatarUrl} title="Ada Lovelace" width={72} height={72} className="rounded-full border" />`}
            />

            <PropsTable props={IMAGE_AVATAR_PROPS} />
        </PageLayout>
    );
}
