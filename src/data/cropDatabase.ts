export interface CropInfo {
  name: string;
  plantingSeason: string;
  harvestSeason: string;
  waterRequirement: string;
  temperatureRange: string;
  soilType: string;
  expectedYield: string;
  fertilizers: string[];
  diseases: string[];
  description?: string;
}

export const cropDatabase: Record<string, CropInfo> = {
  'Apple': {
    name: 'Apple',
    plantingSeason: 'December–January',
    harvestSeason: 'September–October',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Apple scab', 'Powdery mildew', 'Fire blight', 'Aphids'],
    description: 'Apple is a temperate fruit crop that requires chilling hours for proper flowering and fruiting.'
  },
  'Arhar Dal': {
    name: 'Arhar Dal (Pigeon Pea)',
    plantingSeason: 'June–July (Kharif)',
    harvestSeason: 'November–January',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Rhizobium culture'],
    diseases: ['Wilt', 'Stem rot', 'Pod borer', 'Aphids'],
    description: 'Pigeon pea is a drought-tolerant legume crop that fixes nitrogen in the soil.'
  },
  'Banana': {
    name: 'Banana',
    plantingSeason: 'February–March or August–September',
    harvestSeason: '12–15 months after planting (year-round)',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Panama wilt', 'Sigatoka leaf spot', 'Bunchy top', 'Nematodes'],
    description: 'Banana is a perennial crop that produces fruit throughout the year once established.'
  },
  'Black Gram': {
    name: 'Black Gram (Urd Beans)',
    plantingSeason: 'June–July (Kharif) or March–April (Summer)',
    harvestSeason: 'September–October',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Rhizobium culture'],
    diseases: ['Yellow mosaic virus', 'Powdery mildew', 'Pod borer', 'Aphids'],
    description: 'Black gram is a short-duration pulse crop that improves soil fertility.'
  },
  'Coconut': {
    name: 'Coconut',
    plantingSeason: 'June–July (monsoon onset)',
    harvestSeason: 'Throughout the year (first harvest 6–7 years after planting)',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Root wilt', 'Bud rot', 'Rhinoceros beetle', 'Red palm weevil'],
    description: 'Coconut is a perennial crop that provides multiple products and requires long-term investment.'
  },
  'Cotton': {
    name: 'Cotton',
    plantingSeason: 'April–May (North India), June–July (South India)',
    harvestSeason: 'October–January',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Micronutrients'],
    diseases: ['Boll rot', 'Leaf spot', 'Bollworm', 'Whitefly'],
    description: 'Cotton is a cash crop that requires careful pest management and irrigation.'
  },
  'Grapes': {
    name: 'Grapes',
    plantingSeason: 'December–January',
    harvestSeason: 'February–April',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Downy mildew', 'Powdery mildew', 'Anthracnose', 'Thrips'],
    description: 'Grapes are a high-value fruit crop that requires trellising and careful pruning.'
  },
  'Jute': {
    name: 'Jute',
    plantingSeason: 'March–May',
    harvestSeason: 'July–September',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Stem rot', 'Leaf spot', 'Aphids', 'Jute semilooper'],
    description: 'Jute is a fiber crop that requires retting in water for fiber extraction.'
  },
  'Kabuli Chana': {
    name: 'Kabuli Chana (White Chickpeas)',
    plantingSeason: 'October–November (Rabi)',
    harvestSeason: 'March–April',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Rhizobium culture'],
    diseases: ['Ascochyta blight', 'Fusarium wilt', 'Pod borer', 'Aphids'],
    description: 'Kabuli chana is a winter pulse crop with high protein content.'
  },
  'Lentil': {
    name: 'Lentil (Masur)',
    plantingSeason: 'October–November',
    harvestSeason: 'February–March',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Rhizobium culture'],
    diseases: ['Rust', 'Wilt', 'Pod borer', 'Aphids'],
    description: 'Lentil is a winter pulse crop that fixes nitrogen and improves soil health.'
  },
  'Maize': {
    name: 'Maize',
    plantingSeason: 'June–July (Kharif) or February–March (Spring)',
    harvestSeason: 'September–October or June (depending on season)',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Micronutrients'],
    diseases: ['Downy mildew', 'Rust', 'Stalk rot', 'Corn borer'],
    description: 'Maize is a versatile cereal crop that can be grown in both seasons.'
  },
  'Mango': {
    name: 'Mango',
    plantingSeason: 'July–August',
    harvestSeason: 'March–June',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Anthracnose', 'Powdery mildew', 'Mango hopper', 'Fruit fly'],
    description: 'Mango is the king of fruits and requires careful orchard management.'
  },
  'Moath Dal': {
    name: 'Moath Dal (Moth Bean)',
    plantingSeason: 'June–July (Kharif)',
    harvestSeason: 'September–October',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Rhizobium culture'],
    diseases: ['Yellow mosaic virus', 'Powdery mildew', 'Pod borer', 'Aphids'],
    description: 'Moth bean is a drought-tolerant pulse crop suitable for arid regions.'
  },
  'Orange': {
    name: 'Orange',
    plantingSeason: 'July–August or February–March',
    harvestSeason: 'November–February (winter crop) or March–June (summer crop)',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Citrus canker', 'Greening', 'Scale insects', 'Fruit fly'],
    description: 'Orange is a citrus fruit that requires well-drained soil and proper irrigation.'
  },
  'Papaya': {
    name: 'Papaya',
    plantingSeason: 'February–March or June–July',
    harvestSeason: '9–11 months after planting, year-round',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Papaya ring spot virus', 'Anthracnose', 'Powdery mildew', 'Fruit fly'],
    description: 'Papaya is a fast-growing fruit crop that produces year-round.'
  },
  'Pomegranate': {
    name: 'Pomegranate',
    plantingSeason: 'July–August or February–March',
    harvestSeason: '8–10 months after planting',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Organic manure'],
    diseases: ['Bacterial blight', 'Fruit rot', 'Aphids', 'Fruit borer'],
    description: 'Pomegranate is a high-value fruit crop with medicinal properties.'
  },
  'Rice': {
    name: 'Rice',
    plantingSeason: 'June–July (Kharif)',
    harvestSeason: 'November–December',
    waterRequirement: '500–700 mm',
    temperatureRange: '15–25°C',
    soilType: 'Well-drained loamy soil',
    expectedYield: '25–30 quintals/hectare',
    fertilizers: ['Urea', 'DAP', 'Potash', 'Micronutrients'],
    diseases: ['Blast', 'Sheath blight', 'Brown spot', 'Stem borer'],
    description: 'Rice is the staple food crop that requires standing water during growth.'
  }
};

export const getCropInfo = (cropName: string): CropInfo | null => {
  // Try exact match first
  if (cropDatabase[cropName]) {
    return cropDatabase[cropName];
  }
  
  // Try case-insensitive match
  const lowerCropName = cropName.toLowerCase();
  for (const [key, value] of Object.entries(cropDatabase)) {
    if (key.toLowerCase() === lowerCropName) {
      return value;
    }
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(cropDatabase)) {
    if (key.toLowerCase().includes(lowerCropName) || lowerCropName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return null;
};
