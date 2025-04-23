import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";

const { DynamoDBTable } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    scan: jest.fn(),
}));

describe('Given the get_grocery_items_icons lambda handler', () => {
    it('should make a scan request to the grocery items icons table', async () => {
        const scanSpy = mockScan();

        await handler({} as any, {} as any, {} as any);

        expect(scanSpy).toHaveBeenCalledWith({
            tableName: DynamoDBTable.GROCERY_ITEMS_ICONS,
        });
    });

    it('should log the response', async () => {
        const logSpy = jest.spyOn(console, 'info').mockImplementation(() => { });

        await handler({} as any, {} as any, {} as any);

        expect(logSpy).toHaveBeenCalledWith('Returning items', {
            count: 2,
            items: JSON.stringify(EXAMPLE_DB_GROCERY_ITEMS_ICONS),
        });
    });

    it('should return status 200 and a list of grocery items icons', async () => {
        mockScan();

        const result = await handler({} as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify(EXAMPLE_DB_GROCERY_ITEMS_ICONS));
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

const mockScan = () => jest.spyOn(DynamoDB, 'scan').mockResolvedValue(EXAMPLE_DB_GROCERY_ITEMS_ICONS);

const EXAMPLE_DB_GROCERY_ITEMS_ICONS: Record<string, unknown>[] = [
    {
        name: "Apple",
        path: "/assets/images/apple.png",
    },
    {
        name: "Banana",
        path: "/assets/images/banana.png",
    },
];
