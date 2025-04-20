import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTables } = DynamoDB;

import { handler } from "./index";
import { AttributeValue } from "@kairos-lambdas-libs/dynamodb";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    scan: jest.fn(),
}));

describe('Given the get_grocery_items lambda handler', () => {
    it('should make a scan request to the grocery list table', async () => {
        const scanSpy = mockScan();

        await handler({} as any, {} as any, {} as any);

        expect(scanSpy).toHaveBeenCalledWith({
            tableName: DynamoDBTables.GROCERY_LIST,
        });
    });

    it('should log the response', async () => {
        const logSpy = jest.spyOn(console, 'info').mockImplementation(() => { });

        await handler({} as any, {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Returning items', {
            count: 2,
            items: JSON.stringify(EXAMPLE_EXPECTED_GROCERY_ITEMS),
        });
    });

    it('should return status 200 and a list of grocery items', async () => {
        mockScan();

        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(EXAMPLE_EXPECTED_GROCERY_ITEMS));
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

const EXAMPLE_DB_GROCERY_ITEMS: Record<string, AttributeValue>[] = [
    {
        id: { S: "1" },
        name: { S: "Apple" },
        quantity: { N: "1" },
        imagePath: { S: "Image 1" },
    },
    {
        id: { S: "2" },
        name: { S: "Banana" },
        quantity: { N: "2" },
        imagePath: { S: "Image 2" },
    },
];

const EXAMPLE_EXPECTED_GROCERY_ITEMS = [
    {
        quantity: 1,
        id: "1",
        name: "Apple",
        imagePath: "Image 1",
    },
    {
        quantity: 2,
        id: "2",
        name: "Banana",
        imagePath: "Image 2",
    },
];