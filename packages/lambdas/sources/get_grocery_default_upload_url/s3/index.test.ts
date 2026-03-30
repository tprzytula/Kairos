import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateUploadUrl } from ".";

vi.mock("@aws-sdk/client-s3");
vi.mock("@aws-sdk/s3-request-presigner", () => ({
    getSignedUrl: vi.fn(),
}));
vi.mock("uuid", () => ({ v4: () => "test-uuid" }));

describe('Given the generateUploadUrl function for grocery defaults', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.UPLOAD_BUCKET_NAME = "test-bucket";
        process.env.CLOUDFRONT_DOMAIN = "cdn.example.com";
    });

    it('should call getSignedUrl with 300 second expiration', async () => {
        vi.mocked(getSignedUrl).mockResolvedValue("https://s3.example.com/presigned");

        await generateUploadUrl("jpg");

        expect(getSignedUrl).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            { expiresIn: 300 },
        );
    });

    it('should return the upload URL and image path', async () => {
        vi.mocked(getSignedUrl).mockResolvedValue("https://s3.example.com/presigned");

        const result = await generateUploadUrl("png");

        expect(result).toEqual({
            uploadUrl: "https://s3.example.com/presigned",
            imagePath: "https://cdn.example.com/user-uploads/grocery-defaults/test-uuid.png",
        });
    });
});
