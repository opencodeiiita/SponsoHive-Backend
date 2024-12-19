## Overview
The email campaign automation feature allows users to:

Create and manage email templates.
Schedule email campaigns and automate follow-ups.
Fetch detailed campaign statistics for performance analysis.
This feature is designed to streamline email marketing efforts by providing a user-friendly interface and robust automation tools.

Key Features:
Template Management: Easily design and manage email templates.
Campaign Scheduling: Schedule one-time or recurring campaigns with precise control.
Follow-Ups: Automatically send follow-ups based on recipient behavior.
Analytics: Monitor campaign performance, including open rates, click-through rates, and conversions.


#  API Documentation

# Template Management
## Create Template

- **POST**- `/api/templates`
- **Description**: Creates a new email template.
- **Request Body**:
```json
{
  "name": "Welcome Email",
  "subject": "Welcome to Our Service!",
  "body": "<html>Your custom HTML here</html>"
}
```
- **Response**:
```json
{
  "id": "template_id",
  "message": "Template created successfully."
}
```

## Get All Templates

- **GET**- `/api/templates`
- **Description**: Retrieves a list of all email templates.
- **Response**:
```json

  {
    "id": "template_id",
    "name": "Welcome Email",
    "subject": "Welcome to Our Service!"
  }
```

# Campaign Management
## Create Campaign

- **POST**- `/api/campaigns`
- **Description**: Creates a new email campaign.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Request Body**:
```json
[
{
  "name": "string",
  "emails": ["string"],
  "template": "string",
  "schedule": "ISO_8601 string"
}
]
```

- **Response**:
```json
{
  "message": "Campaign created successfully",
  "campaignId": "string"
}
```
## Get Campaigns

- **GET** -`/api/campaigns`
- **Description**: Retrieves all campaigns.
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

## Update Campaign

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
# Schedule
- **POST**- `/api/campaigns/schedule`
- **Description**: Schedules an email campaign to be sent at a specified time.

- **Headers**:
- Authorization: `Bearer <token>`
- **Request Body**:
```json
{
  "name": "string",            
  "emailListId": "string",    
  "schedule": "ISO_8601 string" 
}
```
- **Response**:
-201 Created: Campaign scheduled successfully.
```json
{
  "message": "Campaign scheduled successfully.",
  "campaign": {
    "campaignId": "string",  
    "name": "string", 
    "emailListId": "string",
    "schedule": "ISO_8601 string"
  }
}
```
- 400 Bad Request: Missing required fields or invalid data.
```json
{
  "message": "Missing required fields."
}
```
- 500 Internal Server Error: Unexpected server error.
```json
{
  "message": "Internal server error."
}
```
# Get Schedule
- **GET**- `/api/campaigns/scheduled`
- **Description**: Retrieves all scheduled email campaigns.
- **Headers**:
  - Authorization: `Bearer <token>`
- **Response**:
-200 OK: Returns a list of all scheduled campaigns.
```json
[
  {
    "campaignId": "string",      
    "name": "string",            
    "emailListId": "string",     
    "scheduledAt": "ISO_8601 string",  
    "status": "string"           
  }
]
```
- 400 Bad Request: Invalid request.
```json
{
  "message": "Invalid request."
}
```
- 500 Internal Server Error: Unexpected server error.
```json
{
  "message": "Internal server error."
}
```

# Follow-Ups
## Add Follow-Up
- **POST**- `/api/campaigns/{campaign_id}/follow-ups`
- **Description** : Adds a follow-up to an existing campaign.
- **Request Body**:
```json
{
  "delay_hours": 48,
  "follow_up_template_id": "template_id"
}
```
- **Response**:
```json
{
  "message": "Follow-up added successfully."
}
```

# Analytics
## Get Campaign Analytics

- **GET** -`/api/analytics/:campaignId`
- **Description**: Retrieves analytics for a specific campaign.
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

## Get General Analytics
- **GET**- `/api/analytics`
- **Description**: Retrieves overall performance data for all email campaigns.
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

# Setting Up Email Services
-Example: SendGrid
-Sign up at SendGrid.
-Generate an API key in the dashboard.
-Add the API key to your application's configuration file:

```env
-SENDGRID_API_KEY=your_api_key

# Test the connection using the following command:
```bash

curl -X POST https://api.sendgrid.com/v3/mail/send \
-H "Authorization: Bearer your_api_key" \
-H "Content-Type: application/json" \
-d '{
  "personalizations": [{"to": [{"email": "test@example.com"}]}],
  "from": {"email": "your_email@example.com"},
  "subject": "Test Email",
  "content": [{"type": "text/plain", "value": "Hello, world!"}]
}'
```

# Contributor’s Guide
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/sponsohive-backend.git
   cd sponsohive-backend
2. **Install Dependencies:**:
   ```bash
   npm install
3. **Set Up Environment Variables: Create a .env file in the root directory and configure the following:**:
   ```bash
   SENDGRID_API_KEY=your_key
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_key

4. **Run the Application:**:
   ```bash
   npm run dev

---

# Coding Standards 

- Use 2 spaces for indentation.
- Naming Conventions

- Use camelCase for variables/functions and PascalCase for classes.
- RESTful API naming (e.g., /api/campaigns/:id/analytics).
- Constants in UPPER_SNAKE_CASE.
- Function Design

- Ensure single responsibility (one task per function).
- Use object parameters for functions with >3 arguments.
- Example: scheduleCampaign({ name, emails, templateId, time }).

# Security Standards
- Store sensitive data (e.g., SENDGRID_API_KEY) in .env.
- Validate and sanitize inputs (e.g., emails, template IDs).
- Use consistent error handling (e.g., middleware for server errors).

- Use appropriate HTTP status codes (200, 201, 400, 500).
- Return descriptive responses: { "message": "Campaign created successfully" }.

## Contributions
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add your feature here'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---
