import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DescriptionList } from '../../../src/components';

describe('DescriptionList', () => {
    it('renders label → value pairs as a semantic description list', () => {
        const { container } = render(
            <DescriptionList items={[{ label: 'Email', value: 'a@b.it' }, { label: 'Ruolo', value: <strong>Admin</strong> }]} />
        );

        const list = container.querySelector('dl');
        expect(list).not.toBeNull();
        expect(list).toHaveAttribute('data-layout', 'horizontal');
        expect(container.querySelectorAll('dt')).toHaveLength(2);
        expect(container.querySelectorAll('dd')).toHaveLength(2);
        expect(screen.getByText('Email').tagName).toBe('DT');
        expect(screen.getByText('a@b.it').tagName).toBe('DD');
        expect(screen.getByText('Admin').closest('dd')).not.toBeNull();
    });

    it('shows the empty value for null, undefined and empty strings, and keeps 0', () => {
        render(
            <DescriptionList
                emptyValue="n/d"
                items={[{ label: 'A', value: null }, { label: 'B' }, { label: 'C', value: '' }, { label: 'D', value: 0 }]}
            />
        );

        expect(screen.getAllByText('n/d')).toHaveLength(3);
        expect(screen.getByText('0')).toHaveClass('text-foreground');
        expect(screen.getAllByText('n/d')[0]).toHaveClass('text-muted-foreground');
    });

    it('sets the label column width in the horizontal layout', () => {
        const { container } = render(<DescriptionList labelWidth="9rem" items={[{ label: 'Email', value: 'x' }]} />);

        const item = container.querySelector('dl > div') as HTMLElement;
        expect(item.style.getPropertyValue('--rf-dl-label-width')).toBe('9rem');
    });

    it('lays out the stacked layout in responsive columns', () => {
        const { container } = render(
            <DescriptionList layout="stacked" columns={4} items={[{ label: 'Stato', value: 'Spedito' }]} />
        );

        const list = container.querySelector('dl') as HTMLElement;
        expect(list).toHaveAttribute('data-layout', 'stacked');
        expect(list).toHaveClass('lg:grid-cols-4');
        expect((container.querySelector('dl > div') as HTMLElement).style.getPropertyValue('--rf-dl-label-width')).toBe('');
    });

    it('truncates values and uses a string value as their tooltip', () => {
        render(<DescriptionList truncate items={[{ label: 'Acquirente', value: 'Un nome molto lungo' }, { label: 'Prezzo', value: '1 €', title: 'IVA esclusa' }]} />);

        expect(screen.getByText('Un nome molto lungo')).toHaveClass('truncate');
        expect(screen.getByText('Un nome molto lungo')).toHaveAttribute('title', 'Un nome molto lungo');
        expect(screen.getByText('1 €')).toHaveAttribute('title', 'IVA esclusa');
    });

    it('applies custom class names and an optional wrapper', () => {
        const { container } = render(
            <DescriptionList wrapperClassName="wrap" className="list" itemClassName="item" labelClassName="lbl" valueClassName="val" items={[{ key: 'k', label: 'L', value: 'V' }]} />
        );

        expect(container.firstElementChild).toHaveClass('wrap');
        expect(container.querySelector('dl')).toHaveClass('list');
        expect(container.querySelector('dl > div')).toHaveClass('item');
        expect(screen.getByText('L')).toHaveClass('lbl');
        expect(screen.getByText('V')).toHaveClass('val');
    });
});
