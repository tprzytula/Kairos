import { handler } from "./index";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

vi.mock("@aws-sdk/client-s3");
vi.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: vi.fn(),
}));
vi.mock("uuid", () => ({ v4: () => "test-uuid" }));

describe('Given the upload URL lambda handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.UPLOAD_BUCKET_NAME = "test-bucket";
        process.env.CLOUDFRONT_DOMAIN = "cdn.example.com";
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

    it('should sanitize the extension and call getSignedUrl', async () => {
        vi.mocked(getSignedUrl).mockResolvedValue("https://s3.example.com/presigned");

        await handler({ queryStringParameters: { extension: "JP--G" } } as any, {} as any, {} as any);

        expect(getSignedUrl).toHaveBeenCalled();
    });

    it('should return status 200 with upload URL and image path', async () => {
        vi.mocked(getSignedUrl).mockResolvedValue("https://s3.example.com/presigned");

        const result = await handler({ queryStringParameters: { extension: "jpg" } } as any, {} as any, {} as any);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body.uploadUrl).toBe("https://s3.example.com/presigned");
        expect(body.imagePath).toMatch(/https:\/\/cdn\.example\.com\//);
    });

    describe('When getSignedUrl fails', () => {
        it('should return status 500', async () => {
            vi.mocked(getSignedUrl).mockRejectedValue(new Error('S3 error'));

            const result = await handler({ queryStringParameters: { extension: "jpg" } } as any, {} as any, {} as any);

            expect(result.statusCode).toBe(500);
        });
    });
});
