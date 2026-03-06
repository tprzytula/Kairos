import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const client = new S3Client({});

export const generateUploadUrl = async (
  extension: string
): Promise<{ uploadUrl: string; imagePath: string }> => {
  const bucket = process.env.UPLOAD_BUCKET_NAME!;
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN!;
  const key = `user-uploads/recipes/${uuidv4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const imagePath = `https://${cloudfrontDomain}/${key}`;

  return { uploadUrl, imagePath };
};
