### Roles and Permissions in the Platform

#### 1. **Overview**
The platform uses a **Role-Based Access Control (RBAC)** model to assign permissions to users based on their roles. Roles define what actions a user can perform, ensuring that only authorized individuals can access specific resources or perform sensitive operations.

#### 2. **Roles Defined**
The platform supports the following primary roles:

- **Admin**: 
  - Has full access to all resources and actions within the platform.
  - Can manage users, assign roles, create and schedule campaigns, and perform all administrative functions.
  
- **Manager**:
  - Has access to campaign-related resources and user management, but with limited access compared to Admin.
  - Cannot manage system-wide settings or modify other user roles.
  
- **Contributor**:
  - Has restricted access to specific resources, typically allowing them to create or edit content (e.g., campaigns).
  - Cannot manage users or access sensitive system-wide settings.

#### 3. **Assigning Roles**
Roles are assigned to users at the time of registration or by an **Admin** through the platform's user management interface or API. Roles can be assigned based on the user’s job function or the level of access they need. 

- **Assigning Roles in the User Model**: 
  When creating a user, the system will assign a default role (e.g., `Contributor`). An Admin can modify the role later through an admin interface or by directly editing the user record in the database.

#### 4. **Role Verification in the Middleware**
The platform uses **middleware** to verify the roles before granting access to protected routes. Each route or action has a specific set of roles that are permitted to access it. 

- **`authMiddleware`**: Verifies that the user is authenticated, ensuring the user has a valid JWT token.
- **`roleMiddleware`**: Checks if the user has the appropriate role (Admin, Manager, Contributor) to perform an action. The roles are checked against the user's assigned roles.

Example:
```javascript
router.post('/schedule', authMiddleware, roleMiddleware(['Admin']), scheduleCampaign);
```
In the example above, the user must be authenticated (`authMiddleware`) and have the `Admin` role (`roleMiddleware(['Admin'])`) to access the `/schedule` route and schedule a campaign.

#### 5. **How Roles Are Used**
- **Protecting Sensitive Routes**: Routes that perform sensitive operations, such as user management or campaign scheduling, are protected by role checks. 
- **Role-based Resource Access**: Different roles have access to specific resources, ensuring that users only interact with the parts of the system they are authorized for.

#### 6. **Role Hierarchy and Inheritance**
- The platform assumes a **flat role hierarchy**, meaning there’s no automatic inheritance. For example, a `Manager` role does not automatically inherit the permissions of an `Admin`. Each role must be explicitly defined with the specific permissions it can access.

#### 7. **Modifying Roles**
Admins can modify user roles as necessary, either through the admin interface or by directly editing the user data. For security, it's crucial that only Admins can change user roles to prevent unauthorized access.

#### 8. **Logging and Auditing Role Changes**
It is good practice to log any changes made to user roles, ensuring transparency and auditability of administrative actions. The system should include a log of who changed a user's role and when.
