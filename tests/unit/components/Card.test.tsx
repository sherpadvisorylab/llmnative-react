import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Card from '../../../src/components/ui/Card';

describe('Card', () => {
    it('renders title, header, body, and footer content', () => {
        render(
            <Card
                title="Account"
                header={<span>Actions</span>}
                footer={<span>Footer</span>}
            >
                Body content
            </Card>
        );

        expect(screen.getByText('Account')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByText('Body content')).toBeInTheDocument();
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('applies utility-first class customizations without legacy card selectors', () => {
        const { container } = render(
            <Card
                className="ring-1"
                headerClassName="justify-between"
                bodyClassName="pt-6"
                footer={<span>Footer</span>}
                footerClassName="justify-end"
            >
                Body content
            </Card>
        );

        const root = container.querySelector('.ring-1');
        expect(root).toBeTruthy();
        expect(root?.className).toContain('rounded-lg');
        expect(container.querySelector('.card')).toBeNull();
        expect(container.querySelector('.card-header')).toBeNull();
        expect(container.querySelector('.card-body')).toBeNull();
        expect(container.querySelector('.card-footer')).toBeNull();
    });
});
