import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TodoListCard } from '../TodoListCard';

global.fetch = vi.fn();

describe('TodoListCard Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders loading state initially', () => {
        fetch.mockImplementationOnce(
            () => new Promise(() => {}), // Never resolves
        );

        render(<TodoListCard />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('fetches items from the correct endpoint', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        render(<TodoListCard />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/items');
        });
    });

    it('renders items when loaded', async () => {
        const items = [
            { id: '1', name: 'Item 1', completed: false },
            { id: '2', name: 'Item 2', completed: false },
        ];

        fetch.mockResolvedValueOnce({
            json: async () => items,
        });

        render(<TodoListCard />);

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
        });
    });

    it('displays empty message when no items', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        render(<TodoListCard />);

        await waitFor(() => {
            expect(
                screen.getByText('No items yet! Add one above!'),
            ).toBeInTheDocument();
        });
    });

    it('renders the add item form', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => [],
        });

        render(<TodoListCard />);

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText('New Item'),
            ).toBeInTheDocument();
        });
    });
});
