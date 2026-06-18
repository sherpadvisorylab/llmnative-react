import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Tab, TabItem } from '../../../src/components';

describe('Tab', () => {
    it('switches the active panel when a trigger is clicked', () => {
        render(
            <Tab layout="right">
                <TabItem label="General">General content</TabItem>
                <TabItem label="SEO">SEO content</TabItem>
            </Tab>
        );

        expect(screen.getByText('General content')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('tab', { name: 'SEO' }));
        expect(screen.getByText('SEO content')).toBeInTheDocument();
    });

    it('marks the active trigger with selected state', () => {
        render(
            <Tab layout="left">
                <TabItem label="Identity">Identity content</TabItem>
                <TabItem label="Branding">Branding content</TabItem>
            </Tab>
        );

        expect(screen.getByRole('tab', { name: 'Identity' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tab', { name: 'Branding' })).toHaveAttribute('aria-selected', 'false');
    });
});
