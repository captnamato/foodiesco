const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Models
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Area = require('../src/models/Area');
const Ingredient = require('../src/models/Ingredient');
const Recipe = require('../src/models/Recipe');
const Testimonial = require('../src/models/Testimonial');

// JSON Data Loading Utilities
const loadJSONData = (filename) => {
  try {
    const filePath = path.join(__dirname, '../foodiesjson', filename);
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return [];
  }
};

// Convert MongoDB ObjectId references and dates
const processObjectIds = (data) => {
  if (Array.isArray(data)) {
    return data.map(processObjectIds);
  } else if (data && typeof data === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === 'object' && value.$oid) {
        // Convert $oid to ObjectId
        processed[key] = new mongoose.Types.ObjectId(value.$oid);
      } else if (value && typeof value === 'object' && value.$date) {
        // Convert $date to JavaScript Date
        if (value.$date.$numberLong) {
          processed[key] = new Date(parseInt(value.$date.$numberLong));
        } else if (typeof value.$date === 'string') {
          processed[key] = new Date(value.$date);
        }
      } else if (key === '_id' && value && typeof value === 'object' && value.$oid) {
        // Handle _id field specifically
        processed[key] = new mongoose.Types.ObjectId(value.$oid);
      } else {
        processed[key] = processObjectIds(value);
      }
    }
    return processed;
  }
  return data;
};

