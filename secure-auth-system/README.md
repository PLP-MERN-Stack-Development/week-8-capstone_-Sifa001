# Secure Authentication System

This project implements a secure authentication system for dashboards using various modern techniques and best practices. It includes features such as JWT-based authentication, role-based access control, password encryption, email verification, two-factor authentication, and more.

## Features

- **JWT-based Authentication**: Utilizes JSON Web Tokens for secure user authentication.
- **Refresh Tokens**: Implements refresh tokens to maintain user sessions securely.
- **Role-based Access Control**: Supports different user roles (passenger, driver, admin) to manage access to resources.
- **Password Encryption**: Uses bcrypt for secure password hashing and storage.
- **Email Verification**: New accounts require email verification to enhance security.
- **Two-Factor Authentication**: Admin accounts can enable two-factor authentication for added security.
- **Session Management**: Automatically logs out users after a period of inactivity.
- **OAuth Integration**: Allows users to log in using Google or Facebook accounts.
- **Account Recovery**: Provides mechanisms for password reset and account recovery.
- **Rate Limiting**: Implements rate limiting on API endpoints to prevent abuse.
- **Input Sanitization and Validation**: Ensures all user inputs are sanitized and validated to prevent security vulnerabilities.

## Project Structure

```
secure-auth-system
├── src
│   ├── app.ts
│   ├── config
│   │   └── index.ts
│   ├── controllers
│   │   └── authController.ts
│   ├── middlewares
│   │   ├── authMiddleware.ts
│   │   ├── roleMiddleware.ts
│   │   ├── rateLimitMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── models
│   │   └── userModel.ts
│   ├── routes
│   │   └── authRoutes.ts
│   ├── services
│   │   ├── authService.ts
│   │   ├── emailService.ts
│   │   ├── oauthService.ts
│   │   └── tokenService.ts
│   ├── utils
│   │   ├── bcryptUtil.ts
│   │   ├── jwtUtil.ts
│   │   └── passwordPolicy.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd secure-auth-system
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```
2. Access the API documentation for available endpoints and usage instructions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.