import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config/index.js";
import { v4 as uuidv4 } from "uuid";

let s3Client = null;

function getS3Client() {
  if (s3Client) return s3Client;

  if (config.aws.accessKeyId && config.aws.secretAccessKey) {
    const clientConfig = {
      region: config.aws.s3Region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
      },
    };

    s3Client = new S3Client(clientConfig);
    console.log("[S3] Client initialized", {
      region: config.aws.s3Region,
      bucket: config.aws.s3Bucket,
    });
  }

  return s3Client;
}

export async function uploadFile(file, folder = "uploads") {
  const client = getS3Client();
  if (!client) {
    const ext = file.originalname?.split(".").pop() || "jpg";
    const fakeUrl = `https://picsum.photos/seed/${uuidv4()}/600/400`;
    console.log("[S3] No S3 credentials, using mock URL");
    return {
      url: fakeUrl,
      key: `mock/${uuidv4()}.${ext}`,
      bucket: config.aws.s3Bucket,
    };
  }

  const ext = file.originalname?.split(".").pop() || "jpg";
  const key = `${folder}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await client.send(command);
    console.log("[S3] Upload success", { key, size: file.size });
  } catch (err) {
    if (
      err.Code === "PermanentRedirect" ||
      err.$metadata?.httpStatusCode === 301
    ) {
      console.error(
        "[S3] PermanentRedirect - region mismatch. Ensure AWS_S3_REGION matches the bucket region.",
      );
    }
    throw err;
  }

  const url = `https://${config.aws.s3Bucket}.s3.${config.aws.s3Region}.amazonaws.com/${key}`;

  return { url, key, bucket: config.aws.s3Bucket };
}

export async function deleteFile(key) {
  const client = getS3Client();
  if (!client) return true;

  const command = new DeleteObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
  });

  await client.send(command);
  return true;
}

export async function getSignedFileUrl(key, expiresIn = 3600) {
  const client = getS3Client();
  if (!client) return null;

  const command = new GetObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export default { uploadFile, deleteFile, getSignedFileUrl };
