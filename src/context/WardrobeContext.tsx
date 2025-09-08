import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories';
  subcategory: string;
  color: string;
  pattern: string;
  material: string;
  brand?: string;
  size: string;
  imageUri: string;
  tags: string[];
  occasions: string[];
  weather: string[];
  dateAdded: string;
  lastWorn?: string;
  wearCount: number;
  isFavorite: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: string;
  weather: string;
  season: string;
  rating: number;
  dateCreated: string;
  lastWorn?: string;
  wearCount: number;
  isFavorite: boolean;
  imageUri?: string;
  tags: string[];
}

export interface OutfitSuggestion {
  id: string;
  outfit: Outfit;
  confidence: number;
  reason: string;
  occasion: string;
  weather: string;
  ageAppropriate: boolean;
  genderAppropriate: boolean;
}

interface WardrobeContextType {
  clothingItems: ClothingItem[];
  outfits: Outfit[];
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'dateAdded' | 'wearCount' | 'isFavorite'>) => Promise<void>;
  updateClothingItem: (id: string, updates: Partial<ClothingItem>) => Promise<void>;
  deleteClothingItem: (id: string) => Promise<void>;
  addOutfit: (outfit: Omit<Outfit, 'id' | 'dateCreated' | 'wearCount' | 'isFavorite'>) => Promise<void>;
  updateOutfit: (id: string, updates: Partial<Outfit>) => Promise<void>;
  deleteOutfit: (id: string) => Promise<void>;
  generateOutfitSuggestions: (occasion: string, weather: string, userAge: number, userGender: string) => Promise<OutfitSuggestion[]>;
  getShoppingSuggestions: (budget: number, preferences: string[]) => Promise<any[]>;
  loading: boolean;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export const useWardrobe = () => {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
};

interface WardrobeProviderProps {
  children: ReactNode;
}

