# Banking Insights CI/CD Pipeline - Assignment 2

**Name:** Twinkle Mishra  
**Student ID:** 8894858  

## Objective

This project demonstrates how to use the AWS Cloud Development Kit (CDK) with AWS CodePipeline to deploy cloud infrastructure following Infrastructure as Code (IaC) principles.

The solution includes:
- An **S3 bucket** to store static artifacts.
- A **Lambda function** for processing transactions.
- A **DynamoDB table** to persist data.
- A **CI/CD pipeline** using CodePipeline with GitHub integration, CodeBuild, and CloudFormation deployment.

---

## 🛠 Project Structure

```bash
BANKING-INSIGHTS-A2/
│
├── lambda/                      # Lambda function code
│   └── processTransactions.js
│
├── lib/
│   └── banking-insights-stack.ts  # CDK Stack Definition
│
├── screenshots/                # Screenshots for documentation
│
├── buildspec.yml               # CodeBuild configuration
├── README.md                   # Project documentation
├── test_api.sh                 # Script to test deployed API
└── debug.sh                    # Helper for local testing
```

---

## Resources Created

### CDK Bootstrap
CDK environment initialized using `cdk bootstrap`.

![cdk-bootstrap](screenshots/cdk-bootstrap.png)

### CDK Synth Output
Synthesized CloudFormation templates using `cdk synth`.

![cdk-synth](screenshots/cdk-synth.png)

### CDK Deploy Success
Stack deployed using `cdk deploy`.

![cdk_deploy_success](screenshots/cdk_deploy_success.png)

### S3 Bucket Created
An S3 bucket for storing data was created.

![cdk_s3_bucket_created](screenshots/cdk_s3_bucket_created.png)

### Lambda Function Created
The transaction processing Lambda function was created.

![cdk_lambda_created](screenshots/cdk_lambda_created.png)

### DynamoDB Table Created
A DynamoDB table was provisioned for storing transaction data.

![cdk_dynamodb_table_created](screenshots/cdk_dynamodb_table_created.png)

---

## CI/CD Pipeline

### Pipeline Execution (Source → Build → Deploy)
AWS CodePipeline successfully pulled from GitHub, built via CodeBuild, and deployed using CloudFormation.

![pipeline-success](screenshots/pipeline-success.png)
![execution](screenshots/execution.png)

---

## API Gateway Testing

### POST Transaction to API
Tested POST API using Postman or curl.

![post-api-tested](screenshots/post-api-tested.png)

### GET Transactions from API
Validated GET endpoint response.

![get-api-tested](screenshots/get-api-tested.png)

---

## Manual Testing with Script
Executed `test_api.sh` to automate testing of the `/transactions` endpoint.

![testing_api](screenshots/testing_api.png)

---

## Architecture Diagram
Visual overview of deployed infrastructure.

![lambda_diagram](screenshots/lambda_diagram.png)

---

## Summary

- Developed CDK project in TypeScript to provision S3, Lambda, and DynamoDB.
- Bootstrapped and deployed infrastructure using `cdk deploy`.
- Integrated GitHub repo with CodePipeline.
- Defined build process using `buildspec.yml`.
- Validated endpoints manually and via shell scripts.
- Documented using screenshots for evaluation.

---
