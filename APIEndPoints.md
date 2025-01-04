# SponsoHive API Endpoints

## Authentication

### 1. **User Registration**
**POST** `/api/auth/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "userId": "string"
  }
  ```

### 2. **User Login**
**POST** `/api/auth/login`
- **Description**: Authenticate a user.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
   }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### 3. **User Logout**
**POST** `/api/auth/logout`
- **Description**: Log out a user.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## Email List Management

### 4. **Upload Email List**
**POST** `/api/emails/upload`
- **Description**: Upload a bulk email list.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Request Body**:
  ```json
  {
    "file": "<CSV/Excel file>"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Emails uploaded successfully",
    "processed": "integer",
    "duplicates": "integer",
    "invalid": "integer"
  }
  ```

### 5. **Get Email List**
**GET** `/api/emails`
- **Description**: Retrieve all uploaded emails.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  [
    {
      "email": "string",
   "category": "string",
      "status": "valid | duplicate | invalid"
    }
  ]
  ```

### 6. **Delete Email**
**DELETE** `/api/emails/:emailId`
- **Description**: Delete an email from the list.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  {
    "message": "Email deleted successfully"
  }
  ```

---

## Campaign Management

### 7. **Create Campaign**
**POST** `/api/campaigns`
- **Description**: Create a new email campaign.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "emails": ["string"],
    "template": "string",
   "schedule": "ISO_8601 string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Campaign created successfully",
    "campaignId": "string"
  }
  ```

  **POST** `/api/campaigns/preview`
- **Description**:  Generate a preview of an email campaign by replacing 
                    placeholders in the template with recipient data..
- **Headers**:
  - Authorization: `Bearer <token>`
- **Request Body**:
  ```json
  {
    "template": "string", // Email template containing placeholders (e.g., "{{firstName}}").
    "recipientId": "string" // ID of the recipient to use for replacing placeholders.
  }

  ```
- **Response**:
  ```json
  - Success(200)
  {
    "message": "Email preview generated successfully",
    "preview": "string" // The email preview with placeholders replaced by recipient data.
  }
  - Client Error(400)
  {
    "message": "Template and recipient ID are required"
  }
  - Not Found(404)
  {
    "message": "Recipient not found"
  }
  - Server Error(500):
  {
    "message": "An error occurred while generating the email preview"
  }
  ```

### 8. **Get Campaigns**
**GET** `/api/campaigns`
- **Description**: Retrieve all campaigns.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  [
    {
      "campaignId": "string",
      "name": "string",
      "emailsSent": "integer",
      "status": "pending | ongoing | completed"
    }
  ]
  ```

### 9. **Update Campaign**
**PUT** `/api/campaigns/:campaignId`
- **Description**: Update a campaign.
- **Headers**:
  - Authorization: `Bearer <token>`
  - - **Request Body**:
  ```json
  {
    "name": "string",
    "emails": ["string"],
    "template": "string",
    "schedule": "ISO_8601 string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Campaign updated successfully"
  }
  ```

---

## Analytics

### 10. **Get Campaign Analytics**
**GET** `/api/analytics/:campaignId`
- **Description**: Retrieve analytics for a specific campaign.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  {
    "openRate": "percentage",
    "clickThroughRate": "percentage",
    "responseRate": "percentage",
    "bounces": "integer",
    "unsubscribes": "integer"
   }
  ```

### 11. **Get General Analytics**
**GET** `/api/analytics`
- **Description**: Retrieve overall email campaign performance.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  {
    "totalEmailsSent": "integer",
    "totalResponses": "integer",
    "totalBounces": "integer",
    "totalUnsubscribes": "integer"
  }
  ```

---

## Compliance

### 12. **Get Compliance Settings**
**GET** `/api/compliance`
- **Description**: Retrieve GDPR and CAN-SPAM compliance settings.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
  ```json
  {
    "optOutLink": "string",
    "senderVerification": "boolean"
   }
  ```

### 13. **Update Compliance Settings**
**PUT** `/api/compliance`
- **Description**: Update compliance settings.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Request Body**:
  ```json
  {
    "optOutLink": "string",
    "senderVerification": "boolean"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Compliance settings updated successfully"
  }
  ```

### 14. **GET email list: Pagination for email lists**
**GET** `/api/email-lists`
- **Description**: Fetches a paginated list of email records.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Query Parameters**
- ```Parameter	       Type	      Default	            Description
-     page	          Number	      1	          The page number to retrieve.
-     limit	        Number	      10	        Number of items to fetch per page.
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      { "id": "integer", "email": "string" },
      { "id": "integer", "email": "string" }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "limit": 10
    }
  }
  ```

  ### 15. **Fetch User Profiles from linkedin and twitter**


