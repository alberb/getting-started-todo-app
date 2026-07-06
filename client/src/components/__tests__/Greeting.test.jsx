import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Greeting } from '../Greeting';

global.fetch = vi.fn();

describe('Greeting Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders the greeting message when fetched', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ greeting: 'Hello world!' }),
        });

        render(<Greeting />);

        await waitFor(() => {
            expect(screen.getByText('Hello world!')).toBeInTheDocument();
        });
    });

    it('fetches greeting from the correct endpoint', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ greeting: 'Hello world!' }),
        });

        render(<Greeting />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/greeting');
        });
    });

    it('renders nothing while loading', () => {
        fetch.mockImplementationOnce(
            () => new Promise(() => {}), // Never resolves
        );

        const { container } = render(<Greeting />);

        expect(container.firstChild).toBeNull();
    });

    it('renders as an h1 element', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ greeting: 'Hello world!' }),
        });

        render(<Greeting />);

        await waitFor(() => {
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toBeInTheDocument();
        });
    });
});
