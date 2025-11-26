#!/bin/bash

set -e

FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:-moto-test}"

echo "🔨 Building application..."
npm run build

echo "📦 Creating deployment package..."
rm -f lambda.zip

echo "📦 Adding compiled code..."
cd dist
zip -r ../lambda.zip .
cd ..

echo "📦 Adding node_modules..."
zip -r lambda.zip node_modules

echo "📦 Adding package.json..."
zip lambda.zip package.json

echo "✅ Deployment package created: lambda.zip"
echo ""
echo "📤 Deploying to AWS Lambda function: $FUNCTION_NAME"

aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://lambda.zip

echo ""
echo "✅ Deployment completed!"
echo ""
echo "To change the function name, set LAMBDA_FUNCTION_NAME environment variable:"
echo "  LAMBDA_FUNCTION_NAME=my-function ./deploy.sh"
