import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";
import { IGroceryItem } from "@kairos-lambdas-libs/dynamodb/types/groceryList";
import { GroceryItemUnit } from "@kairos-lambdas-libs/dynamodb/enums";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    scan: jest.fn(),
}));

describe('Given the get_grocery_items lambda handler', () => {
    it('should make a scan request to the grocery list table', async () => {
        const scanSpy = mockScan();

        await handler({} as any, {} as any, {} as any);

        expect(scanSpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_LIST,
        });
    });

    it('should log the response', async () => {
        const logSpy = jest.spyOn(console, 'info').mockImplementation(() => { });

        await handler({} as any, {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Returning items', {
            count: 3,
            items: JSON.stringify(EXAMPLE_DB_GROCERY_ITEMS),
        });
    });

    it('should return status 200 and a list of grocery items', async () => {
        mockScan();

        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual(JSON.stringify(EXAMPLE_DB_GROCERY_ITEMS));
    });

    describe('When the scan request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const scanSpy = mockScan();
            scanSpy.mockRejectedValue(new Error('Scan failed'));

            await handler({} as any, {} as any, {} as any);

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Scan failed'));
        });

        it('should return status 500', async () => {
            const scanSpy = mockScan();
            scanSpy.mockRejectedValue(new Error('Scan failed'));

            const result = await handler({} as any, {} as any, {} as any);

            expect(result).toEqual({
                body: "Internal Server Error",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                statusCode: 500,
            });
        });
    });
});

const mockScan = () => jest.spyOn(DynamoDB, 'scan').mockResolvedValue(EXAMPLE_DB_GROCERY_ITEMS);

const EXAMPLE_DB_GROCERY_ITEMS: Array<IGroceryItem> = [
    {
        id: "1",
        name: "Avocado",
        quantity: "2",
        imagePath: "Image 1",
        unit: GroceryItemUnit.KILOGRAM,
    },
    {
        id: "2",
        name: "Banana",
        quantity: "1",
        imagePath: "Image 2",
        unit: GroceryItemUnit.KILOGRAM,
    },
    {
        id: "3",
        name: "Apple",
        quantity: "2",
        imagePath: "Image 3",
        unit: GroceryItemUnit.KILOGRAM,
    },
];
