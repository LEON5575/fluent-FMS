#!/bin/bash


# Safety check: Only run if the current folder is correctt
if [[ "$(pwd)" != "/var/www/html/app/test/nipralo_form/backend" ]]; then
  echo "Error: You are not in the correct backend directory!"
  exit 1
fi


echo "Discarding local changes..."
# Discard any local changes and reset to the latest commit from the remoteee
git reset --hard
git clean -fd


echo "Starting backend deployment..."


# Pull the latest changes
git pull origin main


# Install dependencies (if "backend-deploy-npm-install" is in the commit message)
if echo "${{ github.event.head_commit.message }}" | grep -q "backend-deploy-npm-install"; then
  echo "Installing dependencies..."
  npm install
fi


# Build the Strapi app
echo "Building the Strapi app..."
npm run build


# (Optional) Restart PM2 or your backend server if using pm2
echo "Restarting PM2 for the backend..."
pm2 restart nipraloForm_backend  # Ensure that the process name is correct


echo "Backend deployment finished."
