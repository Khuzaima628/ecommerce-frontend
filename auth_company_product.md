Base URL

/api/v1
Response shape (every endpoint)
Success:


{ "success": true, "message": "string", "data": {} }
Error:


{ "success": false, "message": "string", "errors": null }
Protected routes (🔒) need this header:


Authorization: Bearer <accessToken>
AUTH
POST /api/v1/auth/signup

// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "seller"
}

// 201 Success
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "profilePicture": "https://res.cloudinary.com/dk4l1jz0g/image/upload/v1682171506/avatar_default_gm2f1p.png",
    "role": "seller",
    "isVerified": false,
    "createdAt": "2026-08-29T12:00:00.000Z",
    "updatedAt": "2026-08-29T12:00:00.000Z"
  }
}
Errors: 400 validation, 400 "User already exist with this email"

POST /api/v1/auth/otp-verify

// Request
{ "email": "john@example.com", "otp": 123456 }

// 200 Success
{
  "success": true,
  "message": "User verified successfully",
  "data": { "_id": "6650a1f2c3d4e5f6a7b8c9d0", "isVerified": true }
}
Errors: 400 "Email and OTP is required" / "User already Verified" / "Invalid OTP" / "OTP has expired"

POST /api/v1/auth/login

// Request
{ "email": "john@example.com", "password": "secret123" }

// 200 Success
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "6650a1f2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "seller",
      "isVerified": true
    },
    "refreshToken": "eyJhbGciOi...",
    "accessToken": "eyJhbGciOi..."
  }
}
Errors: 400 "No Active account on This Email" / "Please verify your account first" / "Incorrect Password"

POST /api/v1/auth/forgot-password

// Request
{ "email": "john@example.com" }

// 200 Success
{ "success": true, "message": "OTP sent to your email", "data": null }
Errors: 400 "Email is required", 404 "User not found with this email"

POST /api/v1/auth/verify-forgot-password-otp

// Request
{ "email": "john@example.com", "otp": 123456 }

// 200 Success
{
  "success": true,
  "message": "OTP verified successfully",
  "data": { "resetToken": "eyJhbGciOi..." }
}
Errors: 400 "OTP is required" / "User not found" / "Invalid OTP"

POST /api/v1/auth/reset-password

// Request
{
  "resetToken": "eyJhbGciOi...",
  "newPassword": "newSecret123",
  "confirmPassword": "newSecret123"
}

// 200 Success
{ "success": true, "message": "Password reset successfully", "data": null }
Errors: 400 "Reset token and New Password fields are required" / "confirm password must match new password" / "Reset link is invalid or expired" / "User not found"

POST /api/v1/auth/refresh-token

// Request
{ "refreshToken": "eyJhbGciOi..." }

// 200 Success
{
  "success": true,
  "message": "New Refresh Token Generated Sucessfully",
  "data": { "newAccessToken": "eyJhbGciOi..." }
}
Errors: 401 "Refresh token is invalid or expired. Please login again." / "The user of this token no longer exists." / "Please verify your email first"

GET /api/v1/auth/get-me 🔒
No body.


// 200 Success
{
  "success": true,
  "message": "User Data Fetcehed Sucessfully",
  "data": {
    "_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seller",
    "isVerified": true,
    "profilePicture": "https://..."
  }
}
Errors: 401 not logged in / invalid token, 404 "No user found with this id"

PATCH /api/v1/auth/get-me 🔒

// Request (at least 1 field)
{
  "name": "John Updated",
  "profilePicture": "https://example.com/pic.png"
}

// 200 Success
{
  "success": true,
  "message": "user update sucessfully",
  "data": {
    "_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "name": "John Updated",
    "profilePicture": "https://example.com/pic.png"
  }
}
Errors: 400 "At least one field is required to update your profile", 404 "No user found with this id"

All auth endpoints:


POST   /api/v1/auth/signup
POST   /api/v1/auth/otp-verify
POST   /api/v1/auth/login
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/verify-forgot-password-otp
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/refresh-token
GET    /api/v1/auth/get-me           🔒
PATCH  /api/v1/auth/get-me           🔒
MEDIA
POST /api/v1/media/presigned-url

