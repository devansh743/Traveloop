// =============================
// WANDERLUST – MOCK DATA
// =============================

const WL = {
  // Current logged-in user
  currentUser: JSON.parse(localStorage.getItem('wl_user') || 'null'),

  // Sample trips
  trips: JSON.parse(localStorage.getItem('wl_trips') || 'null') || [
    {
      id: 't1', name: 'European Summer', emoji: '🗼',
      startDate: '2026-07-10', endDate: '2026-07-28',
      description: 'A dream trip through Paris, Rome & Barcelona.',
      destinations: 3, budget: 3500, spent: 1200,
      status: 'upcoming',
      stops: [
        { city: 'Paris', country: 'France', emoji: '🗼', dates: 'Jul 10–14',
          activities: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'] },
        { city: 'Rome', country: 'Italy', emoji: '🏛️', dates: 'Jul 14–20',
          activities: ['Colosseum Tour', 'Vatican Museum', 'Pasta Making Class'] },
        { city: 'Barcelona', country: 'Spain', emoji: '🌊', dates: 'Jul 20–28',
          activities: ['Sagrada Familia', 'Park Güell', 'Flamenco Show'] }
      ]
    },
    {
      id: 't2', name: 'Tokyo Adventure', emoji: '🗾',
      startDate: '2026-09-05', endDate: '2026-09-18',
      description: 'Explore the incredible blend of tradition and futurism.',
      destinations: 2, budget: 2800, spent: 900,
      status: 'upcoming',
      stops: [
        { city: 'Tokyo', country: 'Japan', emoji: '🗾', dates: 'Sep 5–12',
          activities: ['Shibuya Crossing', 'Meiji Shrine', 'Tsukiji Market'] },
        { city: 'Kyoto', country: 'Japan', emoji: '⛩️', dates: 'Sep 12–18',
          activities: ['Arashiyama Bamboo Grove', 'Fushimi Inari', 'Tea Ceremony'] }
      ]
    },
    {
      id: 't3', name: 'Southeast Asia', emoji: '🌴',
      startDate: '2025-12-20', endDate: '2026-01-10',
      description: 'Beaches, temples, and street food across Thailand & Bali.',
      destinations: 4, budget: 1800, spent: 1750,
      status: 'completed',
      stops: [
        { city: 'Bangkok', country: 'Thailand', emoji: '🐘', dates: 'Dec 20–25',
          activities: ['Grand Palace', 'Wat Pho', 'Floating Market'] },
        { city: 'Chiang Mai', country: 'Thailand', emoji: '🌸', dates: 'Dec 25–29',
          activities: ['Doi Inthanon', 'Night Bazaar', 'Elephant Sanctuary'] }
      ]
    }
  ],

  // Sample cities
  cities: [
    { name: 'Paris', country: 'France', emoji: '🗼', region: 'Europe', cost: '$$', popularity: 98, rating: 4.8 },
    { name: 'Tokyo', country: 'Japan', emoji: '🗾', region: 'Asia', cost: '$$$', popularity: 95, rating: 4.9 },
    { name: 'New York', country: 'USA', emoji: '🗽', region: 'Americas', cost: '$$$', popularity: 97, rating: 4.7 },
    { name: 'Bali', country: 'Indonesia', emoji: '🌴', region: 'Asia', cost: '$', popularity: 88, rating: 4.8 },
    { name: 'Barcelona', country: 'Spain', emoji: '🌊', region: 'Europe', cost: '$$', popularity: 90, rating: 4.7 },
    { name: 'Dubai', country: 'UAE', emoji: '🏙️', region: 'Middle East', cost: '$$$', popularity: 91, rating: 4.6 },
    { name: 'Rome', country: 'Italy', emoji: '🏛️', region: 'Europe', cost: '$$', popularity: 92, rating: 4.8 },
    { name: 'Sydney', country: 'Australia', emoji: '🦘', region: 'Oceania', cost: '$$$', popularity: 85, rating: 4.7 },
    { name: 'Istanbul', country: 'Turkey', emoji: '🕌', region: 'Europe/Asia', cost: '$', popularity: 83, rating: 4.6 },
    { name: 'Santorini', country: 'Greece', emoji: '🏝️', region: 'Europe', cost: '$$$', popularity: 87, rating: 4.9 },
    { name: 'Marrakech', country: 'Morocco', emoji: '🌺', region: 'Africa', cost: '$', popularity: 78, rating: 4.5 },
    { name: 'Prague', country: 'Czech Republic', emoji: '🏰', region: 'Europe', cost: '$', popularity: 82, rating: 4.7 },
  ],

  // Sample activities
  activities: [
    { id: 'a1', name: 'Eiffel Tower Visit', city: 'Paris', emoji: '🗼', type: 'Sightseeing', cost: 28, duration: '3h', rating: 4.8 },
    { id: 'a2', name: 'Louvre Museum', city: 'Paris', emoji: '🎨', type: 'Culture', cost: 17, duration: '4h', rating: 4.9 },
    { id: 'a3', name: 'Seine River Cruise', city: 'Paris', emoji: '🚢', type: 'Adventure', cost: 15, duration: '1h', rating: 4.7 },
    { id: 'a4', name: 'Colosseum Tour', city: 'Rome', emoji: '🏛️', type: 'History', cost: 22, duration: '3h', rating: 4.9 },
    { id: 'a5', name: 'Vatican Museum', city: 'Rome', emoji: '⛪', type: 'Culture', cost: 20, duration: '4h', rating: 4.8 },
    { id: 'a6', name: 'Pasta Making Class', city: 'Rome', emoji: '🍝', type: 'Food', cost: 65, duration: '3h', rating: 4.9 },
    { id: 'a7', name: 'Sagrada Familia', city: 'Barcelona', emoji: '⛪', type: 'Architecture', cost: 26, duration: '2h', rating: 4.9 },
    { id: 'a8', name: 'Shibuya Crossing', city: 'Tokyo', emoji: '🚦', type: 'Sightseeing', cost: 0, duration: '1h', rating: 4.7 },
    { id: 'a9', name: 'Tea Ceremony', city: 'Kyoto', emoji: '🍵', type: 'Culture', cost: 35, duration: '2h', rating: 4.9 },
    { id: 'a10', name: 'Elephant Sanctuary', city: 'Chiang Mai', emoji: '🐘', type: 'Nature', cost: 80, duration: '6h', rating: 5.0 },
    { id: 'a11', name: 'Bungee Jumping', city: 'Queenstown', emoji: '🪂', type: 'Adventure', cost: 185, duration: '3h', rating: 4.8 },
    { id: 'a12', name: 'Northern Lights Tour', city: 'Reykjavik', emoji: '🌌', type: 'Nature', cost: 95, duration: '5h', rating: 4.9 },
  ],

  // Packing categories
  packingCategories: ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Medications', 'Other'],

  // Notes
  notes: JSON.parse(localStorage.getItem('wl_notes') || 'null') || [
    { id: 'n1', tripId: 't1', title: 'Hotel Check-in', text: 'Hotel Le Marais – Check-in at 3PM, confirmation #PRS2891. Address: 5 Rue de Bretagne.', date: '2026-05-08T09:30:00Z', stop: 'Paris' },
    { id: 'n2', tripId: 't1', title: 'Flight Details', text: 'Flight AI-401 departs at 06:30. Reach airport by 04:30. Terminal 2.', date: '2026-05-07T14:00:00Z', stop: '' },
    { id: 'n3', tripId: 't2', title: 'JR Pass Reminder', text: 'Activate JR Pass on arrival day at Narita Airport. Valid for 14 days.', date: '2026-05-06T11:00:00Z', stop: 'Tokyo' },
  ],

  // Budget breakdown for active trip
  budgetBreakdown: {
    transport: { amount: 620, label: 'Transport', emoji: '✈️', color: '#6C63FF' },
    accommodation: { amount: 980, label: 'Stay', emoji: '🏨', color: '#FF6584' },
    activities: { amount: 340, label: 'Activities', emoji: '🎯', color: '#FFD166' },
    food: { amount: 420, label: 'Food', emoji: '🍽️', color: '#06D6A0' },
    shopping: { amount: 240, label: 'Shopping', emoji: '🛍️', color: '#118AB2' },
  },

  // Packing list
  packingList: JSON.parse(localStorage.getItem('wl_packing') || 'null') || [
    { id: 'p1', item: 'Passport', category: 'Documents', checked: false },
    { id: 'p2', item: 'Travel Insurance', category: 'Documents', checked: false },
    { id: 'p3', item: 'Flight Tickets', category: 'Documents', checked: true },
    { id: 'p4', item: 'T-Shirts (5)', category: 'Clothing', checked: false },
    { id: 'p5', item: 'Jeans (2)', category: 'Clothing', checked: false },
    { id: 'p6', item: 'Sunglasses', category: 'Clothing', checked: true },
    { id: 'p7', item: 'Phone Charger', category: 'Electronics', checked: false },
    { id: 'p8', item: 'Power Bank', category: 'Electronics', checked: false },
    { id: 'p9', item: 'Sunscreen', category: 'Toiletries', checked: false },
    { id: 'p10', item: 'Toothbrush & Paste', category: 'Toiletries', checked: true },
  ],

  save() {
    localStorage.setItem('wl_trips', JSON.stringify(this.trips));
    localStorage.setItem('wl_notes', JSON.stringify(this.notes));
    localStorage.setItem('wl_packing', JSON.stringify(this.packingList));
    if (this.currentUser) localStorage.setItem('wl_user', JSON.stringify(this.currentUser));
  }
};

// Utility helpers
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

function genId() {
  return Math.random().toString(36).substr(2, 9);
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