// Clean data for insertion (remove _id for new documents)
const cleanDataForInsertion = (data, preserveIds = false) => {
  return data.map(item => {
    const cleaned = { ...processObjectIds(item) };
    if (!preserveIds) {
      delete cleaned._id; // Let MongoDB generate new IDs
    }
    return cleaned;
  });
};

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Seed data from JSON files
const seedData = async () => {
  try {
    console.log('🚀 Starting database seeding from JSON files...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Area.deleteMany({});
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('   ✅ Existing data cleared\n');

    // Load JSON data files
    console.log('📁 Loading JSON data files...');
    const categoriesData = loadJSONData('categories.json');
    const areasData = loadJSONData('areas.json');
    const ingredientsData = loadJSONData('ingredients.json');
    const usersData = loadJSONData('users.json');
    const recipesData = loadJSONData('recipes.json');
    const testimonialsData = loadJSONData('testimonials.json');

    console.log(`   📊 Loaded data:
    - Categories: ${categoriesData.length}
    - Areas: ${areasData.length}
    - Ingredients: ${ingredientsData.length}
    - Users: ${usersData.length}
    - Recipes: ${recipesData.length}
    - Testimonials: ${testimonialsData.length}\n`);

    // Create Categories
    console.log('🏷️  Creating categories...');
    const cleanCategories = cleanDataForInsertion(categoriesData);
    const categories = await Category.insertMany(cleanCategories);
    console.log(`   ✅ Created ${categories.length} categories\n`);

    // Create Areas
    console.log('🌍 Creating areas...');
    const cleanAreas = cleanDataForInsertion(areasData);
    const areas = await Area.insertMany(cleanAreas);
    console.log(`   ✅ Created ${areas.length} areas\n`);

    // Create Ingredients
    console.log('🥕 Creating ingredients...');
    const cleanIngredients = cleanDataForInsertion(ingredientsData);
    // Insert in batches to avoid memory issues
    const batchSize = 500;
    let totalIngredients = 0;
    for (let i = 0; i < cleanIngredients.length; i += batchSize) {
      const batch = cleanIngredients.slice(i, i + batchSize);
      const insertedBatch = await Ingredient.insertMany(batch);
      totalIngredients += insertedBatch.length;
      console.log(`   📦 Inserted batch: ${totalIngredients}/${cleanIngredients.length} ingredients`);
    }
    console.log(`   ✅ Created ${totalIngredients} ingredients\n`);

    // Process Users (hash passwords)
    console.log('👥 Creating users...');
    const processedUsers = [];
    for (const userData of usersData) {
      const processed = processObjectIds(userData);
      delete processed._id; // Let MongoDB generate new IDs

      // Hash password if it exists, otherwise use default
      if (processed.password) {
        const salt = await bcrypt.genSalt(10);
        processed.password = await bcrypt.hash(processed.password, salt);
      } else {
        // Default password for all users
        const salt = await bcrypt.genSalt(10);
        processed.password = await bcrypt.hash('password123', salt);
      }

      processedUsers.push(processed);
    }
    const users = await User.insertMany(processedUsers);
    console.log(`   ✅ Created ${users.length} users with hashed passwords\n`);

    // Create Testimonials
    console.log('💬 Creating testimonials...');
    const processedTestimonials = testimonialsData.map((item, index) => {
      const processed = processObjectIds(item);
      delete processed._id; // Let MongoDB generate new IDs

      // Map JSON fields to schema fields and assign real users
      const assignedUser = users[index % users.length]; // Cycle through available users
      return {
        text: processed.testimonial, // JSON has 'testimonial', schema expects 'text'
        name: assignedUser ? assignedUser.name : 'Anonymous User', // Use actual user name
        owner: assignedUser ? assignedUser._id : null // Reference to actual user
      };
    });
    const testimonials = await Testimonial.insertMany(processedTestimonials);
    console.log(`   ✅ Created ${testimonials.length} testimonials\n`);

    // Create Recipes (most complex due to relationships)
    console.log('🍳 Creating recipes...');
    console.log('   🔄 Processing recipe relationships...');

    // Create lookup maps for faster reference matching
    const categoryMap = {};
    const areaMap = {};
    const ingredientMap = {};

    categories.forEach(cat => {
      if (cat.name) categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    areas.forEach(area => {
      if (area.name) areaMap[area.name.toLowerCase()] = area._id;
    });

    // For ingredients, we'll match by name since the JSON might have different IDs
    const allIngredients = await Ingredient.find({});
    allIngredients.forEach(ing => {
      if (ing.name) ingredientMap[ing.name.toLowerCase()] = ing._id;
    });

    // Process recipes in batches
    const recipeBatchSize = 100;
    let totalRecipes = 0;
    let processedRecipes = 0;
    let skippedRecipes = 0;

    for (let i = 0; i < recipesData.length; i += recipeBatchSize) {
      const batch = recipesData.slice(i, i + recipeBatchSize);
      const processedBatch = [];

      for (const recipeData of batch) {
        try {
          const processed = processObjectIds(recipeData);
          delete processed._id; // Let MongoDB generate new IDs

          // Map JSON fields to schema fields
          if (processed.thumb) {
            processed.image = processed.thumb;
            delete processed.thumb;
          }

          if (processed.time) {
            processed.cookingTime = parseInt(processed.time);
            delete processed.time;
          }

          // Ensure description exists
          if (!processed.description || processed.description.trim() === '') {
            processed.description = processed.title ?
              `A delicious ${processed.title.toLowerCase()} recipe.` :
              'A delicious recipe.';
          }

          // Assign author (use owner if exists, otherwise random user)
          if (processed.owner && users.length > 0) {
            // Try to find a user, but since we only have 3 users, assign randomly
            processed.author = users[Math.floor(Math.random() * users.length)]._id;
            delete processed.owner;
          } else if (users.length > 0) {
            processed.author = users[Math.floor(Math.random() * users.length)]._id;
          }

          // Handle category reference
          if (processed.category && typeof processed.category === 'string') {
            const categoryId = categoryMap[processed.category.toLowerCase()];
            if (categoryId) {
              processed.category = categoryId;
            } else {
              // Skip recipe if category not found
              console.log(`   ⚠️  Skipping recipe "${processed.title}" - category not found: ${processed.category}`);
              skippedRecipes++;
              continue;
            }
          }

          // Handle area reference
          if (processed.area && typeof processed.area === 'string') {
            const areaId = areaMap[processed.area.toLowerCase()];
            if (areaId) {
              processed.area = areaId;
            } else {
              // Skip recipe if area not found
              console.log(`   ⚠️  Skipping recipe "${processed.title}" - area not found: ${processed.area}`);
              skippedRecipes++;
              continue;
            }
          }

          // Handle ingredients - convert to our flexible format
          if (processed.ingredients && Array.isArray(processed.ingredients)) {
            processed.ingredients = processed.ingredients.map(ing => {
              if (typeof ing === 'string') {
                // Simple ingredient name
                return {
                  ingredient: ing,
                  name: ing,
                  measure: '1 unit' // Default measure
                };
              } else if (ing && ing.id) {
                // JSON format with id and measure
                return {
                  ingredient: ing.id,
                  name: `Ingredient ${ing.id.toString().slice(-6)}`, // Generate name from ID
                  measure: ing.measure || '1 unit'
                };
              } else if (ing && ing.name) {
                // Ingredient object with name
                return {
                  ingredient: ing.name,
                  name: ing.name,
                  measure: ing.measure || ing.quantity || '1 unit'
                };
              } else if (ing && ing.ingredient) {
                // Already in our format
                return {
                  ingredient: ing.ingredient,
                  name: ing.name || ing.ingredient,
                  measure: ing.measure || '1 unit'
                };
              }
              return null;
            }).filter(Boolean); // Remove null entries
          }

          // Add some random favorites for demo
          if (users.length > 0 && Math.random() > 0.7) {
            const numFavorites = Math.floor(Math.random() * 3) + 1;
            processed.favoritedBy = [];
            for (let j = 0; j < numFavorites; j++) {
              const randomUser = users[Math.floor(Math.random() * users.length)];
              if (!processed.favoritedBy.includes(randomUser._id)) {
                processed.favoritedBy.push(randomUser._id);
              }
            }
          }

          processedBatch.push(processed);
          processedRecipes++;
        } catch (error) {
          console.log(`   ⚠️  Error processing recipe: ${error.message}`);
          skippedRecipes++;
        }
      }

      // Insert batch
      if (processedBatch.length > 0) {
        await Recipe.insertMany(processedBatch);
        totalRecipes += processedBatch.length;
        console.log(`   📦 Inserted batch: ${totalRecipes}/${recipesData.length - skippedRecipes} recipes`);
      }
    }

    console.log(`   ✅ Created ${totalRecipes} recipes (${skippedRecipes} skipped due to missing references)\n`);

    // Set up some user relationships
    console.log('🤝 Setting up user relationships...');
    if (users.length >= 4) {
      await User.findByIdAndUpdate(users[0]._id, {
        $push: { following: [users[1]._id, users[2]._id] }
      });
      await User.findByIdAndUpdate(users[1]._id, {
        $push: { followers: users[0]._id, following: users[3]._id }
      });
      await User.findByIdAndUpdate(users[2]._id, {
        $push: { followers: users[0]._id }
      });
      await User.findByIdAndUpdate(users[3]._id, {
        $push: { followers: users[1]._id }
      });
    }
    console.log('   ✅ User relationships configured\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Final Statistics:
├─ Categories: ${categories.length}
├─ Areas: ${areas.length}
├─ Ingredients: ${totalIngredients}
├─ Users: ${users.length}
├─ Recipes: ${totalRecipes} (${skippedRecipes} skipped)
└─ Testimonials: ${testimonials.length}

🔐 Sample login credentials:
${users.slice(0, 4).map(user => `├─ Email: ${user.email} | Password: password123`).join('\n')}

🌐 API ready at: http://localhost:5000/api/health`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
const runSeed = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('\n🔒 Database connection closed');
};

runSeed();