"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingInsightsStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const apigateway = __importStar(require("aws-cdk-lib/aws-apigateway"));
class BankingInsightsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const studentId = '8894858';
        // S3 Bucket
        const transactionBucket = new s3.Bucket(this, `BankingBucket-${studentId}`, {
            bucketName: `banking-insights-bucket-${studentId}`,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
        });
        // DynamoDB Table
        const transactionTable = new dynamodb.Table(this, `TransactionTable-${studentId}`, {
            tableName: `TransactionTable-${studentId}`,
            partitionKey: { name: 'transactionId', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // Lambda
        const processor = new lambda.Function(this, `TransactionProcessor-${studentId}`, {
            functionName: `TransactionProcessor-${studentId}`,
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'processTransactions.handler',
            code: lambda.Code.fromAsset('lambda'),
            timeout: cdk.Duration.seconds(30),
            environment: {
                TABLE_NAME: transactionTable.tableName,
                BUCKET_NAME: transactionBucket.bucketName,
            },
        });
        transactionTable.grantReadWriteData(processor);
        transactionBucket.grantReadWrite(processor);
        // API Gateway (Let CDK handle deploy/stage automatically)
        const api = new apigateway.RestApi(this, `BankingAPI-${studentId}`, {
            restApiName: `Banking Insights API - ${studentId}`,
            description: 'API for Banking Insights Application',
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
            },
            deployOptions: {
                stageName: 'prod',
            }
        });
        const transactions = api.root.addResource('transactions');
        const lambdaIntegration = new apigateway.LambdaIntegration(processor);
        transactions.addMethod('GET', lambdaIntegration);
        transactions.addMethod('POST', lambdaIntegration);
        // Outputs
        new cdk.CfnOutput(this, 'APIEndpoint', {
            value: `${api.url}transactions`,
            description: 'Full URL for transactions endpoint',
        });
        new cdk.CfnOutput(this, 'BucketName', {
            value: transactionBucket.bucketName,
        });
        new cdk.CfnOutput(this, 'TableName', {
            value: transactionTable.tableName,
        });
        new cdk.CfnOutput(this, 'LambdaFunctionName', {
            value: processor.functionName,
        });
    }
}
exports.BankingInsightsStack = BankingInsightsStack;
