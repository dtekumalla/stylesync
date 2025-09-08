import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';

const { width } = Dimensions.get('window');

const OutfitGenerationScreen: React.FC = () => {
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigation = useNavigation();
  const { user } = useAuth();
  const { generateOutfitSuggestions, addOutfit } = useWardrobe();

  const occasions = [
    { id: 'casual', name: 'Casual', icon: '👕' },
    { id: 'work', name: 'Work', icon: '👔' },
    { id: 'party', name: 'Party', icon: '🎉' },
    { id: 'formal', name: 'Formal', icon: '🤵' },
    { id: 'date', name: 'Date', icon: '💕' },
    { id: 'gym', name: 'Gym', icon: '💪' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'beach', name: 'Beach', icon: '🏖️' }
  ];

  const weatherOptions = [
    { id: 'hot', name: 'Hot', icon: '☀️' },
    { id: 'warm', name: 'Warm', icon: '🌤️' },
    { id: 'cool', name: 'Cool', icon: '🌥️' },
    { id: 'cold', name: 'Cold', icon: '❄️' },
    { id: 'rainy', name: 'Rainy', icon: '🌧️' }
  ];

  const generateOutfits = async () => {
    if (!selectedOccasion || !selectedWeather) {
      Alert.alert('Error', 'Please select both occasion and weather');
      return;
    }

    setLoading(true);
    try {
      const outfitSuggestions = await generateOutfitSuggestions(
        selectedOccasion,
        selectedWeather,
        user?.age || 25,
        user?.gender || 'non-binary'
      );
      setSuggestions(outfitSuggestions);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate outfit suggestions');
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit: any) => {
    try {
      await addOutfit({
        name: outfit.outfit.name,
        items: outfit.outfit.items,
        occasion: outfit.occasion,
        weather: outfit.weather,
        season: getCurrentSeason(),
        rating: 0,
        tags: outfit.outfit.tags || []
      });
      Alert.alert('Success', 'Outfit saved to your collection!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save outfit');
    }
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Outfit Generator</Text>
          <TouchableOpacity onPress={() => setShowFilters(true)}>
            <Icon name="tune" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Occasion Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Occasion</Text>
          <View style={styles.optionsGrid}>
            {occasions.map((occasion) => (
              <TouchableOpacity
                key={occasion.id}
                style={[
                  styles.optionCard,
                  selectedOccasion === occasion.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedOccasion(occasion.id)}
              >
                <Text style={styles.optionIcon}>{occasion.icon}</Text>
                <Text style={[
                  styles.optionText,
                  selectedOccasion === occasion.id && styles.optionTextSelected
                ]}>
                  {occasion.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weather Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Weather</Text>
          <View style={styles.optionsGrid}>
            {weatherOptions.map((weather) => (
              <TouchableOpacity
                key={weather.id}
                style={[
                  styles.optionCard,
                  selectedWeather === weather.id && styles.optionCardSelected
                ]}
                onPress={() => setSelectedWeather(weather.id)}
              >
                <Text style={styles.optionIcon}>{weather.icon}</Text>
                <Text style={[
                  styles.optionText,
                  selectedWeather === weather.id && styles.optionTextSelected
                ]}>
                  {weather.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={generateOutfits}
          disabled={loading || !selectedOccasion || !selectedWeather}
        >
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating...' : 'Generate Outfits'}
          </Text>
        </TouchableOpacity>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Outfits</Text>
            {suggestions.map((suggestion, index) => (
              <View key={suggestion.id} style={styles.outfitCard}>
                <View style={styles.outfitHeader}>
                  <Text style={styles.outfitName}>{suggestion.outfit.name}</Text>
                  <View style={styles.confidenceContainer}>
                    <Text style={[
                      styles.confidenceText,
                      { color: getConfidenceColor(suggestion.confidence) }
                    ]}>
                      {Math.round(suggestion.confidence * 100)}% match
                    </Text>
                  </View>
                </View>

                <Text style={styles.outfitReason}>{suggestion.reason}</Text>

                <View style={styles.outfitItems}>
                  {suggestion.outfit.items.map((item: any, itemIndex: number) => (
                    <View key={itemIndex} style={styles.itemCard}>
                      <View style={styles.itemImage}>
                        <Text style={styles.itemEmoji}>👕</Text>
                      </View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDetails}>{item.color} • {item.category}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.outfitActions}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => saveOutfit(suggestion)}
                  >
                    <Icon name="bookmark-add" size={20} color="white" />
                    <Text style={styles.saveButtonText}>Save Outfit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.regenerateButton}
                    onPress={() => generateOutfits()}
                  >
                    <Icon name="refresh" size={20} color="#6366f1" />
                    <Text style={styles.regenerateButtonText}>Regenerate</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.outfitTags}>
                  <View style={[
                    styles.tag,
                    suggestion.ageAppropriate && styles.tagSuccess
                  ]}>
                    <Text style={styles.tagText}>
                      {suggestion.ageAppropriate ? '✓' : '✗'} Age Appropriate
                    </Text>
                  </View>
                  <View style={[
                    styles.tag,
                    suggestion.genderAppropriate && styles.tagSuccess
                  ]}>
                    <Text style={styles.tagText}>
                      {suggestion.genderAppropriate ? '✓' : '✗'} Gender Appropriate
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Shopping Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complete Your Look</Text>
            <View style={styles.shoppingCard}>
              <Text style={styles.shoppingTitle}>Need more pieces?</Text>
              <Text style={styles.shoppingDescription}>
                Discover affordable items to complete your wardrobe
              </Text>
              <TouchableOpacity style={styles.shoppingButton}>
                <Text style={styles.shoppingButtonText}>Browse Shopping</Text>
                <Icon name="shopping-bag" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Advanced filtering options will be available in future updates.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: (width - 64) / 4,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionCardSelected: {
    backgroundColor: '#6366f1',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: 'white',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outfitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outfitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  confidenceContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  outfitReason: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  outfitItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  itemCard: {
    width: (width - 88) / 3,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  outfitActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  regenerateButtonText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  outfitTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagSuccess: {
    backgroundColor: '#f0fdf4',
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
  },
  shoppingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shoppingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  shoppingDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  shoppingButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  shoppingButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default OutfitGenerationScreen;

