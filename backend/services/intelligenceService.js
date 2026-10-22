// Predefined localities with coordinates in Rewa
export const REWA_LOCALITIES = [
  { name: 'Sirmour Chowk', lat: 24.5385, lng: 81.2982, ward: 12 },
  { name: 'Shilpi Plaza', lat: 24.5332, lng: 81.3005, ward: 15 },
  { name: 'Saman', lat: 24.5420, lng: 81.3250, ward: 24 },
  { name: 'Amahiya', lat: 24.5290, lng: 81.3020, ward: 18 },
  { name: 'Civil Lines', lat: 24.5390, lng: 81.3090, ward: 20 },
  { name: 'Khutehi', lat: 24.5460, lng: 81.2890, ward: 8 },
  { name: 'Padra', lat: 24.5150, lng: 81.3150, ward: 32 },
  { name: 'Bodabag', lat: 24.5200, lng: 81.3300, ward: 35 },
  { name: 'Rathara', lat: 24.5350, lng: 81.3550, ward: 41 },
  { name: 'College Chauraha', lat: 24.5425, lng: 81.3020, ward: 14 },
];

// Map category to department
export const CATEGORY_DEPARTMENT_MAP = {
  'Roads & Potholes': 'PWD',
  'Street Light': 'Electrical Department',
  'Garbage': 'Municipal Sanitation',
  'Water Supply': 'Water Department',
  'Drainage': 'Drainage Department',
  'Electricity': 'Electricity Board',
  'Park': 'Garden Department',
  'Illegal Construction': 'Building Authority',
  'Public Property': 'Municipal Corporation',
  'Other': 'General Administration',
};

// Keyword mapping for Auto Detect category
const KEYWORD_CATEGORY_MAP = [
  {
    category: 'Roads & Potholes',
    keywords: ['pothole', 'road', 'pavement', 'tar', 'asphalt', 'street quality', 'highway', 'cracks', 'ditch', 'gully', 'path'],
  },
  {
    category: 'Street Light',
    keywords: ['street light', 'lamp', 'darkness', 'bulb', 'led light', 'pole', 'wiring', 'street-light', 'streetlight', 'streetlights'],
  },
  {
    category: 'Garbage',
    keywords: ['garbage', 'trash', 'waste', 'dustbin', 'litter', 'refuse', 'dump', 'collection', 'sweep', 'dirt', 'cleanliness', 'dirty'],
  },
  {
    category: 'Drainage',
    keywords: ['drain', 'sewer', 'gutter', 'overflow', 'clog', 'wastewater', 'sewage', 'stagnant water', 'flooding'],
  },
  {
    category: 'Water Supply',
    keywords: ['water', 'drinking water', 'pipe leakage', 'tap', 'low pressure', 'muddy water', 'no water', 'borewell', 'water connection'],
  },
  {
    category: 'Electricity',
    keywords: ['electricity', 'power cut', 'voltage', 'transformer', 'wire hang', 'power outage', 'electric pole', 'sparking'],
  },
  {
    category: 'Public Property',
    keywords: ['public property', 'vandalism', 'bus stop', 'statue', 'fence', 'government building', 'damage'],
  },
  {
    category: 'Park',
    keywords: ['park', 'garden', 'park bench', 'playground', 'swings', 'trees', 'weeds', 'lawn', 'plants', 'garden bench'],
  },
  {
    category: 'Illegal Construction',
    keywords: ['illegal construction', 'encroachment', 'unauthorized', 'building violation', 'land grabbing', 'illegal structure'],
  },
];

/**
 * Autodetect category from complaint description using keyword matching
 * @param {string} description 
 * @returns {string} Category
 */
export const detectCategory = (description) => {
  if (!description) return 'Other';
  const text = description.toLowerCase();

  for (const item of KEYWORD_CATEGORY_MAP) {
    for (const keyword of item.keywords) {
      if (text.includes(keyword)) {
        return item.category;
      }
    }
  }

  return 'Other';
};

/**
 * Find the nearest locality in Rewa from coordinates
 * @param {number} lat 
 * @param {number} lng 
 * @returns {object} { name, ward }
 */
export const findLocalityAndWard = (lat, lng) => {
  // Let's ensure the location is within broad boundaries of Rewa
  // Rewa boundaries are roughly: Lat 24.40 to 24.65, Lng 81.15 to 81.45
  const isInsideRewa = lat >= 24.40 && lat <= 24.65 && lng >= 81.15 && lng <= 81.45;

  if (!isInsideRewa) {
    throw new Error('Selected location is outside the boundary of Rewa City. Please select a location inside Rewa.');
  }

  let nearestLocality = REWA_LOCALITIES[0];
  let minDistance = Infinity;

  for (const locality of REWA_LOCALITIES) {
    // Simple Euclidean distance calculation for local points
    const dist = Math.sqrt(Math.pow(locality.lat - lat, 2) + Math.pow(locality.lng - lng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      nearestLocality = locality;
    }
  }

  return {
    localityName: nearestLocality.name,
    wardNumber: nearestLocality.ward,
  };
};

/**
 * Map Category to Responsible Department
 * @param {string} category 
 * @returns {string} Department
 */
export const getResponsibleDepartment = (category) => {
  return CATEGORY_DEPARTMENT_MAP[category] || 'General Administration';
};
