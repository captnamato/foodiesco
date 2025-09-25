// MongoDB initialization script
db = db.getSiblingDB('foodiesco');

// Create user for the application
db.createUser({
  user: 'foodiesco',
  pwd: 'foodiesco123',
  roles: [
    {
      role: 'readWrite',
      db: 'foodiesco',
    },
  ],
});

// Create initial collections and sample data
db.createCollection('users');
db.createCollection('recipes');
db.createCollection('categories');
db.createCollection('areas');
db.createCollection('ingredients');

// Insert sample categories
db.categories.insertMany([
  { name: 'Italian', description: 'Traditional Italian cuisine' },
  { name: 'Indian', description: 'Spicy and flavorful Indian dishes' },
  { name: 'American', description: 'Classic American comfort food' },
  { name: 'Mexican', description: 'Authentic Mexican flavors' },
  { name: 'Chinese', description: 'Traditional Chinese cooking' }
]);

// Insert sample areas
db.areas.insertMany([
  { name: 'Italy' },
  { name: 'India' },
  { name: 'United States' },
  { name: 'Mexico' },
  { name: 'China' }
]);

// Insert sample ingredients
db.ingredients.insertMany([
  { name: 'Tomatoes', category: 'Vegetables' },
  { name: 'Basil', category: 'Herbs' },
  { name: 'Mozzarella', category: 'Dairy' },
  { name: 'Chicken', category: 'Meat' },
  { name: 'Rice', category: 'Grains' },
  { name: 'Onions', category: 'Vegetables' },
  { name: 'Garlic', category: 'Vegetables' }
]);

print('✅ Database initialized with sample data');