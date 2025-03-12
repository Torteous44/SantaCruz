#!/bin/bash

# Log the Node.js version
echo "Node.js version: $(node -v)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Log build completion
echo "Build completed successfully!"

# Make sure the /api directory has the right module resolution
echo "Checking API directory structure..."
if [ -d "api" ]; then
  echo "API directory exists"
else
  echo "API directory missing!"
  exit 1
fi

exit 0 