import * as DynamoDB from "@kairos-lambdas-libs/dynamodb";
import * as Crypto from "node:crypto";

const { DynamoDBTables } = DynamoDB;

import { handler } from "./index";

jest.mock("@kairos-lambdas-libs/dynamodb", () => ({
    ...jest.requireActual("@kairos-lambdas-libs/dynamodb"),
    putItem: jest.fn(),
}));

jest.mock("node:crypto", () => ({
    ...jest.requireActual("node:crypto"),
    randomUUID: jest.fn(),
}));

describe('Given the add_grocery_item lambda handler', () => {
    beforeEach(() => {
        mockCrypto();
    });

    it('should make a put request to the grocery list table', async () => {
        const putSpy = mockPut();

        await runHandler({ body: JSON.stringify({ name: "Apple", quantity: 1 }) });

        expect(putSpy).toHaveBeenCalledWith({
            tableName: DynamoDBTables.GROCERY_LIST,
            item: {
                id: { S: expect.any(String) },
                name: { S: "Apple" },
                quantity: { N: "1" },
            },
        });
    });

    it('should return status 201 with the generated id', async () => {
        mockPut();

        const result = await runHandler({ body: JSON.stringify({ name: "Apple", quantity: 1 }) });

        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(JSON.stringify({ id: EXAMPLE_ID }));
    });

    describe('When the body is not provided', () => {
        it('should return status 400', async () => {
            const result = await runHandler({ body: null });

            expect(result.statusCode).toBe(400);
        });
    });

    describe('When the put request fails', () => {
        it('should log the error', async () => {
            const logSpy = jest.spyOn(console, 'error');

            const putSpy = mockPut();
            putSpy.mockRejectedValue(new Error('Put failed'));

            await runHandler({ body: JSON.stringify({ name: "Apple", quantity: 1 }) });

            expect(logSpy).toHaveBeenCalledWith('Handler Threw Exception:', new Error('Put failed'));
        });

        it('should return status 500', async () => {
            const putSpy = mockPut();
            putSpy.mockRejectedValue(new Error('Put failed'));

            const result = await runHandler({ body: JSON.stringify({ name: "Apple", quantity: 1 }) });

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

const mockPut = () => jest.spyOn(DynamoDB, 'putItem');

const EXAMPLE_ID = "11111111-1111-1111-1111-111111111111";  

const mockCrypto = () => jest.spyOn(Crypto, 'randomUUID').mockReturnValue(EXAMPLE_ID);

interface IAPIGatewayProxyEvent {
    body: string | null;
}

const runHandler = async ({ body }: IAPIGatewayProxyEvent) => {
    return await handler({ body } as any, {} as any, {} as any);
}