import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddItemForm } from '../AddNewItemForm';

global.fetch = vi.fn();

describe('AddItemForm Component', () => {
    const mockOnNewItem = vi.fn();

    beforeEach(() => {
        fetch.mockClear();
        mockOnNewItem.mockClear();
    });

    it('renders the form with input and button', () => {
        render(<AddItemForm onNewItem={mockOnNewItem} />);

        expect(screen.getByPlaceholderText('New Item')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
    });

    it('disables the submit button when input is empty', () => {
        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const button = screen.getByRole('button', { name: /Add Item/i });
        expect(button).toBeDisabled();
    });

    it('enables the submit button when input has text', () => {
        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByPlaceholderText('New Item');
        fireEvent.change(input, { target: { value: 'Test Item' } });

        const button = screen.getByRole('button', { name: /Add Item/i });
        expect(button).not.toBeDisabled();
    });

    it('submits the form with the correct data', async () => {
        const newItem = { id: '123', name: 'Test Item', completed: false };
        fetch.mockResolvedValueOnce({
            json: async () => newItem,
        });

        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByPlaceholderText('New Item');
        fireEvent.change(input, { target: { value: 'Test Item' } });

        const button = screen.getByRole('button', { name: /Add Item/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/api/items',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ name: 'Test Item' }),
                    headers: { 'Content-Type': 'application/json' },
                }),
            );
        });
    });

    it('calls onNewItem callback with the new item', async () => {
        const newItem = { id: '123', name: 'Test Item', completed: false };
        fetch.mockResolvedValueOnce({
            json: async () => newItem,
        });

        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByPlaceholderText('New Item');
        fireEvent.change(input, { target: { value: 'Test Item' } });

        const button = screen.getByRole('button', { name: /Add Item/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnNewItem).toHaveBeenCalledWith(newItem);
        });
    });

    it('clears the input after successful submission', async () => {
        const newItem = { id: '123', name: 'Test Item', completed: false };
        fetch.mockResolvedValueOnce({
            json: async () => newItem,
        });

        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByPlaceholderText('New Item');
        fireEvent.change(input, { target: { value: 'Test Item' } });

        const button = screen.getByRole('button', { name: /Add Item/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(input.value).toBe('');
        });
    });

    it('shows "Adding..." text while submitting', async () => {
        fetch.mockImplementationOnce(
            () => new Promise(() => {}), // Never resolves
        );

        render(<AddItemForm onNewItem={mockOnNewItem} />);

        const input = screen.getByPlaceholderText('New Item');
        fireEvent.change(input, { target: { value: 'Test Item' } });

        const button = screen.getByRole('button', { name: /Add Item/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Adding...')).toBeInTheDocument();
        });
    });
});
