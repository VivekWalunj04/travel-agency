/**
 * Seed script — run with: node seed.js
 * Creates sample admin, user, and travel packages
 */
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const User     = require('./models/User');
const Package  = require('./models/Package');

dotenv.config();

const packages = [
  {
    title: 'Magical Bali Getaway',
    description: 'Immerse yourself in the spiritual heart of Bali. Explore ancient temples, lush rice terraces, and pristine beaches. Enjoy traditional Balinese dance performances and rejuvenating spa treatments.',
    price: 1299,
    duration: '7 Days / 6 Nights',
    location: 'Bali, Indonesia',
    country: 'Indonesia',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    category: 'Beach',
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 142,
    maxGroupSize: 12,
    highlights: ['Tanah Lot Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Seminyak Beach', 'Traditional Cooking Class'],
    included: ['Accommodation', 'Daily breakfast', 'Airport transfers', 'Temple visits', 'English-speaking guide'],
    notIncluded: ['International flights', 'Travel insurance', 'Personal expenses', 'Lunch & dinner'],
  },
  {
    title: 'Swiss Alps Adventure',
    description: 'Challenge yourself in the majestic Swiss Alps. Hike through breathtaking mountain passes, ski on world-class slopes, and stay in charming alpine chalets. Experience Swiss culture and cuisine at its finest.',
    price: 2899,
    duration: '10 Days / 9 Nights',
    location: 'Interlaken, Switzerland',
    country: 'Switzerland',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    category: 'Mountain',
    difficulty: 'Hard',
    rating: 4.9,
    reviewCount: 89,
    maxGroupSize: 8,
    highlights: ['Jungfraujoch — Top of Europe', 'Paragliding over Interlaken', 'Grindelwald Glacier Trek', 'Zurich Old Town', 'Lake Brienz Cruise'],
    included: ['Alpine chalet stays', 'Daily meals', 'Rail passes', 'Ski equipment rental', 'Professional mountain guide'],
    notIncluded: ['International flights', 'Travel insurance', 'Optional extreme sports'],
  },
  {
    title: 'Rajasthan Royal Heritage',
    description: 'Travel back in time through the land of maharajas. Explore imposing forts, ornate palaces, and vibrant bazaars. Ride camels across the Thar Desert and witness spectacular sunsets over ancient citadels.',
    price: 999,
    duration: '8 Days / 7 Nights',
    location: 'Rajasthan, India',
    country: 'India',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    category: 'Cultural',
    difficulty: 'Easy',
    rating: 4.7,
    reviewCount: 203,
    maxGroupSize: 15,
    highlights: ['Amber Fort, Jaipur', 'Mehrangarh Fort, Jodhpur', 'Jaisalmer Desert Camp', 'City Palace, Udaipur', 'Havelis of Shekhawati'],
    included: ['Heritage hotel stays', 'Daily breakfast & dinner', 'AC transportation', 'Guided city tours', 'Camel safari'],
    notIncluded: ['Flights', 'Entrance fees', 'Personal shopping', 'Alcohol'],
  },
  {
    title: 'Amazon Jungle Expedition',
    description: 'Venture deep into the Amazon rainforest — the lungs of the Earth. Spot exotic wildlife, navigate river tributaries by canoe, and learn from indigenous communities about rainforest survival.',
    price: 1799,
    duration: '9 Days / 8 Nights',
    location: 'Manaus, Brazil',
    country: 'Brazil',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    category: 'Wildlife',
    difficulty: 'Moderate',
    rating: 4.6,
    reviewCount: 67,
    maxGroupSize: 10,
    highlights: ['Pink River Dolphin sighting', 'Piranha fishing', 'Night jungle walk', 'Indigenous village visit', 'Canopy walkway'],
    included: ['Jungle lodge accommodation', 'All meals', 'Canoe excursions', 'Naturalist guide', 'Rubber boots & gear'],
    notIncluded: ['International flights', 'Yellow fever vaccination', 'Travel insurance'],
  },
  {
    title: 'Mediterranean Cruise Escape',
    description: 'Sail the legendary Mediterranean Sea aboard a luxurious cruise ship. Visit iconic coastal cities, swim in crystal-clear coves, and savour world-class cuisine as the sun sets over ancient harbours.',
    price: 3499,
    duration: '14 Days / 13 Nights',
    location: 'Mediterranean Sea',
    country: 'Multiple',
    imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
    category: 'Cruise',
    difficulty: 'Easy',
    rating: 4.9,
    reviewCount: 315,
    maxGroupSize: 200,
    highlights: ['Santorini, Greece', 'Amalfi Coast, Italy', 'Barcelona, Spain', 'Monaco', 'Dubrovnik, Croatia'],
    included: ['Cabin accommodation', 'All meals on board', 'Entertainment', 'Port excursions', 'Wi-Fi'],
    notIncluded: ['Flights to/from port', 'Alcoholic beverages', 'Spa treatments', 'Gratuities'],
  },
  {
    title: 'Tokyo & Kyoto Cultural Immersion',
    description: 'Experience the perfect fusion of ultramodern and ancient Japan. Wander through neon-lit Shibuya, meditate in Zen gardens, savour authentic sushi at Tsukiji, and witness a traditional geisha performance.',
    price: 2199,
    duration: '11 Days / 10 Nights',
    location: 'Tokyo & Kyoto, Japan',
    country: 'Japan',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    category: 'Cultural',
    difficulty: 'Easy',
    rating: 4.8,
    reviewCount: 178,
    maxGroupSize: 12,
    highlights: ['Shibuya Crossing', 'Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Mount Fuji Day Trip', 'Nishiki Market'],
    included: ['Hotel & ryokan stays', 'JR rail pass', 'Daily breakfast', 'Guided tours', 'Tea ceremony experience'],
    notIncluded: ['International flights', 'Most meals', 'Personal shopping', 'Sumo ticket (optional add-on)'],
  },
  {
    title: 'Serengeti Safari & Zanzibar',
    description: 'Witness the Great Migration across the Serengeti plains, then unwind on the spice-scented beaches of Zanzibar. This iconic East Africa combination delivers extraordinary wildlife encounters and tropical paradise.',
    price: 3899,
    duration: '12 Days / 11 Nights',
    location: 'Tanzania',
    country: 'Tanzania',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    category: 'Wildlife',
    difficulty: 'Moderate',
    rating: 5.0,
    reviewCount: 94,
    maxGroupSize: 6,
    highlights: ['Big Five game drives', 'Ngorongoro Crater', 'Hot air balloon safari', 'Stone Town, Zanzibar', 'Spice plantation tour'],
    included: ['Luxury tented camp', 'All meals on safari', 'Beach resort (Zanzibar)', 'Game drives', 'Park fees'],
    notIncluded: ['International flights', 'Visa fees', 'Travel insurance', 'Balloon safari (optional)'],
  },
  {
    title: 'Patagonia End of the World Trek',
    description: 'Stand at the edge of the world in awe-inspiring Patagonia. Hike legendary trails through Torres del Paine, kayak among glaciers, and spot penguins near Ushuaia — the southernmost city on Earth.',
    price: 2599,
    duration: '13 Days / 12 Nights',
    location: 'Patagonia, Chile & Argentina',
    country: 'Chile / Argentina',
    imageUrl: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800',
    category: 'Adventure',
    difficulty: 'Hard',
    rating: 4.7,
    reviewCount: 52,
    maxGroupSize: 8,
    highlights: ['Torres del Paine W-Trek', 'Perito Moreno Glacier', 'Penguin colony at Ushuaia', 'Grey Glacier kayaking', 'Tierra del Fuego NP'],
    included: ['Mountain lodge stays', 'All meals on trek', 'Expert Patagonian guide', 'Trekking gear', 'Boat transfers'],
    notIncluded: ['International flights', 'Optional ice trekking', 'Travel insurance'],
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Package.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@travelagency.com',
      password: 'admin123456',
      role: 'admin',
    });
    console.log('👤 Admin created: admin@travelagency.com / admin123456');

    // Create sample user
    await User.create({
      name: 'Jane Traveller',
      email: 'jane@example.com',
      password: 'user123456',
      role: 'user',
    });
    console.log('👤 Sample user created: jane@example.com / user123456');

    // Create packages
    const pkgs = packages.map(p => ({ ...p, createdBy: admin._id }));
    await Package.insertMany(pkgs);
    console.log(`📦 ${pkgs.length} travel packages seeded`);

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedData();
