## SponsoHive HubSpot Integration

This Node.js application facilitates secure and robust integration between SponsoHive and HubSpot, enabling seamless management of contacts across both platforms.

### Features

* **OAuth Authentication:** Establishes a secure connection between SponsoHive accounts and HubSpot using OAuth for user authentication.
* **Token Management:** Implements a robust token schema to store and manage HubSpot access tokens securely, ensuring authorized API calls.
* **Contact List Fetching:** Provides an API endpoint to retrieve contact lists from HubSpot, allowing SponsoHive to access existing contacts.
* **Contact Syncing:** Synchronizes newly created contacts from SponsoHive to HubSpot, maintaining data consistency.
* **Bidirectional Updates:** Enables two-way updates of contact information, ensuring any changes made in either platform are reflected on the other.
* **Scalable Integration:** Tested with diverse HubSpot account types and data sizes for reliable operation across different environments.
* **Comprehensive Error Handling:** Provides informative error messages to assist with troubleshooting connection issues and API failures.

### Installation and Setup

1. **Prerequisites:**
   - Node.js and npm (or yarn) installed on your system.
   - A HubSpot developer account ([https://developers.hubspot.com/](https://developers.hubspot.com/)).
   - A SponsoHive account.

2. **Project Setup:**
   - Clone this repository or create a new Node.js project directory.
   - Run `npm install` (or `yarn install`) to install required dependencies.

3. **HubSpot App Creation:**
   - Log in to your HubSpot developer account.
   - Create a new app ([invalid URL removed]).
   - Select "OAuth" as the authorization type and provide the following redirect URI:
     ```
     http://localhost:5000/oauth/authorize  // Replace with your server's URL if applicable
     ```
   - Note down the **Client ID** and **Client Secret**. You'll need them later.

4. **Environment Variables:**
   - Create a `.env` file in your project's root directory.
   - Add the following environment variables, replacing placeholders with your actual values:

     ```
     HUBSPOT_CLIENT_ID=YOUR_HUBSPOT_CLIENT_ID
     HUBSPOT_CLIENT_SECRET=YOUR_HUBSPOT_CLIENT_SECRET
     HUBSPOT_REDIRECT_URI=http://localhost:3000/authorize  // Replace if needed
     # Optional (for database storage of tokens)
     DATABASE_URL=YOUR_DATABASE_URL
     ```

### Usage

1. **Start the Server:**
   - Run `node server.js` (or your server startup script) to start the Node.js application.

2. **Initiate OAuth Flow:**
   - Visit `http://localhost:5000/oauth/authenticate` in your browser. This triggers the HubSpot OAuth flow.
   - Grant necessary permissions to SponsoHive within HubSpot.
   - Once authorized, you'll be redirected back to your application.

### API Routes

**Note:** All API routes require an access token to be fetched first using the `fetchAccessToken` middleware.

* **GET /authenticate** - Initiates the HubSpot OAuth flow.
* **GET /authorize** - Handles the OAuth redirect and obtains access tokens.
* **GET /contact-lists** (with `fetchAccessToken` middleware) - Retrieves contact lists from HubSpot.
* **POST /sync-new-contact** (with `fetchAccessToken` middleware) - Synchronizes newly created contacts from SponsoHive to HubSpot.
* **POST /update-contact** (with `fetchAccessToken` middleware) - Updates contact information bidirectionally between SponsoHive and HubSpot.
* **GET /test-integration** (with `fetchAccessToken` middleware) - Tests the integration with various HubSpot account types and data sizes.

**Parameters:**

- **userid** (in request body): User ID for authorization purposes to fetch access tokens.