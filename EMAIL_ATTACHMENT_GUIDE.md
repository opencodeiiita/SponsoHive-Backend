## Overview

We can upload pdf or docx files to cloud and send them as attachments in our campaign.
For that we would need to setup Cloudinary first.

## Cloudinary setup

1. Go to `cloudinary.com` and make an account.
2. You have to get 
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
    from the cloud, and put it in .env file.
    Can get all by going to Api keys section on the cloud.
3. MOST IMPORTANT: You need to go to Settings->Security and tick on Allow Pdf and Zip files delivery
    This is very important as Cloudinary have security protocols that would allow you to upload pdfs to cloud, but you cant serve it publicly by default.
    Without this option, you will be able to file in cloud, but the link wont open and ultimately nodemailer cant send the mail and you will recieve file uploaded success message but the email will give 401 error.

## Testing setup

- **POST**- `/api/upload`
- **Description**: Sends a mail with attachment uploaded, the file must be docs or pdf and less than 5 MB.
- **Request Body**:
  `Type: multipart/form-data`
  `Example body=> file: file_path`
- **Response**:
```json
{
  "message": "File uploaded successfuly"
}
```

## Usage

An upload middleware has been defined for this purpose that uploads to cloudinary and gives the fileUrl.
1. Import upload from middleware folder
2. Add upload.single('file') as a middleware to the route.
3. The fileUrl can be accessed from req.file.path
