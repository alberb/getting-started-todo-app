import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemDisplay } from '../ItemDisplay';

global.fetch = vi.fn();

describe('ItemDisplay Component', () => {
    const mockItem = {
        id: 'test-123',
        name: 'Test Item',
        completed: false,
    };

    const mockOnItemUpdate = vi.fn();
    const mockOnItemRemoval = vi.fn();

    beforeEach(() => {
        fetch.mockClear();
        mockOnItemUpdate.mockClear();
        mockOnItemRemoval.mockClear();
    });

    it('renders the item name', () => {
        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('renders the toggle completion button', () => {
        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        expect(
            screen.getByLabelText('Mark item as complete'),
        ).toBeInTheDocument();
    });

    it('renders the remove button', () => {
        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        expect(screen.getByLabelText('Remove Item')).toBeInTheDocument();
    });

    it('toggles item completion status', async () => {
        const updatedItem = { ...mockItem, completed: true };
        fetch.mockResolvedValueOnce({
            json: async () => updatedItem,
        });

        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        const toggleButton = screen.getByLabelText('Mark item as complete');
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/api/items/test-123',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify({
                        name: 'Test Item',
                        completed: true,
                    }),
                }),
            );
        });
    });

    it('calls onItemUpdate after toggling completion', async () => {
        const updatedItem = { ...mockItem, completed: true };
        fetch.mockResolvedValueOnce({
            json: async () => updatedItem,
        });

        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        const toggleButton = screen.getByLabelText('Mark item as complete');
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(mockOnItemUpdate).toHaveBeenCalledWith(updatedItem);
        });
    });

    it('removes the item when delete button is clicked', async () => {
        fetch.mockResolvedValueOnce({});

        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        const removeButton = screen.getByLabelText('Remove Item');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/items/test-123', {
                method: 'DELETE',
            });
        });
    });

    it('calls onItemRemoval after deleting', async () => {
        fetch.mockResolvedValueOnce({});

        render(
            <ItemDisplay
                item={mockItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        const removeButton = screen.getByLabelText('Remove Item');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockOnItemRemoval).toHaveBeenCalledWith(mockItem);
        });
    });

    it('displays completed class when item is completed', () => {
        const completedItem = { ...mockItem, completed: true };
        const { container } = render(
            <ItemDisplay
                item={completedItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        expect(container.querySelector('.item.completed')).toBeInTheDocument();
    });

    it('shows correct label for completed items', () => {
        const completedItem = { ...mockItem, completed: true };
        render(
            <ItemDisplay
                item={completedItem}
                onItemUpdate={mockOnItemUpdate}
                onItemRemoval={mockOnItemRemoval}
            />,
        );

        expect(
            screen.getByLabelText('Mark item as incomplete'),
        ).toBeInTheDocument();
    });
});
