# SponsoHive Backend

SponsoHive is a platform designed to streamline the process of seeking sponsorships for events by providing efficient tools to manage email campaigns, track engagement, and enhance collaboration among teams. This repository contains the backend services powering SponsoHive.

---

## Features

### Core Functionalities:
- **Email List Management**:
  - Bulk upload of email lists via CSV/Excel.
  - Categorization of contacts by industry or priority.
  - Detection of duplicate and invalid emails.
- **Email Campaign Automation**:
  - Create and manage personalized email templates.
  - Schedule automated email campaigns and follow-up sequences.
- **Personalization**:
  - Use dynamic placeholders in email templates for a personalized experience.
  - Add attachments like PDFs or brochures to campaigns.
- **Analytics**:
  - Track email open rates, click-through rates, and responses.
  - Manage bounces and unsubscribes automatically.
- **Integration**:
  - Connect with CRMs like HubSpot and Salesforce.
  - Enable social media research for enhanced outreach.
- **Collaboration Tools**:
  - Multi-user access for sponsorship management teams.
  - Assign tasks and follow up on specific contacts.
- **Compliance**:
  - Fully GDPR and CAN-SPAM compliant with opt-out options and sender verification.
- **Templates and Insights**:
  - Pre-designed email templates for sponsorship requests.
  - Insights on the best time to send emails and strategies to improve engagement.

---

## Tech Stack

- **Programming Language**: JavaScript/TypeScript
- **Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Real-time Features**: Socket.IO
- **Email Services**: Nodemailer, SendGrid
- **Deployment**: Docker, Railway

---

## Prerequisites

Ensure the following tools are installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud instance)
- Docker (optional for containerization)

---

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/sponsohive-backend.git
   cd sponsohive-backend
2. **Install Dependencies:**:
 ```bash
   npm install
3. **Set Up Environment Variables: Create a .env file in the root directory and configure the following:**:
 ```bash
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/sponsohive
JWT_SECRET=your_jwt_secret
EMAIL_API_KEY=your_email_service_api_key
4. **Run the Application:**:
 ```bash
npm run dev

---


The backend will be available at http://localhost:5000.
