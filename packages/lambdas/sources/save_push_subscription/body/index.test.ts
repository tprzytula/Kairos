import { getBody } from ".";

describe('Given the getBody function for save_push_subscription', () => {
    describe('When the body is valid', () => {
        it('should return the parsed body', () => {
            const body = getBody(JSON.stringify(EXAMPLE_BODY));

            expect(body).toEqual(EXAMPLE_BODY);
        });
    });

    describe('When the body is null', () => {
        it('should return null', () => {
            const body = getBody(null);

            expect(body).toBeNull();
        });
    });

    describe('When the body is empty string', () => {
        it('should return null', () => {
            const body = getBody('');

            expect(body).toBeNull();
        });
    });

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            const body = getBody('invalid JSON');

            expect(body).toBeNull();
        });
    });

    describe('When the body is missing endpoint', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                keys: { p256dh: "test-p256dh", auth: "test-auth" },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When the endpoint is empty string', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "   ",
                keys: { p256dh: "test-p256dh", auth: "test-auth" },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When the endpoint is not a string', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: 123,
                keys: { p256dh: "test-p256dh", auth: "test-auth" },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When keys is missing', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "https://push.service.com/endpoint",
            }));

            expect(body).toBeNull();
        });
    });

    describe('When keys is not an object', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "https://push.service.com/endpoint",
                keys: "not-an-object",
            }));

            expect(body).toBeNull();
        });
    });

    describe('When keys.p256dh is missing', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "https://push.service.com/endpoint",
                keys: { auth: "test-auth" },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When keys.p256dh is empty string', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "https://push.service.com/endpoint",
                keys: { p256dh: "   ", auth: "test-auth" },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When keys.auth is missing', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "https://push.service.com/endpoint",
                keys: { p256dh: "test-p256dh" },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When keys.auth is empty string', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({
                endpoint: "https://push.service.com/endpoint",
                keys: { p256dh: "test-p256dh", auth: "   " },
            }));

            expect(body).toBeNull();
        });
    });

    describe('When the body is not an object', () => {
        it('should return null for null body value', () => {
            const body = getBody(JSON.stringify(null));

            expect(body).toBeNull();
        });

        it('should return null for array body value', () => {
            const body = getBody(JSON.stringify([]));

            expect(body).toBeNull();
        });
    });
});

const EXAMPLE_BODY = {
    endpoint: "https://push.service.com/endpoint",
    keys: {
        p256dh: "test-p256dh-key",
        auth: "test-auth-key",
    },
};
