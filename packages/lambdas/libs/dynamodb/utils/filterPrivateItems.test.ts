import { filterPrivateItems } from "./filterPrivateItems";

describe('Given the filterPrivateItems utility', () => {
    it('should include public items for any user', () => {
        const items = [{ id: '1' }, { id: '2' }];
        const result = filterPrivateItems(items, 'user-1');
        expect(result).toEqual(items);
    });

    it('should include private items belonging to the user', () => {
        const items = [{ id: '1', visibility: 'private', ownerId: 'user-1' }];
        const result = filterPrivateItems(items, 'user-1');
        expect(result).toHaveLength(1);
    });

    it('should exclude private items not belonging to the user', () => {
        const items = [{ id: '1', visibility: 'private', ownerId: 'other-user' }];
        const result = filterPrivateItems(items, 'user-1');
        expect(result).toHaveLength(0);
    });

    it('should filter mixed items correctly', () => {
        const items = [
            { id: '1' },
            { id: '2', visibility: 'private', ownerId: 'user-1' },
            { id: '3', visibility: 'private', ownerId: 'other-user' },
        ];
        const result = filterPrivateItems(items, 'user-1');
        expect(result).toHaveLength(2);
        expect(result.map(i => i.id)).toEqual(['1', '2']);
    });
});
