#!/bin/bash

echo "🚀 MongoDB Atlas Setup for Foodiesco"
echo "===================================="
echo ""

# Function to validate MongoDB connection string
validate_mongo_uri() {
    if [[ $1 =~ ^mongodb\+srv:// ]]; then
        return 0
    else
        return 1
    fi
}

# Function to test connection
test_connection() {
    echo "Testing MongoDB connection..."
    node -e "
    const mongoose = require('mongoose');
    mongoose.connect('$1')
        .then(() => {
            console.log('✅ MongoDB connection successful!');
            mongoose.disconnect();
        })
        .catch(err => {
            console.log('❌ MongoDB connection failed:', err.message);
            mongoose.disconnect();
        });
    "
}

echo "Please follow these steps to set up MongoDB Atlas:"
echo ""
echo "1. Go to: https://www.mongodb.com/atlas"
echo "2. Create a free account (if you don't have one)"
echo "3. Create a new cluster (choose M0 FREE tier)"
echo "4. Create a database user"
echo "5. Add your IP to the whitelist (or allow 0.0.0.0/0 for Railway)"
echo "6. Get your connection string"
echo ""
echo "Your connection string should look like:"
echo "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/foodiesco?retryWrites=true&w=majority"
echo ""

read -p "Do you have your MongoDB Atlas connection string ready? (y/n): " has_connection

if [ "$has_connection" = "y" ]; then
    echo ""
    read -p "Please paste your MongoDB connection string: " mongo_uri
    
    if validate_mongo_uri "$mongo_uri"; then
        echo ""
        echo "📝 Setting up MongoDB connection..."
        
        # Test connection first
        test_connection "$mongo_uri"
        
        echo ""
        read -p "Connection test complete. Continue with Railway setup? (y/n): " continue_setup
        
        if [ "$continue_setup" = "y" ]; then
            echo ""
            echo "🚂 Setting MongoDB URI in Railway..."
            railway variables --set "MONGODB_URI=$mongo_uri"
            
            echo "🚀 Deploying backend with MongoDB..."
            railway up --detach
            
            echo ""
            echo "✅ Setup complete!"
            echo ""
            echo "🔗 Your backend URL: https://foodiesco-production.up.railway.app"
            echo "🔍 Health check: https://foodiesco-production.up.railway.app/api/health"
            echo ""
            echo "You can check the logs with:"
            echo "railway logs"
        else
            echo "Setup cancelled."
        fi
    else
        echo "❌ Invalid MongoDB connection string format."
        echo "Please make sure it starts with 'mongodb+srv://'"
    fi
else
    echo ""
    echo "❌ Please set up MongoDB Atlas first:"
    echo ""
    echo "📋 Quick Setup Steps:"
    echo "1. Go to https://www.mongodb.com/atlas"
    echo "2. Sign up (free)"
    echo "3. Create cluster (M0 FREE)"
    echo "4. Create database user"
    echo "5. Add IP: 0.0.0.0/0 (for Railway access)"
    echo "6. Get connection string"
    echo "7. Run this script again"
    echo ""
    echo "📖 Detailed guide: mongodb-setup-guide.md"
fi