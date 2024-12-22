import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

export const putObject = async (key: string, body: Buffer) => {
  const command = new PutObjectCommand({
    Key: key,
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    Body: body,
  });

  // Put the object
  await s3Client.send(command);
};

export const getObjectPresignedUrl = async (key: string, expiresIn: number) => {
  const command = new GetObjectCommand({
    Key: key,
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};

export const objectExists = async (key: string) => {
  const command = new HeadObjectCommand({
    Key: key,
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
  });
  
  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "NotFound") {
      return false;
    }
    throw error;
  }
};