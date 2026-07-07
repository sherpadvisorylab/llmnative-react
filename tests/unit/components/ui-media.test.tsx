import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../src/Theme', () => ({
    useTheme: vi.fn((_key?: string) => ({
        Image: {
            wrapperClassName: '', className: '',
            motion: { enter: false, hover: false },
        },
        Loader: {
            wrapperClassName: '', className: '', icon: '', title: '', description: '',
        },
    })),
    PLACEHOLDER_IMAGE: 'https://placehold.co/400',
    PLACEHOLDER_USER: 'https://placehold.co/200',
    PLACEHOLDER_BRAND: '/logo.svg',
}));

vi.mock('../../../src/motion', () => ({
    useEnterMotion: vi.fn(() => ({})),
    useMotionState: vi.fn(() => ({})),
    usePressMotion: vi.fn(() => ({})),
}));

import Image from '../../../src/components/ui/Image';
import ImageAvatar from '../../../src/components/ui/ImageAvatar';
import Loader from '../../../src/components/ui/Loader';

describe('Image', () => {
    it('renders an img element with the given src', () => {
        render(<Image src="https://example.com/photo.jpg" label="Photo" />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });

    it('renders alt text from the label prop', () => {
        render(<Image src="https://example.com/photo.jpg" label="A great photo" />);
        expect(screen.getByAltText('A great photo')).toBeInTheDocument();
    });
});

describe('ImageAvatar', () => {
    it('renders an avatar image', () => {
        render(<ImageAvatar src="https://example.com/avatar.jpg" label="User" />);
        expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('renders with a BadgeOverlay when badge prop is provided', () => {
        render(
            <ImageAvatar
                src="https://example.com/avatar.jpg"
                label="User"
                badge={{ content: '3', variant: 'danger' }}
            />
        );
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders with size class', () => {
        const { container } = render(
            <ImageAvatar src="https://example.com/avatar.jpg" label="User" size="xl" />
        );
        expect(container.querySelector('img')).toBeTruthy();
    });
});

describe('Loader', () => {
    it('renders loading text', () => {
        render(<Loader title="Loading..." show />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders a description when provided', () => {
        render(<Loader title="Loading" description="Please wait" show />);
        expect(screen.getByText('Please wait')).toBeInTheDocument();
    });
});
