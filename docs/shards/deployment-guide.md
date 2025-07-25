# Deployment Guide - AWS + Supabase

## Deployment Architecture Overview

**Platform:** AWS + Supabase Hybrid Approach
**Strategy:** Jamstack with serverless backend functions

### Infrastructure Components

- **Frontend:** S3 + CloudFront (Static hosting with CDN)
- **Backend:** AWS Lambda + API Gateway (Serverless functions)
- **Database:** Supabase PostgreSQL (Managed database)
- **DNS:** Route 53 (Domain management)
- **SSL:** Certificate Manager (HTTPS certificates)

## AWS Services Configuration

### S3 Static Website Hosting

#### Bucket Configuration
```bash
# Create S3 bucket for frontend hosting
aws s3 mb s3://zodiac-predictor-frontend --region us-east-1

# Configure bucket for static website hosting
aws s3 website s3://zodiac-predictor-frontend \
    --index-document index.html \
    --error-document error.html
```

#### Bucket Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::zodiac-predictor-frontend/*"
        }
    ]
}
```

### CloudFront CDN Distribution

#### Distribution Configuration
```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**
```json
{
    "CallerReference": "zodiac-predictor-2024",
    "Comment": "Zodiac Predictor CDN Distribution",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-zodiac-predictor-frontend",
                "DomainName": "zodiac-predictor-frontend.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-zodiac-predictor-frontend",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        }
    }
}
```

### Lambda Functions Deployment

#### Function Structure
```
lambda-functions/
├── create-session/
│   ├── index.js
│   └── package.json
├── get-questions/
│   ├── index.js
│   └── package.json
├── submit-response/
│   ├── index.js
│   └── package.json
└── calculate-zodiac/
    ├── index.js
    └── package.json
```

#### Deployment Script
```bash
#!/bin/bash
# deploy-lambda.sh

# Build and deploy each Lambda function
for function in create-session get-questions submit-response calculate-zodiac; do
    cd lambda-functions/$function
    npm install
    zip -r ../../../$function.zip .
    cd ../../..
    
    aws lambda create-function \
        --function-name zodiac-$function \
        --runtime nodejs20.x \
        --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
        --handler index.handler \
        --zip-file fileb://$function.zip
done
```

### API Gateway Configuration

#### REST API Setup
```bash
# Create REST API
aws apigateway create-rest-api --name "zodiac-predictor-api"

# Create resources and methods
aws apigateway create-resource \
    --rest-api-id API_ID \
    --parent-id ROOT_RESOURCE_ID \
    --path-part "sessions"

# Configure CORS
aws apigateway put-method \
    --rest-api-id API_ID \
    --resource-id RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE
```

## Supabase Configuration

### Database Setup

#### Environment Variables
```bash
# Production Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anonymous-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

#### Connection Configuration
```javascript
// supabase-client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Database Migration Deployment

#### Migration Script
```bash
#!/bin/bash
# deploy-database.sh

# Run migrations on production Supabase
npx supabase migration up --db-url "$DATABASE_URL"

# Seed production data
npx supabase seed --db-url "$DATABASE_URL"
```

## Deployment Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build frontend
      run: npm run build:web
      
    - name: Deploy to S3
      run: aws s3 sync apps/web/dist s3://zodiac-predictor-frontend --delete
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        
    - name: Invalidate CloudFront
      run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
      
    - name: Deploy Lambda functions
      run: ./scripts/deploy-lambda.sh
```

### Environment Management

#### Production Environment Variables
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
DATABASE_URL=postgresql://postgres:[password]@db.supabase.co:5432/postgres

# Application Configuration
NODE_ENV=production
API_BASE_URL=https://api.zodiac-predictor.com
```

#### Secrets Management
- Use AWS Secrets Manager for sensitive configuration
- Store database credentials securely
- Rotate API keys regularly
- Use IAM roles for service-to-service authentication

## Domain Configuration

### Route 53 DNS Setup

#### Hosted Zone Configuration
```bash
# Create hosted zone
aws route53 create-hosted-zone --name zodiac-predictor.com --caller-reference 2024-setup

# Create A record for root domain
aws route53 change-resource-record-sets \
    --hosted-zone-id ZONE_ID \
    --change-batch file://dns-records.json
```

### SSL Certificate

#### Certificate Manager Setup
```bash
# Request SSL certificate
aws acm request-certificate \
    --domain-name zodiac-predictor.com \
    --subject-alternative-names www.zodiac-predictor.com \
    --validation-method DNS
```

## Monitoring and Logging

### CloudWatch Configuration

#### Metrics and Alarms
```bash
# Create CloudWatch alarm for Lambda errors
aws cloudwatch put-metric-alarm \
    --alarm-name "zodiac-lambda-errors" \
    --alarm-description "Monitor Lambda function errors" \
    --metric-name Errors \
    --namespace AWS/Lambda \
    --statistic Sum \
    --period 300 \
    --threshold 5 \
    --comparison-operator GreaterThanThreshold
```

### Performance Monitoring

#### Key Metrics to Track
- **Frontend Metrics:** Core Web Vitals, page load times, bounce rate
- **Backend Metrics:** API response times, error rates, Lambda duration
- **Database Metrics:** Query performance, connection pool usage
- **User Metrics:** Survey completion rates, session duration

## Cost Optimization

### AWS Free Tier Usage

#### Resource Limits
- **S3:** 5GB storage, 20,000 GET requests
- **CloudFront:** 50GB data transfer, 2,000,000 HTTP requests
- **Lambda:** 1M requests, 400,000 GB-seconds compute time
- **API Gateway:** 1M API calls per month

#### Cost Monitoring
```bash
# Set up billing alerts
aws budgets create-budget \
    --account-id 123456789012 \
    --budget file://budget-config.json
```

## Security Considerations

### Infrastructure Security
- Enable AWS CloudTrail for audit logging
- Configure IAM roles with least privilege access
- Use VPC endpoints for private service communication
- Enable AWS GuardDuty for threat detection

### Application Security
- Implement rate limiting on API endpoints
- Validate all user inputs
- Use HTTPS everywhere
- Sanitize database queries to prevent SQL injection

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] SSL certificates validated
- [ ] DNS records configured
- [ ] Monitoring alerts set up

### Post-deployment
- [ ] Smoke tests passing
- [ ] Performance benchmarks met
- [ ] Error tracking functional
- [ ] Backup strategy verified
- [ ] Documentation updated