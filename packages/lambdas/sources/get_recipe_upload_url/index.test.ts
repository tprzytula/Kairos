import { handler } from "./index";
import * as s3 from "./s3";

vi.mock("./s3");

describe('Given the get_recipe_upload_url lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 when extension is missing', async () => {
        const result = await handler({ queryStringParameters: {} } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("extension query parameter is required");
    });

    it('should return 400 when extension is invalid', async () => {
        const result = await handler({ queryStringParameters: { extension: "!!!" } } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Invalid extension");
    });

    it('should sanitize the extension and call generateUploadUrl', async () => {
        const generateSpy = vi.mocked(s3.generateUploadUrl).mockResolvedValue({
            uploadUrl: "https://s3.example.com/upload",
            imagePath: "https://cdn.example.com/image.jpg",
        });

        await handler({ queryStringParameters: { extension: "JP--G" } } as any, {} as any, {} as any);

        expect(generateSpy).toHaveBeenCalledWith("jpg");
    });

    it('should return status 200 with upload URL and image path', async () => {
        vi.mocked(s3.generateUploadUrl).mockResolvedValue({
            uploadUrl: "https://s3.example.com/upload",
            imagePath: "https://cdn.example.com/image.jpg",
        });

        const result = await handler({ queryStringParameters: { extension: "jpg" } } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({
            uploadUrl: "https://s3.example.com/upload",
            imagePath: "https://cdn.example.com/image.jpg",
        });
    });

    describe('When generateUploadUrl fails', () => {
        it('should return status 500', async () => {
            vi.mocked(s3.generateUploadUrl).mockRejectedValue(new Error('S3 error'));

            const result = await handler({ queryStringParameters: { extension: "jpg" } } as any, {} as any, {} as any);

            expect(result).toEqual({
                body: "Internal Server Error",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Project-ID",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                statusCode: 500,
            });
        });
    });
});
