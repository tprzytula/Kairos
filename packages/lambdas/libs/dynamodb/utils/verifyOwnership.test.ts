import { verifyPrivateItemOwnership } from "./verifyOwnership";

describe('Given the verifyPrivateItemOwnership utility', () => {
    it('should return true for a public item', () => {
        const result = verifyPrivateItemOwnership({ visibility: 'public' }, 'user-1');
        expect(result).toBe(true);
    });

    it('should return true for an item with no visibility set', () => {
        const result = verifyPrivateItemOwnership({}, 'user-1');
        expect(result).toBe(true);
    });

    it('should return false for a private item owned by another user', () => {
        const result = verifyPrivateItemOwnership({ visibility: 'private', ownerId: 'other-user' }, 'user-1');
        expect(result).toBe(false);
    });

    it('should return true for a private item owned by the user', () => {
        const result = verifyPrivateItemOwnership({ visibility: 'private', ownerId: 'user-1' }, 'user-1');
        expect(result).toBe(true);
    });
});
