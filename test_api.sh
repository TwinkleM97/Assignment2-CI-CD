#!/bin/bash

# Banking Insights API Testing Script
API_URL="https://iin7y2kmuk.execute-api.us-east-1.amazonaws.com/prod/transactions"

echo "=== Testing Banking Insights API ==="
echo "API URL: $API_URL"
echo

# Test 1: GET request (should return all existing transactions)
echo "1. Testing GET request..."
curl -X GET "$API_URL" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"
echo "---"

# Test 2: POST request to create a new transaction
echo "2. Testing POST request..."
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 75.25,
    "type": "expense",
    "category": "transportation",
    "note": "Uber ride to college"
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo "---"

# Test 3: GET again to confirm insert
echo "3. Testing GET request again..."
curl -X GET "$API_URL" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n"
echo "---"

echo "=== Testing Complete ==="
