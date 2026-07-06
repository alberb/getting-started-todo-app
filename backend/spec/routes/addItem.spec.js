const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');

jest.mock('../../src/persistence', () => ({
    storeItem: jest.fn(),
}));

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-12345'),
}));

test('it creates a new item with correct properties', async () => {
    const req = { body: { name: 'Test Item' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    expect(db.storeItem).toHaveBeenCalledWith({
        id: 'test-uuid-12345',
        name: 'Test Item',
        completed: false,
    });
});

test('it returns the created item', async () => {
    const req = { body: { name: 'Test Item' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    expect(res.send).toHaveBeenCalledWith({
        id: 'test-uuid-12345',
        name: 'Test Item',
        completed: false,
    });
});

test('it stores the item in the database', async () => {
    const req = { body: { name: 'Another Item' } };
    const res = { send: jest.fn() };

    await addItem(req, res);

    expect(db.storeItem).toHaveBeenCalledTimes(1);
});
