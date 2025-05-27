### Requirement

- `Node v22.15.1`
- AWS Credentials

### URL

- http://localhost:3000/
- http://localhost:3000/s3/Report%20Flow.drawio.png
- http://localhost:3000/assets/0.jpg
- http://localhost:3000/s3/assets/0.jpg
- http://localhost:3000/s3/assets/1.jpg

### ENV

```env
AWS_REGION=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_KEY=
```


### Notes

https://expressjs.com/en/guide/migrating-5.html#path-syntax  
express 5 wildcard routing require route name
e.g 
- v4 `/*`
- v5 `/*path`