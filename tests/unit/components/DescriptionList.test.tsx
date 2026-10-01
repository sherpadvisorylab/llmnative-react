import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const themeState = vi.hoisted(() => ({
    DescriptionList: {
        wrapperClassName: '',
        className: '',
        itemClassName: '',
        labelClassName: '',
        valueClassName: '',
    },
}));

vi.mock('../../../src/Theme', () => ({
    useTheme: vi.fn(() => themeState),
}));

import DescriptionList from '../../../src/components/ui/DescriptionList';

const resetTheme = () => {
    themeState.DescriptionList = {
        wrapperClassName: '',
        className: '',
        itemClassName: '',
        labelClassName: '',
        valueClassName: '',
    };
};

beforeEach(resetTheme);

describe('DescriptionList', () => {
    it('renders semantic <dl>/<dt>/<dd> markup, one pair per item', () => {
        const { container } = render(
            <DescriptionList
                items={[
                    { label: 'Email', value: 'a@b.it' },
                    { label: 'Role', value: 'Admin' },
                ]}
            />
        );

        const dl = container.querySelector('dl');
        expect(dl).toBeTruthy();
        expect(dl?.querySelectorAll('dt')).toHaveLength(2);
        expect(dl?.querySelectorAll('dd')).toHaveLength(2);
        expect(screen.getByText('Email').tagName).toBe('DT');
        expect(screen.getByText('a@b.it').tagName).toBe('DD');
    });

    it('defaults to horizontal layout with the label beside the value', () => {
        const { container } = render(
            <DescriptionList items={[{ label: 'Email', value: 'a@b.it' }]} />
        );

        const dl = container.querySelector('dl');
        expect(dl).toHaveClass('flex');
        expect(dl).not.toHaveClass('grid');

        const item = container.querySelector('dt')?.parentElement;
        expect(item).toHaveClass('grid-cols-1');
        expect(item).toHaveClass('sm:grid-cols-[var(--rf-description-list-label-width,10rem)_minmax(0,1fr)]');
    });

    it('applies labelWidth through a CSS custom property in horizontal layout', () => {
        const { container } = render(
            <DescriptionList items={[{ label: 'Email', value: 'a@b.it' }]} labelWidth="12rem" />
        );

        const item = container.querySelector('dt')?.parentElement as HTMLElement;
        expect(item.style.getPropertyValue('--rf-description-list-label-width')).toBe('12rem');
    });

    it('stacks the label above the value in stacked layout', () => {
        const { container } = render(
            <DescriptionList layout="stacked" items={[{ label: 'Email', value: 'a@b.it' }]} />
        );

        const dl = container.querySelector('dl');
        expect(dl).toHaveClass('grid');

        const item = container.querySelector('dt')?.parentElement;
        expect(item).toHaveClass('flex-col');
    });

    it('applies a responsive column grid in stacked layout', () => {
        const { container } = render(
            <DescriptionList layout="stacked" columns={4} items={[{ label: 'Email', value: 'a@b.it' }]} />
        );

        const dl = container.querySelector('dl');
        expect(dl).toHaveClass('lg:grid-cols-4');
    });

    it('ignores columns in horizontal layout', () => {
        const { container } = render(
            <DescriptionList columns={4} items={[{ label: 'Email', value: 'a@b.it' }]} />
        );

        const dl = container.querySelector('dl');
        expect(dl).not.toHaveClass('lg:grid-cols-4');
        expect(dl).toHaveClass('flex');
    });

    it('falls back to the default empty value for null, undefined and empty string', () => {
        render(
            <DescriptionList
                items={[
                    { label: 'A', value: null },
                    { label: 'B', value: undefined },
                    { label: 'C', value: '' },
                ]}
            />
        );

        expect(screen.getAllByText('—')).toHaveLength(3);
    });

    it('renders a custom emptyValue', () => {
        render(
            <DescriptionList
                emptyValue="N/A"
                items={[{ label: 'A', value: null }]}
            />
        );

        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('truncates text values and exposes the full value through title', () => {
        render(
            <DescriptionList
                truncate
                items={[{ label: 'Bio', value: 'A very long value that should be truncated' }]}
            />
        );

        const dd = screen.getByRole('definition');
        expect(dd).toHaveClass('truncate');
        expect(dd).toHaveAttribute('title', 'A very long value that should be truncated');
    });

    it('does not set title on non-text values when truncating', () => {
        render(
            <DescriptionList
                truncate
                items={[{ label: 'Status', value: <strong>Active</strong> }]}
            />
        );

        const dd = screen.getByRole('definition');
        expect(dd).toHaveClass('truncate');
        expect(dd).not.toHaveAttribute('title');
    });

    it('reads every key of the DescriptionList theme', () => {
        themeState.DescriptionList = {
            wrapperClassName: 'theme-wrapper',
            className: 'theme-list',
            itemClassName: 'theme-item',
            labelClassName: 'theme-label',
            valueClassName: 'theme-value',
        };

        const { container } = render(
            <DescriptionList items={[{ label: 'Email', value: 'a@b.it' }]} />
        );

        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper).toHaveClass('theme-wrapper');
        expect(container.querySelector('dl')).toHaveClass('theme-list');

        const item = container.querySelector('dt')?.parentElement as HTMLElement;
        expect(item).toHaveClass('theme-item');
        expect(container.querySelector('dt')).toHaveClass('theme-label');
        expect(container.querySelector('dd')).toHaveClass('theme-value');
    });
});