// Request
{
  "fileName": "photo.png",
  "fileType": "image/png",
  "fileSize": 204800,
  "folder": "product"
}
fileType must be image/png | image/jpeg | image/webp. fileSize max 5MB. folder must be profile | product | banner.


// 200 Success
{
  "success": true,
  "message": "Upload URL created successfully",
  "data": {
    "uploadUrl": "https://minio.example.com/my-bucket/product/1735489200000-photo.png?X-Amz-Signature=...",
    "fileUrl": "https://minio.example.com/my-bucket/product/1735489200000-photo.png"
  }
}
Frontend flow: PUT the raw file bytes directly to uploadUrl (with header Content-Type = your fileType), it expires in 5 min. Then use fileUrl as the permanent image URL when creating a product/company/profile.

Errors: 400 validation (bad fileName/fileType/fileSize/folder)

All media endpoints:


POST   /api/v1/media/presigned-url
PRODUCT (all 🔒, seller-only for create)
POST /api/v1/product 🔒

// Request
{
  "productName": "Handmade Notebook",
  "description": "A beautiful handcrafted notebook with recycled paper.",
  "price": 19.99,
  "stock": 50,
  "images": ["https://cdn.example.com/img1.png"],
  "category": "stationary",
  "sku": "NOTE-001",
  "tags": ["handmade", "bestseller"],
  "specifications": [
    { "label": "Pages", "value": "200" },
    { "label": "Size", "value": "A5" }
  ],
  "returns_note": "Returns accepted within 7 days if unused."
}
category: stationary | books | art_supplies | home_goods | apparel
tags: handmade | bestseller | limited_stock | small_batch | restocked | archival | gift_wrapped
images: 1–3 items


// 201 Success
{
  "success": true,
  "message": "Product Created Successfully",
  "data": {
    "_id": "6650b2f2c3d4e5f6a7b8c9e1",
    "manufacturer_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "productName": "Handmade Notebook",
    "description": "A beautiful handcrafted notebook with recycled paper.",
    "price": 19.99,
    "stock": 50,
    "isHidden": false,
    "images": ["https://cdn.example.com/img1.png"],
    "category": "stationary",
    "sku": "NOTE-001",
    "tags": ["handmade", "bestseller"],
    "specifications": [
      { "label": "Pages", "value": "200" },
      { "label": "Size", "value": "A5" }
    ],
    "returns_note": "Returns accepted within 7 days if unused.",
    "createdAt": "2026-08-29T12:00:00.000Z",
    "updatedAt": "2026-08-29T12:00:00.000Z"
  }
}
Errors: 400 validation, 404 "User not found with this id", 401 "Only manufacturer can create product", 400 "SKU already exists"

GET /api/v1/products 🔒
No body. Returns caller's own products.


// 200 Success
{
  "success": true,
  "message": "Products Fetched Successfully",
  "data": [
    {
      "_id": "6650b2f2c3d4e5f6a7b8c9e1",
      "productName": "Handmade Notebook",
      "price": 19.99,
      "stock": 50,
      "sku": "NOTE-001",
      "isHidden": false
    }
  ]
}
Errors: 404 "User not found"

GET /api/v1/product/:pid 🔒
No body.


// 200 Success
{
  "success": true,
  "message": "Products Fetched Successfully",
  "data": {
    "_id": "6650b2f2c3d4e5f6a7b8c9e1",
    "productName": "Handmade Notebook",
    "manufacturer_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "price": 19.99,
    "stock": 50
  }
}
Errors: 404 "Product not found", 403 "This product does not belong to you"

PATCH /api/v1/product/:pid 🔒

// Request (at least 1 field, all optional)
{ "productName": "Updated Notebook Name", "price": 24.99, "stock": 30 }

// 200 Success
{
  "success": true,
  "message": "Product Updated Successfully",
  "data": {
    "_id": "6650b2f2c3d4e5f6a7b8c9e1",
    "productName": "Updated Notebook Name",
    "price": 24.99,
    "stock": 30
  }
}
Errors: 400 "Send at least one field to update", 404 "Product not found", 403 "This product does not belong to you", 409 "SKU already exists. Please choose a different SKU."

DELETE /api/v1/product/:pid 🔒
No body.


  
// 200 Success
{ "success": true, "message": "Product Deleted Successfully", "data": null }
Errors: 404 "Product not found", 403 "This product does not belong to you"

