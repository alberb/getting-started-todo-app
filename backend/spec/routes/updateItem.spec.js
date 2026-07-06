const db = require('../../src/persistence');
const updateItem = require('../../src/routes/updateItem');

jest.mock('../../src/persistence', () => ({
    updateItem: jest.fn(),
    getItem: jest.fn(),
}));

test('it updates an item with new data', async () => {
    const itemId = 'test-id-123';
    const req = {
        params: { id: itemId },
        body: { name: 'Updated Item', completed: true },
    };
    const res = { send: jest.fn() };

    db.getItem.mockReturnValue(
        Promise.resolve({
            id: itemId,
            name: 'Updated Item',
            completed: true,
        }),
    );

    await updateItem(req, res);

    expect(db.updateItem).toHaveBeenCalledWith(itemId, {
        name: 'Updated Item',
        completed: true,
    });
});

test('it retrieves the updated item from database', async () => {
    const itemId = 'test-id-123';
    const req = {
        params: { id: itemId },
        body: { name: 'Updated Item', completed: true },
    };
    const res = { send: jest.fn() };

    db.getItem.mockReturnValue(
        Promise.resolve({
            id: itemId,
            name: 'Updated Item',
            completed: true,
        }),
    );

    await updateItem(req, res);

    expect(db.getItem).toHaveBeenCalledWith(itemId);
});

test('it returns the updated item', async () => {
    const itemId = 'test-id-123';
    const updatedItem = {
        id: itemId,
        name: 'Updated Item',
        completed: true,
    };
    const req = {
        params: { id: itemId },
        body: { name: 'Updated Item', completed: true },
    };
    const res = { send: jest.fn() };

    db.getItem.mockReturnValue(Promise.resolve(updatedItem));

    await updateItem(req, res);

    expect(res.send).toHaveBeenCalledWith(updatedItem);
});