#### **1. LinkedIn API: Fetch User Profiles by Email**

**Endpoint:**  
`GET /api/social/linkedin/authorize`

**Description:**  
Fetches LinkedIn profile data for a user based on their email address and saves it in the database.

**Required Scopes:**  
To fetch the necessary LinkedIn data, the following OAuth 2.0 scopes are required during the authorization process:

1. **`openid`**:  
   This scope grants access to the user's LinkedIn ID and basic profile information.

2. **`email`**:  
   This scope grants access to the user's primary email address.

3. **`profile`**:  
   This scope grants access to the user's basic profile information, including first name, last name, headline, and profile picture.

**Steps to Use:**  
1. **Register a LinkedIn Application:**  
   - Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/) and create an application.  
   - Note down your `CLIENT_ID` and `CLIENT_SECRET`.  

2. **Set Up Environment Variables:**  
   Add the following variables to your `.env` file:  
   ```plaintext
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_REDIRECT_URI=your_redirect_uri
   ```

3. **Obtain Authorization Code:**  
   - Send users to this authorization URL to obtain the code:  
     ```
     https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={LINKEDIN_CLIENT_ID}&redirect_uri={LINKED_URI}&scope=r_liteprofile%20r_emailaddress
     ```  
   - Replace `{LINKEDIN_CLIENT_ID}` and `{LINKEDIN_REDIRECT_URI}` with your application’s details.

4. **Exchange Code for Access Token:**  
   This is handled by the backend when the `GET` request is sent to `/api/social/linkedin/authorize`.

**Request Example:**  
```plaintext
GET /api/social/linkedin/authorize?code=AUTHORIZATION_CODE
```

**Response Example:**  
```json
{
    "sub": "782bbtaQ",
    "name": "John Doe",
    "given_name": "John",
    "family_name": "Doe",
    "picture": "https://media.licdn-ei.com/dms/image/C5F03AQHqK8v7tB1HCQ/profile-displayphoto-shrink_100_100/0/",
    "locale": "en-US",
    "email": "doe@email.com",
    "email_verified": true
}
```

---

Let me know if you'd like to further adjust this or need any additional details!

---

#### **2. Twitter API: Fetch Public Profile by Username**

**Endpoint:**  
`GET /api/social/twitter/:username/:userEmail`

**Description:**  
Fetches public profile data from Twitter for a given username and email and saves it in the database.

**Steps to Use:**  
1. **Create a Twitter Developer Account:**  
   - Go to the [Twitter Developer Portal](https://developer.twitter.com/) and create a new app.  
   - Note down your `API_KEY` and `API_SECRET_KEY`.  

2. **Set Up Environment Variables:**  
   Add the following variables to your `.env` file:  
   ```plaintext
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET_KEY=your_twitter_api_secret_key
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token
   ```

3. **Generate Bearer Token:**  
   - Use the Twitter Developer Portal to generate a Bearer Token. This is required for making API calls.  

**Request Example:**  
```plaintext
GET /api/social/twitter/johndoe/user@example.com
```

**Response Example:**  
```json
{
  "email": "user@example.com",
  "twitterProfile": {
    "username": "johndoe",
    "bio": "Building awesome web applications.",
    "location": "San Francisco, CA",
    "followersCount": 1500,
    "followingCount": 200
  },
  "message": "Twitter profile data saved successfully."
}
```

---

#### **3. Disable Social Media Integration**

**Endpoint:**  
`POST /api/social/disable`

**Description:**  
Disables social media integration for a user and deletes saved LinkedIn and Twitter data.

**Request Example:**  
```json
{
  "email": "user@example.com"
}
```

**Response Example:**  
```json
{
  "message": "Social media integration disabled, and data deleted successfully."
}
```

---

### Key Notes

- **Error Handling:**  
  Both endpoints handle missing or incomplete profile data gracefully and return descriptive error messages.  
  Example:  
  ```json
  {
    "error": "Twitter profile not found for the given username."
  }
  ```

- **Database Integration:**  
  Fetched data is stored in the `SocialMediaSchema` with fields for email, LinkedIn profile, Twitter profile, and `updatedAt`.

- **Testing:**  
  Use mock email addresses and usernames to test the API endpoints. Ensure the `.env` file is properly configured for LinkedIn and Twitter API access.

---

Would you like sample code for any of these routes?

