import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"
import { middleware, AuthenticatedEvent } from "@kairos-lambdas-libs/middleware"
import { createResponse } from "@kairos-lambdas-libs/response"

const client = new S3Client({})

const generateUploadUrl = async (
  folder: string,
  extension: string,
): Promise<{ uploadUrl: string; imagePath: string }> => {
  const bucket = process.env.UPLOAD_BUCKET_NAME!
  const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN!
  const key = `user-uploads/${folder}/${uuidv4()}.${extension}`

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 })
  const imagePath = `https://${cloudfrontDomain}/${key}`

  return { uploadUrl, imagePath }
}

export const createUploadUrlHandler = (
  folder: string,
): Handler<APIGatewayProxyEvent> =>
  middleware(async (event: AuthenticatedEvent) => {
    const extension = event.queryStringParameters?.extension

    if (!extension) {
      return createResponse({
        statusCode: 400,
        message: "extension query parameter is required",
      })
    }

    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (!safeExtension) {
      return createResponse({
        statusCode: 400,
        message: "Invalid extension",
      })
    }

    const result = await generateUploadUrl(folder, safeExtension)

    return createResponse({
      statusCode: 200,
      message: result,
    })
  })
