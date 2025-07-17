const { v4: uuidv4 } = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event, context) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  console.log('Environment variables:', {
    TABLE_NAME: process.env.TABLE_NAME,
    BUCKET_NAME: process.env.BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION
  });

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  try {
    // For API Gateway proxy integration, use event.httpMethod
    const method = event.httpMethod || 'GET';
    const body = event.body;
    
    console.log('HTTP Method:', method);
    console.log('Request body:', body);

    // Handle OPTIONS for CORS
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight' })
      };
    }

    // Validate TABLE_NAME
    if (!TABLE_NAME) {
      console.error('TABLE_NAME environment variable is not set');
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'TABLE_NAME not configured'
        })
      };
    }

    if (method === 'POST') {
      console.log('Processing POST request');

      if (!body) {
        console.error('No body in request');
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Request body is required' })
        };
      }

      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
        console.log('Parsed body:', parsedBody);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Invalid JSON in request body' })
        };
      }

      // Validate required fields
      if (!parsedBody.amount || typeof parsedBody.amount !== 'number') {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            error: 'Amount is required and must be a number',
            received: parsedBody
          })
        };
      }

      const transaction = {
        transactionId: uuidv4(),
        timestamp: new Date().toISOString(),
        amount: parsedBody.amount,
        type: parsedBody.type || 'expense',
        category: parsedBody.category || 'misc',
        note: parsedBody.note || '',
        createdBy: 'student-8894858'
      };

      console.log('Transaction to save:', transaction);

      const putCommand = new PutCommand({
        TableName: TABLE_NAME,
        Item: transaction,
      });

      try {
        await dynamodb.send(putCommand);
        console.log('Transaction saved successfully');
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'Transaction created successfully',
            transaction: transaction
          }),
        };
      } catch (dynamoError) {
        console.error('DynamoDB error:', dynamoError);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            error: 'Failed to save transaction',
            details: dynamoError.message
          })
        };
      }
    }

    if (method === 'GET') {
      console.log('Processing GET request');

      const scanCommand = new ScanCommand({ 
        TableName: TABLE_NAME
        // Removed filter for now to simplify debugging
      });

      try {
        const result = await dynamodb.send(scanCommand);
        console.log('Retrieved items:', result.Items?.length || 0);
        
        // Sort by timestamp (newest first)
        const sortedItems = (result.Items || []).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            transactions: sortedItems,
            count: sortedItems.length
          }),
        };
      } catch (dynamoError) {
        console.error('DynamoDB error:', dynamoError);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            error: 'Failed to retrieve transactions',
            details: dynamoError.message
          })
        };
      }
    }

    console.log('Method not allowed:', method);
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};