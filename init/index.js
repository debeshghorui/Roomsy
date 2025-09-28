const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/wanderlust";

async function main() {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB successfully");

        // Initialize the database
        await initDB();

        console.log("🎉 Database seeding completed successfully!");

    } catch (err) {
        console.error("❌ Error during database operations:", err.message);
        process.exit(1);
    } finally {
        // Always close the connection
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("🔐 Database connection closed");
        }
    }
}

const initDB = async () => {
    try {
        console.log("🔄 Initializing database...");

        // Check if listings already exist
        const existingCount = await Listing.countDocuments();
        console.log(`Found ${existingCount} existing listings`);

        if (existingCount > 0) {
            console.log("🗑️  Clearing existing data...");
            const deleteResult = await Listing.deleteMany({});
            console.log(`Deleted ${deleteResult.deletedCount} listings`);
        }

        // Validate sample data before insertion
        console.log("📋 Validating sample data...");
        const validData = Data.filter(listing => {
            if (!listing.title || !listing.description || !listing.price || !listing.location || !listing.country) {
                console.warn(`⚠️  Skipping invalid listing: ${listing.title || 'Untitled'}`);
                return false;
            }
            return true;
        });

        console.log(`✅ ${validData.length} valid listings found out of ${Data.length} total`);

        // Insert new data in batches to avoid memory issues
        console.log("📥 Inserting new listings...");
        const batchSize = 10;
        let inserted = 0;

        for (let i = 0; i < validData.length; i += batchSize) {
            const batch = validData.slice(i, i + batchSize);
            try {
                const insertResult = await Listing.insertMany(batch);
                inserted += insertResult.length;
                console.log(`Inserted batch ${Math.ceil((i + 1) / batchSize)}: ${insertResult.length} listings`);
            } catch (batchError) {
                console.error(`❌ Error inserting batch ${Math.ceil((i + 1) / batchSize)}:`, batchError.message);
            }
        }

        console.log(`✅ Successfully inserted ${inserted} listings`);

        // Verify the insertion
        const finalCount = await Listing.countDocuments();
        console.log(`📊 Total listings in database: ${finalCount}`);

    } catch (err) {
        console.error("❌ Error initializing database:", err.message);
        throw err;
    }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Closing database connection...');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Closing database connection...');
    await mongoose.connection.close();
    process.exit(0);
});

// Run the main function
if (require.main === module) {
    main();
}

module.exports = { main, initDB };