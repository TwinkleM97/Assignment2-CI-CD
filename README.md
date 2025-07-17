
# Assignment 2 - CI/CD with AWS CDK and CodePipeline  
**Student Name**: Twinkle Mishra  
**Student ID**: 8894858

---

## Objective

This project demonstrates how to provision and deploy a serverless architecture using AWS CDK and automate it using GitHub Actions. Although CodePipeline was the intended CI/CD tool, it could not be used due to account limitations so GitHub Actions was implemented as a working alternative.

---

## Stack Overview

- **Language**: TypeScript (AWS CDK)
- **Infrastructure as Code**: AWS CDK
- **CI/CD**: GitHub Actions
- **Services Used**:
  - AWS Lambda (Node.js)
  - DynamoDB
  - API Gateway
  - S3 (for artifacts)
  - CloudFormation

---

## Application Architecture

A Lambda-based API that allows storing and retrieving transaction data:

- `TransactionProcessor`: Lambda function written in Node.js.
- `TransactionsTable`: DynamoDB table for transaction records.
- `API Gateway`: REST endpoint integrated with Lambda.

---

## Local Development & Deployment

### 1. Prerequisites

- AWS CLI configured with valid credentials
- AWS CDK installed
- Node.js & NPM

### 2. Install dependencies

```bash
npm install -g aws-cdk
npm install
```

### 3. Bootstrap your environment (first-time only)

```bash
cdk bootstrap
```

### 4. Deploy the CDK Stack

```bash
cdk deploy
```

---

## CI/CD via GitHub Actions

Due to AWS account restrictions, we could not activate **CodeBuild** or **CodePipeline**. As a workaround, GitHub Actions was used to automate deployment.

### Secrets Configuration

In GitHub repository:
- Go to **Settings > Secrets and variables > Actions**
- Add the following secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`

### Workflow File

Location: `.github/workflows/deploy.yml`

Main steps:
1. Install dependencies
2. Bootstrap (if needed)
3. Run `cdk deploy`

Workflow is triggered on every push to the `main` branch.

---

## Why AWS CodePipeline Could Not Be Used

Despite being on a verified AWS account with free tier, AWS CodePipeline and CodeBuild could **not be activated** due to the following error:

```
InvalidInputException: Could not retrieve the Payer ID.
Reason: Subscription to CodeBuild, ProductCode CodeBuild, required.
```

A support ticket was opened with AWS (Case ID: `175278241700380`). Until the issue is resolved, GitHub Actions was used as the reliable CI/CD tool.

---

## Successful GitHub Actions Deployment

Sample output:
```
✅ BankingInsightsStack
✅ Deployment time: 37.35s
Outputs:
BankingInsightsStack.Endpoint = https://your-api.execute-api.us-east-1.amazonaws.com/prod/transactions
```

You can test the deployed endpoint using:

```bash
curl -X POST https://your-api.execute-api.us-east-1.amazonaws.com/prod/transactions \
  -H "Content-Type: application/json" \
  -d '{"id": "001", "amount": 100, "type": "deposit"}'
```

---

## GitHub Repo

[View on GitHub](https://github.com/TwinkleM97/Assignment2-CI-CD)

---
