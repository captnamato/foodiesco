#!/bin/bash

# Quick MongoDB Setup Script for Foodiesco
echo "🚀 Setting up MongoDB for Foodiesco..."

# Option 1: Use MongoDB Atlas connection string (you need to provide this)
read -p "Do you have a MongoDB Atlas connection string ready? (y/n): " has_atlas

if [ "$has_atlas" = "y" ]; then
    echo "Please enter your MongoDB Atlas connection string:"
    echo "Format: mongodb+srv://username:password@cluster.mongodb.net/foodiesco?retryWrites=true&w=majority"
    read -p "Connection string: " mongo_uri
    
    # Set the MongoDB URI in Railway
    echo "Setting MongoDB URI in Railway..."
    cd /home/andy/projects/foodiesco/foodies-backend
    railway variables --set "MONGODB_URI=$mongo_uri"
    
    # Redeploy backend
    echo "Redeploying backend with new MongoDB connection..."
    railway up
    
    echo "✅ MongoDB setup complete!"
    echo "🔗 Backend URL: https://foodiesco-production.up.railway.app"
    
else
    echo "❌ You need to set up MongoDB Atlas first."
    echo "📖 Please follow the guide in: mongodb-setup-guide.md"
    echo "🌐 Go to: https://www.mongodb.com/atlas"
    echo ""
    echo "After setting up Atlas, run this script again with 'y'"
fi