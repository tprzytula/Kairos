import { getBody } from ".";
import { IRequestBody } from "./types";

describe('Given the getBody function', () => {
    describe('When the body is valid', () => {
        it('should return the body', () => {
            const body = getBody(JSON.stringify(EXAMPLE_TODO_ITEM));

            expect(body).toEqual(EXAMPLE_TODO_ITEM);
        });
    });

    describe('When the body is invalid', () => {
        it('should return null', () => {
            const body = getBody(JSON.stringify({}));

            expect(body).toBeNull();
        });
    });

    describe.each(['name'])(
        'When the body is missing the %s field',
        (field) => {
            it('should return null', () => {
                const body = getBody(JSON.stringify({ ...EXAMPLE_TODO_ITEM, [field]: undefined }));

                expect(body).toBeNull();
            });
        },
    );

    describe('When the body is invalid JSON', () => {
        it('should return null', () => {
            const body = getBody('invalid JSON');

            expect(body).toBeNull();
        });

        it('should log the error', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            getBody('invalid JSON');

            expect(consoleSpy).toHaveBeenCalledWith('Failed to parse body:', new SyntaxError(`Unexpected token 'i', "invalid JSON" is not valid JSON`));
        });
    });
});

const EXAMPLE_TODO_ITEM: IRequestBody = {
    name: 'Example Item',
    description: 'Example Description',
    dueDate: 1714329600,
};
