#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BankingInsightsStack } from '../lib/banking-insights-stack';

const app = new cdk.App();
new BankingInsightsStack(app, 'BankingInsightsStack');
