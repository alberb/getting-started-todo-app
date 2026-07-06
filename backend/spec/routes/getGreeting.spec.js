const getGreeting = require('../../src/routes/getGreeting');

test('it returns the greeting message', async () => {
    const req = {};
    const res = { send: jest.fn() };

    await getGreeting(req, res);

    expect(res.send).toHaveBeenCalledWith({
        greeting: 'Hello world!',
    });
});

test('it sends exactly one response', async () => {
    const req = {};
    const res = { send: jest.fn() };

    await getGreeting(req, res);

    expect(res.send).toHaveBeenCalledTimes(1);
});
