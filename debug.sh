#!/bin/bash

# Debug script to check API Gateway configuration
API_URL="https://5l72qvmkhi.execute-api.us-east-1.amazonaws.com/prod/transactions"
API_BASE="https://5l72qvmkhi.execute-api.us-east-1.amazonaws.com/prod"

echo "=== API Gateway Debug Script ==="
echo "API Base URL: $API_BASE"
echo "API Full URL: $API_URL"
echo

# Test 1: Check if base API responds
echo "1. Testing base API URL..."
curl -X GET "$API_BASE" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s -o /dev/null -v 2>&1 | head -20
echo
echo "---"

# Test 2: Check transactions endpoint
echo "2. Testing transactions endpoint..."
curl -X GET "$API_URL" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s -v 2>&1 | head -20
echo
echo "---"

# Test 3: Check with different headers
echo "3. Testing with explicit headers..."
curl -X GET "$API_URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n" \
  -i
echo
echo "---"

# Test 4: Try POST request
echo "4. Testing POST request..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50.75, "type": "expense", "category": "test", "note": "Debug test"}' \
  -w "\nHTTP Status: %{http_code}\n\n" \
  -i
echo
echo "---"

# Test 5: Check OPTIONS (CORS)
echo "5. Testing OPTIONS request..."
curl -X OPTIONS "$API_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -w "\nHTTP Status: %{http_code}\n\n" \
  -i
echo

echo "=== Debug Complete ==="