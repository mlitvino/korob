// Tests never reach the internet; a test that needs a reply sets one on this mock.
global.fetch = jest.fn(() => Promise.reject(new Error('Network is off in tests'))) as jest.Mock;
