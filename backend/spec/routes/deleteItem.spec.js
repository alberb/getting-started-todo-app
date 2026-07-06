const db = require('../../src/persistence');
const deleteItem = require('../../src/routes/deleteItem');

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
}));

test('it removes an item from the database', async () => {
    const itemId = 'test-id-123';
    const req = { params: { id: itemId } };
    const res = { sendStatus: jest.fn() };

    await deleteItem(req, res);

    expect(db.removeItem).toHaveBeenCalledWith(itemId);
});

test('it returns a 200 status code', async () => {
    const itemId = 'test-id-123';
    const req = { params: { id: itemId } };
    const res = { sendStatus: jest.fn() };

    await deleteItem(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
});

test('it sends exactly one response', async () => {
    const itemId = 'test-id-123';
    const req = { params: { id: itemId } };
    const res = { sendStatus: jest.fn() };

    await deleteItem(req, res);

    expect(res.sendStatus).toHaveBeenCalledTimes(1);
});