PATCH /api/v1/product/hide/:pid 🔒
No body. Toggles hide/unhide.


// 200 Success
{ "success": true, "message": "Product updated successfully", "data": null }
Errors: 404 "Product not found", 403 "This product does not belong to you"

PUT /api/v1/product/increase-stock/:pid 🔒

// Request (change can be negative to decrease)
{ "change": 10 }

// 200 Success (now returns the updated product — just fixed)
{
  "success": true,
  "message": "Stock Updated Successfully",
  "data": {
    "_id": "6650b2f2c3d4e5f6a7b8c9e1",
    "productName": "Handmade Notebook",
    "stock": 60
  }
}
Errors: 404 "Product not found", 403 "This product does not belong to you"

All product endpoints:


POST   /api/v1/product                          🔒
GET    /api/v1/products                         🔒
GET    /api/v1/product/:pid                     🔒
PATCH  /api/v1/product/:pid                     🔒
DELETE /api/v1/product/:pid                     🔒
PATCH  /api/v1/product/hide/:pid                🔒
PUT    /api/v1/product/increase-stock/:pid      🔒
COMPANY (all 🔒, seller-only)
POST /api/v1/company 🔒

// Request
{
  "companyName": "Crafty Co",
  "bio": "We make handmade goods.",
  "logo": "https://cdn.example.com/logo.png",
  "address": {
    "street": "123 Main St",
    "city": "Lahore",
    "state": "Punjab",
    "country": "Pakistan",
    "zip": "54000"
  },
  "taxId": "TAX-12345"
}

// 201 Success
{
  "success": true,
  "message": "Company Created Successfully",
  "data": {
    "_id": "6650c3f2c3d4e5f6a7b8c9f2",
    "manufacturer_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "companyName": "Crafty Co",
    "bio": "We make handmade goods.",
    "logo": "https://cdn.example.com/logo.png",
    "address": {
      "street": "123 Main St",
      "city": "Lahore",
      "state": "Punjab",
      "country": "Pakistan",
      "zip": "54000"
    },
    "taxId": "TAX-12345",
    "createdAt": "2026-08-29T12:00:00.000Z",
    "updatedAt": "2026-08-29T12:00:00.000Z"
  }
}
Errors: 400 validation, 400 "Company already exist", 404 "User not found", 401 "This route is not Belong to you"

GET /api/v1/company 🔒
No body.


// 200 Success
{
  "success": true,
  "message": "Get Company Successfully",
  "data": {
    "_id": "6650c3f2c3d4e5f6a7b8c9f2",
    "manufacturer_id": "6650a1f2c3d4e5f6a7b8c9d0",
    "companyName": "Crafty Co",
    "bio": "We make handmade goods.",
    "logo": "https://cdn.example.com/logo.png",
    "taxId": "TAX-12345"
  }
}
Errors: 404 "User not found" / "Company not found", 401 "This route is not Belong to you"

All company endpoints:


POST   /api/v1/company    🔒
GET    /api/v1/company    🔒



You call POST /api/v1/media/presigned-url → server gives you back two links:

uploadUrl — a special, temporary link (valid 5 minutes) that lets you upload directly to storage (S3/MinIO)
fileUrl — the future permanent link to that file (it's really just the same location, without the temporary "permission signature")
You must then send a PUT request to uploadUrl, with the actual file bytes as the body. This is a raw upload — not JSON, the file itself.

Once that PUT succeeds, the file exists at that location — and now fileUrl actually works (you can view/download it).

If you skip step 2, fileUrl points to nothing — it will 404 if you try to open it, because no file was ever uploaded there.

Example with fetch on the frontend:


// step 1: ask backend for upload permission
const res = await fetch("/api/v1/media/presigned-url", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fileName: "photo.png", fileType: "image/png", fileSize: file.size, folder: "product" })
});
const { uploadUrl, fileUrl } = (await res.json()).data;

// step 2: actually upload the file bytes to uploadUrl
await fetch(uploadUrl, {
  method: "PUT",
  headers: { "Content-Type": "image/png" },
  body: file   // the raw File object, not JSON
});

// step 3: now fileUrl is real — save it (e.g. into product.images)