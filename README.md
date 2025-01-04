# SoftHub Web Application

<a href="https://main.duvnntlhsen54.amplifyapp.com/">Link to Deployed Service</a>
<p></p>
<a href="https://balajiravindaran.atlassian.net/jira/software/projects/CSD/boards/9">Link to Jira Project</a>

## Project Overview

This is a **software-buying web application** built with React, hosted on AWS. The app allows consumers to browse, purchase, and download software. Providers can manage software listings, and admins can monitor website performance and analytics. The platform includes AI-powered product recommendations and sentiment analysis of reviews to enhance user experience.

## Features

### User Roles:
- **Consumer**: Can browse and purchase software, receiving product download links and license keys via email after purchase.
- **Provider**: Can manage product listings (add, update, suspend) and track software performance.
- **Admin**: Can view website analytics, user activity, and monitor overall performance.

### AI Models:
- **Product Recommendation**: Provides personalized software suggestions based on consumer activity.
- **Review Sentiment Analysis**: Analyzes customer reviews and assigns sentiment scores.

### Key Functionalities:
- Secure online payments for purchasing software.
- Automatic email delivery of download links and license keys.
- AI-driven product recommendations and review sentiment insights.
- Real-time product management for providers.
- Comprehensive analytics for admins.

## Tech Stack

### Frontend
- **React**: The web app frontend.
- **AWS Amplify**: Used for hosting the frontend and backend integration.

### Backend
- **AWS Lambda**: Handles serverless backend functions for core business logic.
- **Amazon API Gateway**: Exposes API endpoints for the frontend.
- **Amazon Cognito**: Provides authentication and authorization for Consumers, Providers, and Admins.
- **Amazon DynamoDB**: A NoSQL database for storing product information, user data, and purchase history.

### AI Models
- **Amazon SageMaker**: Hosts and serves machine learning models for product recommendations and sentiment analysis.

### Payment
- **Amazon Pay** or **Stripe**: Manages secure online payments.

### Storage & Download
- **Amazon S3**: Stores downloadable software and delivers download links.

### Notifications
- **Amazon SES**: Sends automated emails with software download links and license keys to consumers post-purchase.

### Monitoring & Analytics
- **Amazon CloudWatch**: Monitors application health and logs errors.
- **Amazon QuickSight**: Provides the Admin with dashboards and analytics on sales and website performance.

### Security
- **AWS WAF**: Protects the application from common web threats.
- **AWS Shield**: Provides DDoS protection.

## AWS Services Breakdown

- **Frontend Hosting**: AWS Amplify
- **Authentication & Authorization**: Amazon Cognito
- **Backend Logic**: AWS Lambda
- **API Management**: Amazon API Gateway
- **Database**: Amazon DynamoDB
- **AI Model Hosting**: Amazon SageMaker
- **Email Notifications**: Amazon SES
- **Payment Integration**: Amazon Pay or Stripe
- **File Storage**: Amazon S3
- **Monitoring**: Amazon CloudWatch
- **Analytics**: Amazon QuickSight
- **Web Security**: AWS WAF, AWS Shield

## Setup & Deployment

### Prerequisites
- AWS account.
- Node.js and npm installed locally.
- React environment set up.

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>

2. **Install dependencies:**:
   ```bash
   npm install

3. **Set up AWS Amplify**:
   **Install AWS Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
  
 4. **Initialize the project**:
    ```bash
    amplify init
    amplify add auth
    amplify push

 5. **Deploy the Frontend**:
    ```bash
    amplify add hosting
    amplify publish
    
 6. **Configure API Gateway and Lambda**:
    ```bash
    - Use AWS Lambda and API Gateway to deploy backend logic.
    - Set up DynamoDB, SES, SageMaker models, and other AWS services via AWS Console.

 7. **Add Payment Integration**:
    ```bash
    - Integrate Amazon Pay or Stripe into the backend for processing payments.
