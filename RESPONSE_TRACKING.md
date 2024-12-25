Here's the updated documentation to include the section about how to send emails with the necessary fields for parsing, as well as the `Reply` schema for storing replies:

---

# **Campaign Reply Tracking and Analytics System**

## **Overview**
This documentation provides an overview of the new features and updates for the campaign reply tracking and analytics system. These include the integration with SendGrid's inbound parsing service, updates to the campaign and reply schemas, the introduction of an analytics schema for tracking email campaign performance, and real-time notifications for campaign owners.

## **Key Features**

### 1. **Campaign Schema Enhancements**
- **`campaignId`**: A unique identifier (`campaignId`) is added to the campaign schema to associate emails with specific campaigns.
- **Unique `reply-to` address**: Each campaign now has a unique `reply-to` address that ensures replies are correctly routed to the respective campaign.

### 2. **Reply Schema and SendGrid Inbound Parsing**
- **Reply Schema Enhancements**:  
  For each email sent:
  - A unique `messageId` is generated and stored in the reply schema along with the `campaignId` and `recipientId`.
  - This `messageId` is appended to outgoing emails to allow for precise matching of incoming replies with their respective emails.
  
- **Webhook Route Setup**:  
  A new route (`/api/analytics/replies`) is introduced to accept incoming webhook requests from SendGrid's inbound email parsing service. This service is responsible for processing the parsed email data.

### 3. **Reply Parsing and Storage**
- A route is implemented to parse incoming replies:
  - It identifies the campaign associated with the incoming reply using the `messageId` and `In-Reply-To` headers.
  - The reply’s timestamp and other details are logged in the database for future analytics.

### 4. **Reply Analytics**
- Campaign analytics have been updated to include new metrics such as:
  - **Total `replyCount`**: The number of replies received for a campaign.
  - **`responsePercentage`**: The percentage of replies relative to the number of emails sent, giving insight into the engagement rate.

### 5. **Real-Time Notifications**
- Integrated **Socket.IO** to notify campaign owners in real-time when a reply is received.
- Notifications are sent to the campaign owner's dashboard or notification center as soon as a reply is logged in the system.

---

## **Detailed Description**

### **1. Campaign Schema Enhancements**
- **New Field**: The `campaignId` field is added to the campaign schema to track the source of each email.
- **Unique `reply-to` Address**: Each campaign has a unique `reply-to` email address that is used for receiving replies, ensuring that all replies are routed to the correct campaign.

### **2. Reply Schema**
- **Schema**: A new reply schema stores a unique `messageId` for each email, along with the `campaignId` and `recipientId`. This structure allows for matching incoming replies to their original emails.
  
- **Database Structure**:
  ```javascript
  const replySchema = new mongoose.Schema({
    campaignId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Campaign' // Reference to the Campaign model
    },
    messageId: { 
      type: String, 
      required: true, 
      unique: true // Ensure the messageId is unique for each reply
    },
    recipientId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Recipient', // Reference to the Recipient model
      required: true 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    replyContent: { 
      type: String, 
      required: true 
    },
    inReplyTo: { 
      type: String, 
      required: true 
    }
  });
  ```

### **3. SendGrid Inbound Parsing Setup**
- **Setup**:  
  - SendGrid’s Inbound Parsing service is configured to forward incoming emails to a specific webhook URL. The webhook parses the incoming email and provides a structured payload containing key details, such as the sender's email address, message body, `messageId`, `In-Reply-To` header, and more.
  - The SendGrid webhook is set up to forward emails to a dedicated route (`/api/analytics/replies`).

- **Webhook Route**:  
  A `POST` route is created to handle incoming parsed data from SendGrid.
  
  **Route**: `/api/analytics/replies`  
  **Description**: This route accepts webhook requests from SendGrid, extracts the necessary data (e.g., `messageId`, `In-Reply-To`, reply content), and processes the reply for storage in the database.

  **Request Payload**:
  ```json
  {
    "to": ["replyto+campaign123@yourdomain.com"],
    "from": "recipient@example.com",
    "text": "Reply content here",
    "html": "<p>Reply content here</p>",
    "message_id": "<unique-message-id@example.com>",
    "headers": {
      "In-Reply-To": "<original-message-id@example.com>"
    }
  }
  ```

### **4. How to Send Emails for Reply Parsing**
To ensure replies are matched to the correct campaign and email, the email should include the following fields:

1. **Unique `Message-ID`**: A unique identifier for the email, typically generated by the email service provider. This field is essential for identifying and matching replies.
2. **`In-Reply-To` Header**: This header must contain the `Message-ID` of the original email, linking the reply to the correct email.
3. **Unique `Reply-To` Address**: Each campaign should have a unique `reply-to` address (e.g., `campaign123@yourdomain.com`). This ensures that replies are directed to the correct campaign.

**Example Email Headers**:
```plaintext
From: "Campaign Team" <campaign-team@yourdomain.com>
To: recipient@example.com
Subject: "Special Offer Just for You!"
Message-ID: <unique-message-id-12345@yourdomain.com>
In-Reply-To: <original-message-id-67890@yourdomain.com>
Reply-To: replyto+campaign123@yourdomain.com
Date: Wed, 26 Dec 2024 12:00:00 -0500
```

### **5. Saving Replies in the Database**
When a reply is received via SendGrid's webhook, the `messageId` and `In-Reply-To` headers are used to identify the original email. The reply is then stored in the `Reply` schema in the database.


### **6. Reply Analytics**
- **Analytics Schema**:  
  A new analytics schema is introduced to track the performance of each campaign. This schema stores key metrics such as:
  - **`emailsSent`**: Total number of emails sent in a campaign.
  - **`opens`**: Number of times the emails have been opened.
  - **`openPercentage`**: Percentage of emails opened out of the total emails sent.
  - **`replyCount`**: Total number of replies received.
  - **`responsePercentage`**: Percentage of replies received out of the total emails sent.

- **Schema Example**:
  ```javascript
  const analyticsSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    emailsSent: { type: Number, default: 0 },
    opens: { type: Number, default: 0 },
    openPercentage: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    responsePercentage: { type: Number, default: 0 }
  });
  ```

---

## **Route Overview**

Here are the routes involved in the campaign reply tracking system. Replace with actual routes as necessary:

### **1. Webhook Route (SendGrid)**
- **Method**: `POST`
- **Path**: `/api/analytics/replies`
- **Description**: Accepts webhook requests from SendGrid's inbound email parsing service to process incoming email replies and log them in the database.
- **Request Body**:
  ```json
  {
    "to": ["replyto+campaign123@yourdomain.com"],
    "from": "recipient@example.com",
    "text": "Reply content here",
    "html": "<p>Reply content here</p>",
    "message_id": "<unique-message-id@example.com>",
    "headers": {
      "In-Reply-To": "<original-message-id@example.com>"
    }
  }
  ```

### **2. Campaign

 Analytics Route**
- **Method**: `GET`
- **Path**: `/api/analytics/:campaignId`
- **Description**: Fetches the analytics data for a specific campaign, including metrics like replies, opens, and response percentage.

---

This documentation will help guide your implementation of the email reply tracking and analytics system. You can edit the routes and other specifics as necessary based on your project's actual implementation.

