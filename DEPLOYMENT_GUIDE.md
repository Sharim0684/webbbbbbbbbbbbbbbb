# AWS Deployment Guide for Facebook Posting Application

## Prerequisites

1. AWS Account with necessary permissions
2. Facebook Developer Account
3. Facebook App created and configured
4. Node.js and npm installed
5. Python 3.9+ installed

## Required Environment Variables

### Frontend (.env file)
```
REACT_APP_API_URL=https://your-aws-domain/api
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

### Backend (AWS Secrets Manager)
```
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
```

## Facebook App Configuration

1. Go to Facebook Developer Console
2. Add your AWS domain to App Domains
3. Add these URLs to Valid OAuth Redirect URIs:
   - https://your-aws-domain/facebook-callback
   - https://your-aws-domain/accounts/facebook/login/
4. Ensure the Facebook App is in Live mode
5. Note down your Facebook App ID and App Secret

## Deployment Steps

1. Create AWS EC2 instance with Ubuntu
2. Install Node.js and npm
3. Install Python 3.9+
4. Install Docker and Docker Compose
5. Clone the repository
6. Configure environment variables
7. Run `docker-compose up -d`

## Security Considerations

1. Never expose Facebook credentials in code
2. Use AWS Secrets Manager for sensitive data
3. Implement rate limiting for Facebook API calls
4. Use HTTPS for all API communications

## Troubleshooting

1. Facebook Authentication Issues:
   - Check Facebook App configuration
   - Verify redirect URIs
   - Check access token validity

2. API Connection Issues:
   - Verify API URLs in code
   - Check CORS configuration
   - Verify security headers

## Post-Deployment Tasks

1. Monitor Facebook API usage
2. Set up error logging
3. Implement backup strategy
4. Set up monitoring and alerts
