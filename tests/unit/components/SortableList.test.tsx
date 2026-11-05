import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import SortableList, { moveItem } from '../../../src/components/blocks/SortableList';
import { I18nProvider } from '../../../src/I18n';

// CR-120: compact cards the person puts in order, by their handle or with the arrow keys.

type Account = { id: string; name: string };
const accounts: Account[] = [{ id: 'a', name: 'Mario' }, { id: 'b', name: 'Lucia' }, { id: 'c', name: 'Anna' }];

function Harness({ onMoved }: { onMoved?: (meta: { fromIndex: number; toIndex: number }) => void }) {
    const [items, setItems] = useState(accounts);
    return (
        <SortableList
            items={items}
            getKey={(item) => item.id}
            renderItem={(item) => ({ title: item.name, description: `Account ${item.id}` })}
            onReorder={(next, meta) => {
                setItems(next);
                onMoved?.({ fromIndex: meta.fromIndex, toIndex: meta.toIndex });
            }}
            label="Accounts"
            numbered
        />
    );
}

const renderList = (ui: React.ReactElement) => render(<MemoryRouter><I18nProvider>{ui}</I18nProvider></MemoryRouter>);
const names = () => screen.getAllByRole('listitem').map((item) => item.textContent?.replace(/\d|Account \w/g, '').trim());

describe('SortableList', () => {
    it('shows each item as a card, numbered, in a named list', () => {
        renderList(<Harness />);
        expect(screen.getByRole('list', { name: 'Accounts' })).toBeInTheDocument();
        expect(names()).toEqual(['Mario', 'Lucia', 'Anna']);
        expect(screen.getByText('Account b')).toBeInTheDocument();
    });

    it('moves a card with the arrow keys on its handle, and says where it went', () => {
        const moves: Array<{ fromIndex: number; toIndex: number }> = [];
        renderList(<Harness onMoved={(meta) => moves.push(meta)} />);
        fireEvent.keyDown(screen.getByLabelText(/Move item 3 of 3/), { key: 'ArrowUp' });
        expect(names()).toEqual(['Mario', 'Anna', 'Lucia']);
        expect(moves).toEqual([{ fromIndex: 2, toIndex: 1 }]);
        expect(screen.getByText('Moved to position 2 of 3')).toBeInTheDocument();
        // Not past the ends.
        fireEvent.keyDown(screen.getByLabelText(/Move item 1 of 3/), { key: 'ArrowUp' });
        expect(moves).toHaveLength(1);
    });

    it('moves a card dragged by its handle onto another', () => {
        renderList(<Harness />);
        const [first, , third] = screen.getAllByRole('listitem');
        fireEvent.dragStart(screen.getByLabelText(/Move item 1 of 3/), { dataTransfer: { setData: () => undefined, effectAllowed: '' } });
        // Below the middle of the last card: after it.
        fireEvent.dragOver(third, { clientY: 1 });
        fireEvent.drop(third);
        expect(first).toBeTruthy();
        expect(names()[0]).toBe('Lucia');
    });

    it('has no handles when it cannot be reordered, and shows its empty state', () => {
        renderList(<SortableList items={accounts} getKey={(item) => item.id} renderItem={(item) => ({ title: item.name })} disabled />);
        expect(screen.queryByLabelText(/Move item/)).not.toBeInTheDocument();
        renderList(<SortableList items={[] as Account[]} getKey={(item) => item.id} renderItem={(item) => ({ title: item.name })} emptyState={<p>No accounts</p>} />);
        expect(screen.getByText('No accounts')).toBeInTheDocument();
    });

    it('moves an item of an array', () => {
        expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
        expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
    });
});
