import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/secure-auth-system',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret',
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || '30d',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'your_email_service',
    EMAIL_USER: process.env.EMAIL_USER || 'your_email@example.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'your_email_password',
    OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID || 'your_google_client_id',
    OAUTH_GOOGLE_CLIENT_SECRET: process.env.OAUTH_GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
    OAUTH_FACEBOOK_APP_ID: process.env.OAUTH_FACEBOOK_APP_ID || 'your_facebook_app_id',
    OAUTH_FACEBOOK_APP_SECRET: process.env.OAUTH_FACEBOOK_APP_SECRET || 'your_facebook_app_secret',
};

export default config;