const path = require("path");
var restify = require("restify");
const cors = require("cors");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const PORT = 3000;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const PRESIGNED_URL_EXPIRATION = 3600; //URL expiration time in seconds

const app = restify.createServer();

let corsOptions = {
  origin: ["http://127.0.0.1:5500"],
};

let client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

app.use(cors(corsOptions));

app.get(
  "/assets/*",
  restify.plugins.serveStatic({
    directory: __dirname,
  })
);

app.get("/", (req, res, next) => {
  res.setHeader("Content-Type", "text/html");
  res.end(`
    <!DOCTYPE html>
    <html>
    <body>
      <h1>The img element</h1>
      <img src="http://localhost:3000/s3/assets/1.jpg" alt="image from s3" width="500" height="600">
    </body>
    </html>
  `);
});

// Route for serving private bucket assets
app.get("/s3/*", async function (req, res) {
  const filePath = req.params["*"];
  console.log("filePath : ", filePath);

  const getObjectParams = {
    Bucket: AWS_S3_BUCKET,
    Key: filePath,
  };

  try {
    const command = new GetObjectCommand(getObjectParams);
    // Generate the pre-signed URL
    const signedUrl = await getSignedUrl(client, command, {
      expiresIn: PRESIGNED_URL_EXPIRATION,
    });

    res.redirect(signedUrl, nextFn);
  } catch (error) {
    console.error("Error generating signed URL", error);
    res.status(500).send("Error accessing the requested file");
  }
});

app.listen(PORT, () => {
  console.log(`app running at ${PORT}`);
});

function nextFn() {}