export const WardrobeProvider: React.FC<WardrobeProviderProps> = ({ children }) => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWardrobeData();
  }, []);

  const loadWardrobeData = async () => {
    try {
      const [clothingData, outfitData] = await Promise.all([
        AsyncStorage.getItem('clothingItems'),
        AsyncStorage.getItem('outfits')
      ]);

      if (clothingData) {
        setClothingItems(JSON.parse(clothingData));
      }
      if (outfitData) {
        setOutfits(JSON.parse(outfitData));
      }
    } catch (error) {
      console.error('Error loading wardrobe data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveClothingItems = async (items: ClothingItem[]) => {
    try {
      await AsyncStorage.setItem('clothingItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving clothing items:', error);
    }
  };

  const saveOutfits = async (outfits: Outfit[]) => {
    try {
      await AsyncStorage.setItem('outfits', JSON.stringify(outfits));
    } catch (error) {
      console.error('Error saving outfits:', error);
    }
  };

  const addClothingItem = async (item: Omit<ClothingItem, 'id' | 'dateAdded' | 'wearCount' | 'isFavorite'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      wearCount: 0,
      isFavorite: false
    };

    const updatedItems = [...clothingItems, newItem];
    setClothingItems(updatedItems);
    await saveClothingItems(updatedItems);
  };

  const updateClothingItem = async (id: string, updates: Partial<ClothingItem>) => {
    const updatedItems = clothingItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setClothingItems(updatedItems);
    await saveClothingItems(updatedItems);
  };

  const deleteClothingItem = async (id: string) => {
    const updatedItems = clothingItems.filter(item => item.id !== id);
    setClothingItems(updatedItems);
    await saveClothingItems(updatedItems);
  };

  const addOutfit = async (outfit: Omit<Outfit, 'id' | 'dateCreated' | 'wearCount' | 'isFavorite'>) => {
    const newOutfit: Outfit = {
      ...outfit,
      id: Date.now().toString(),
      dateCreated: new Date().toISOString(),
      wearCount: 0,
      isFavorite: false
    };

    const updatedOutfits = [...outfits, newOutfit];
    setOutfits(updatedOutfits);
    await saveOutfits(updatedOutfits);
  };

  const updateOutfit = async (id: string, updates: Partial<Outfit>) => {
    const updatedOutfits = outfits.map(outfit =>
      outfit.id === id ? { ...outfit, ...updates } : outfit
    );
    setOutfits(updatedOutfits);
    await saveOutfits(updatedOutfits);
  };

  const deleteOutfit = async (id: string) => {
    const updatedOutfits = outfits.filter(outfit => outfit.id !== id);
    setOutfits(updatedOutfits);
    await saveOutfits(updatedOutfits);
  };

  const generateOutfitSuggestions = async (
    occasion: string,
    weather: string,
    userAge: number,
    userGender: string
  ): Promise<OutfitSuggestion[]> => {
    // AI-powered outfit generation logic
    const suggestions: OutfitSuggestion[] = [];
    
    // Filter items by occasion and weather
    const suitableItems = clothingItems.filter(item => 
      item.occasions.includes(occasion) && 
      item.weather.includes(weather)
    );

    // Group items by category
    const tops = suitableItems.filter(item => item.category === 'top');
    const bottoms = suitableItems.filter(item => item.category === 'bottom');
    const dresses = suitableItems.filter(item => item.category === 'dress');
    const outerwear = suitableItems.filter(item => item.category === 'outerwear');
    const shoes = suitableItems.filter(item => item.category === 'shoes');
    const accessories = suitableItems.filter(item => item.category === 'accessories');

    // Generate outfit combinations
    const combinations = [];
    
    if (dresses.length > 0) {
      // Dress-based outfits
      dresses.forEach(dress => {
        const outfitItems = [dress];
        if (shoes.length > 0) outfitItems.push(shoes[Math.floor(Math.random() * shoes.length)]);
        if (accessories.length > 0) outfitItems.push(accessories[Math.floor(Math.random() * accessories.length)]);
        if (outerwear.length > 0 && weather === 'cold') outfitItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
        
        combinations.push(outfitItems);
      });
    } else {
      // Top + bottom combinations
      tops.forEach(top => {
        bottoms.forEach(bottom => {
          const outfitItems = [top, bottom];
          if (shoes.length > 0) outfitItems.push(shoes[Math.floor(Math.random() * shoes.length)]);
          if (accessories.length > 0) outfitItems.push(accessories[Math.floor(Math.random() * accessories.length)]);
          if (outerwear.length > 0 && weather === 'cold') outfitItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
          
          combinations.push(outfitItems);
        });
      });
    }

    // Convert combinations to outfit suggestions
    combinations.slice(0, 5).forEach((items, index) => {
      const outfit: Outfit = {
        id: `suggestion-${index}`,
        name: `${occasion} Outfit ${index + 1}`,
        items,
        occasion,
        weather,
        season: getCurrentSeason(),
        rating: 0,
        dateCreated: new Date().toISOString(),
        wearCount: 0,
        isFavorite: false,
        tags: []
      };

      suggestions.push({
        id: `suggestion-${index}`,
        outfit,
        confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
        reason: generateReason(occasion, weather, userAge, userGender),
        occasion,
        weather,
        ageAppropriate: isAgeAppropriate(outfit, userAge),
        genderAppropriate: isGenderAppropriate(outfit, userGender)
      });
    });

    return suggestions;
  };

  const getShoppingSuggestions = async (budget: number, preferences: string[]): Promise<any[]> => {
    // Mock shopping suggestions - in a real app, this would integrate with shopping APIs
    return [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        brand: 'Uniqlo',
        price: 19.99,
        image: 'https://via.placeholder.com/300x300',
        category: 'top',
        color: 'white',
        rating: 4.5,
        inBudget: budget >= 19.99
      },
      {
        id: '2',
        name: 'Black Jeans',
        brand: 'Levi\'s',
        price: 89.99,
        image: 'https://via.placeholder.com/300x300',
        category: 'bottom',
        color: 'black',
        rating: 4.2,
        inBudget: budget >= 89.99
      }
    ];
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const generateReason = (occasion: string, weather: string, userAge: number, userGender: string): string => {
    const reasons = [
      `Perfect for ${occasion} in ${weather} weather`,
      `Age-appropriate for ${userAge} year old`,
      `Great for ${userGender} style preferences`,
      `Matches your color preferences`,
      `Suitable for the occasion and weather`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const isAgeAppropriate = (outfit: Outfit, userAge: number): boolean => {
    // Simple age appropriateness check
    if (userAge < 18) {
      return !outfit.items.some(item => item.tags.includes('adult-only'));
    }
    return true;
  };

  const isGenderAppropriate = (outfit: Outfit, userGender: string): boolean => {
    // Gender appropriateness check
    if (userGender === 'non-binary') return true;
    
    const hasGenderSpecificItems = outfit.items.some(item => 
      item.tags.includes('mens-only') || item.tags.includes('womens-only')
    );
    
    if (!hasGenderSpecificItems) return true;
    
    return outfit.items.every(item => {
      if (userGender === 'male') return !item.tags.includes('womens-only');
      if (userGender === 'female') return !item.tags.includes('mens-only');
      return true;
    });
  };

  const value: WardrobeContextType = {
    clothingItems,
    outfits,
    addClothingItem,
    updateClothingItem,
    deleteClothingItem,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    generateOutfitSuggestions,
    getShoppingSuggestions,
    loading
  };

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
};

