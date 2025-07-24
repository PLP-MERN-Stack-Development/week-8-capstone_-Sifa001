// Migration script to update Stage documents to GeoJSON Point structure
const mongoose = require('mongoose');
const Stage = require('./models/Stage');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/matatu-scheduler';

async function migrateStages() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const stages = await Stage.find({});
  let updated = 0;
  for (const stage of stages) {
    // If already migrated, skip
    if (stage.location && stage.location.type === 'Point' && Array.isArray(stage.location.coordinates)) continue;
    // If old structure, migrate
    if (stage.location && typeof stage.location.lat === 'number' && typeof stage.location.lng === 'number') {
      stage.location = {
        type: 'Point',
        coordinates: [stage.location.lng, stage.location.lat]
      };
      await stage.save();
      updated++;
    }
  }
  console.log(`Migration complete. Updated ${updated} stage(s).`);
  await mongoose.disconnect();
}

migrateStages().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 