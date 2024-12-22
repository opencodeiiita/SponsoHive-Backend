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
- **Cloud**: Cloudinary

---

## Prerequisites

Ensure the following tools are installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud instance)
- Docker (optional for containerization)
- Set up cloudinary account
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
   CLOUDINARY_CLOUD_NAME=cloud_name
   CLOUDINARY_API_KEY=cloud_api_key
   CLOUDINARY_API_SECRET=cloud_api_secret

4. **Run the Application:**:
   ```bash
   npm run dev

---


##The backend will be available at http://localhost:5000.

---

## Contributions
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add your feature here'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---

## Contact
For questions or feedback, please reach out to:
- **Prinkal Dhingra**
-  **Vansh Dhawan**
- **Anjali Kalwar**  

# Contribution Guidelines

## Claim an Issue
- Comment on the issue to claim it.
- In case of no activity on the issue even after 2 days, the issue will be reassigned.
- If you have difficulty approaching the issue, feel free to ask on our Discord channel.

## Communication
- Whether you are working on a new feature or facing a doubt, please feel free to ask us on our Discord channel.
- We will be happy to help you out.

## Guidelines
### General
- Please help us follow best practices to make it easy for the reviewer as well as the contributor.
- We want to focus on code quality more than on managing pull request (PR) ethics.

### People Before Code
- If any of the following rules are violated, the pull requests must not be rejected. This is to create an easy and joyful onboarding process for new programmers and first-time contributors.

### Pull Request (PR) Guidelines
1. **Single Commit per PR**: Ensure there is a single commit per pull request and name the commit meaningfully. For example: `Adding <your-name> in students/mentors section`.
2. **Reference Issues**: Reference the issue numbers in the commit message if it resolves an open issue. Follow the PR template:
   ```
   Issue: <ISSUE NUMBER>
   ```
4. **Live Preview or Screenshots**: Provide a link to the live GitHub Pages from your forked repository or relevant screenshots for easier review.
5. **Inactive PRs**: Pull requests older than 3 days with no response from the contributor shall be marked closed.
6. **Issue-Linked PRs Only**: Do not make a PR that is not related to any issue. You can create an issue and solve it once approved.
7. **Avoid Duplicate PRs**: If necessary, comment on the older PR with the PR number of the follow-up (new PR) and close the obsolete PR yourself.
8. **Be Polite**: Be polite and respectful to other community members.
---

Thank you for contributing! We look forward to working with you and making this project a success.
