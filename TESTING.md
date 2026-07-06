# Testing Guide

This project includes comprehensive unit tests for both the backend and frontend components.

## Backend Tests

The backend uses **Jest** for unit testing. Tests are located in `backend/spec/`.

### Running Backend Tests

```bash
cd backend
npm test
```

### Backend Test Coverage

#### Routes (`backend/spec/routes/`)

- **getGreeting.spec.js** - Tests for the greeting endpoint
  - ✓ Returns the greeting message
  - ✓ Sends exactly one response

- **getItems.spec.js** - Tests for fetching items
  - ✓ Gets items correctly
  - ✓ Calls database getItems method
  - ✓ Returns items in response

- **addItem.spec.js** - Tests for creating new items
  - ✓ Creates a new item with correct properties
  - ✓ Returns the created item
  - ✓ Stores the item in the database
  - ✓ Generates a unique ID for each item
  - ✓ Sets completed to false by default

- **updateItem.spec.js** - Tests for updating items
  - ✓ Updates an item with new data
  - ✓ Retrieves the updated item from database
  - ✓ Returns the updated item
  - ✓ Calls both updateItem and getItem methods

- **deleteItem.spec.js** - Tests for deleting items
  - ✓ Removes an item from the database
  - ✓ Returns a 200 status code
  - ✓ Sends exactly one response

#### Persistence (`backend/spec/persistence/`)

- **sqlite.spec.js** - Tests for SQLite database operations
  - ✓ Initializes database
  - ✓ Stores and retrieves items
  - ✓ Updates items
  - ✓ Deletes items

### Backend Test Structure

Tests use Jest's mocking capabilities to isolate route handlers from database dependencies:

```javascript
jest.mock('../../src/persistence', () => ({
    getItems: jest.fn(),
}));

test('it gets items correctly', async () => {
    const req = {};
    const res = { send: jest.fn() };
    db.getItems.mockReturnValue(Promise.resolve(ITEMS));

    await getItems(req, res);

    expect(db.getItems.mock.calls.length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(ITEMS);
});
```

---

## Frontend Tests

The frontend uses **Vitest** and **React Testing Library** for unit testing. Tests are located in `client/src/components/__tests__/`.

### Running Frontend Tests

```bash
cd client
npm test
```

### Frontend Test Options

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm test:ui

# Generate coverage report
npm test:coverage
```

### Frontend Test Coverage

#### Components (`client/src/components/__tests__/`)

- **Greeting.test.jsx** - Tests for the Greeting component
  - ✓ Renders the greeting message when fetched
  - ✓ Fetches greeting from the correct endpoint
  - ✓ Renders nothing while loading
  - ✓ Renders as an h1 element

- **AddNewItemForm.test.jsx** - Tests for the AddItemForm component
  - ✓ Renders the form with input and button
  - ✓ Disables the submit button when input is empty
  - ✓ Enables the submit button when input has text
  - ✓ Submits the form with the correct data
  - ✓ Calls onNewItem callback with the new item
  - ✓ Clears the input after successful submission
  - ✓ Shows "Adding..." text while submitting

- **ItemDisplay.test.jsx** - Tests for the ItemDisplay component
  - ✓ Renders the item name
  - ✓ Renders the toggle completion button
  - ✓ Renders the remove button
  - ✓ Toggles item completion status
  - ✓ Calls onItemUpdate after toggling completion
  - ✓ Removes the item when delete button is clicked
  - ✓ Calls onItemRemoval after deleting
  - ✓ Displays completed class when item is completed
  - ✓ Shows correct label for completed items

- **TodoListCard.test.jsx** - Tests for the TodoListCard component
  - ✓ Renders loading state initially
  - ✓ Fetches items from the correct endpoint
  - ✓ Renders items when loaded
  - ✓ Displays empty message when no items
  - ✓ Renders the add item form

### Frontend Test Structure

Tests use React Testing Library to test components from a user's perspective:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddItemForm } from '../AddNewItemForm';

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
});
```

---

## Test Configuration

### Backend (Jest)

Jest is configured in `backend/package.json`:

```json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

### Frontend (Vitest)

Vitest is configured in `client/vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
    },
});
```

---

## Running All Tests

To run tests for both backend and frontend:

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd client && npm test
```

Or create a root-level script to run both (optional):

```bash
npm run test:all
```

---

## Best Practices

### Backend Testing

1. **Mock External Dependencies** - Database calls are mocked to isolate route logic
2. **Test Happy Path** - Verify successful operations
3. **Test Error Cases** - Add tests for error scenarios
4. **Use Descriptive Names** - Test names clearly describe what is being tested

### Frontend Testing

1. **Test User Interactions** - Use `fireEvent` or `userEvent` to simulate user actions
2. **Query by Accessible Elements** - Use `getByRole`, `getByLabelText`, `getByPlaceholderText`
3. **Use `waitFor` for Async Operations** - Wait for async updates before asserting
4. **Mock External APIs** - Mock fetch calls to test components in isolation
5. **Test Accessibility** - Use aria-labels and semantic HTML

---

## Continuous Integration

These tests are designed to run in CI/CD pipelines. Add to your GitHub Actions workflow:

```yaml
- name: Run Backend Tests
  run: cd backend && npm test

- name: Run Frontend Tests
  run: cd client && npm test
```

---

## Extending Tests

### Adding a New Backend Test

1. Create a new `.spec.js` file in `backend/spec/routes/` or `backend/spec/persistence/`
2. Import Jest and the module to test
3. Mock dependencies
4. Write test cases

Example:

```javascript
const myModule = require('../../src/myModule');

jest.mock('../../src/persistence');

test('it does something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myModule(input);

    // Assert
    expect(result).toBe('expected');
});
```

### Adding a New Frontend Test

1. Create a new `.test.jsx` file in `client/src/components/__tests__/`
2. Import Vitest utilities and React Testing Library
3. Write test cases using `describe` and `it`

Example:

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent />);
        expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
});
```

---

## Troubleshooting

### Backend Tests Failing

- Ensure all mocks are properly set up
- Check that the module paths are correct
- Verify mock return values match expected types

### Frontend Tests Failing

- Check that components are properly imported
- Ensure fetch mocks are set up in `beforeEach`
- Verify that async operations use `waitFor`
- Check that selectors match actual DOM elements

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
