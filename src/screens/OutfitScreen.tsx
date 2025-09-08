import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useWardrobe, Outfit } from '../context/WardrobeContext';

const { width } = Dimensions.get('window');

const OutfitScreen: React.FC = () => {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [sortBy, setSortBy] = useState('dateCreated');
  const [showFilters, setShowFilters] = useState(false);

  const navigation = useNavigation();
  const { outfits, deleteOutfit, updateOutfit } = useWardrobe();

  const sortOptions = [
    { id: 'dateCreated', name: 'Recently Created' },
    { id: 'name', name: 'Name A-Z' },
    { id: 'rating', name: 'Rating' },
    { id: 'wearCount', name: 'Most Worn' },
    { id: 'occasion', name: 'Occasion' }
  ];

  const sortedOutfits = outfits.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'wearCount':
        return b.wearCount - a.wearCount;
      case 'occasion':
        return a.occasion.localeCompare(b.occasion);
      default:
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    }
  });

  const handleDeleteOutfit = (outfit: Outfit) => {
    deleteOutfit(outfit.id);
    setSelectedOutfit(null);
  };

  const handleToggleFavorite = (outfit: Outfit) => {
    updateOutfit(outfit.id, { isFavorite: !outfit.isFavorite });
  };

  const handleWearOutfit = (outfit: Outfit) => {
    updateOutfit(outfit.id, { 
      wearCount: outfit.wearCount + 1,
      lastWorn: new Date().toISOString()
    });
  };

  const getOccasionIcon = (occasion: string) => {
    const icons: { [key: string]: string } = {
      casual: '👕',
      work: '👔',
      party: '🎉',
      formal: '🤵',
      date: '💕',
      gym: '💪',
      travel: '✈️',
      beach: '🏖️'
    };
    return icons[occasion] || '👕';
  };

  const getWeatherIcon = (weather: string) => {
    const icons: { [key: string]: string } = {
      hot: '☀️',
      warm: '🌤️',
      cool: '🌥️',
      cold: '❄️',
      rainy: '🌧️'
    };
    return icons[weather] || '🌤️';
  };

  const renderOutfit = ({ item }: { item: Outfit }) => (
    <TouchableOpacity
      style={styles.outfitCard}
      onPress={() => setSelectedOutfit(item)}
    >
      <View style={styles.outfitImage}>
        <Text style={styles.outfitEmoji}>👕</Text>
        <View style={styles.outfitOverlay}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item)}
          >
            <Icon
              name={item.isFavorite ? 'favorite' : 'favorite-border'}
              size={20}
              color={item.isFavorite ? '#ef4444' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.outfitInfo}>
        <Text style={styles.outfitName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.outfitMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>{getOccasionIcon(item.occasion)}</Text>
            <Text style={styles.metaText}>{item.occasion}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>{getWeatherIcon(item.weather)}</Text>
            <Text style={styles.metaText}>{item.weather}</Text>
          </View>
        </View>
        <View style={styles.outfitStats}>
          <Text style={styles.statText}>Worn {item.wearCount} times</Text>
          {item.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Outfits</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Icon name="tune" size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('OutfitGeneration' as never)}
          >
            <Icon name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {outfits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="style" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No outfits yet</Text>
          <Text style={styles.emptyDescription}>
            Create your first outfit using our AI generator
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('OutfitGeneration' as never)}
          >
            <Text style={styles.emptyButtonText}>Generate Outfit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedOutfits}
          renderItem={renderOutfit}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.outfitsContainer}
          columnWrapperStyle={styles.outfitsRow}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Outfit Detail Modal */}
      <Modal
        visible={selectedOutfit !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOutfit(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOutfit && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedOutfit.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedOutfit(null)}>
                    <Icon name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <View style={styles.outfitDetailImage}>
                  <Text style={styles.outfitDetailEmoji}>👕</Text>
                </View>

                <View style={styles.outfitDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Occasion:</Text>
                    <View style={styles.detailValueContainer}>
                      <Text style={styles.detailIcon}>{getOccasionIcon(selectedOutfit.occasion)}</Text>
                      <Text style={styles.detailValue}>{selectedOutfit.occasion}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Weather:</Text>
                    <View style={styles.detailValueContainer}>
                      <Text style={styles.detailIcon}>{getWeatherIcon(selectedOutfit.weather)}</Text>
                      <Text style={styles.detailValue}>{selectedOutfit.weather}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Season:</Text>
                    <Text style={styles.detailValue}>{selectedOutfit.season}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Items:</Text>
                    <Text style={styles.detailValue}>{selectedOutfit.items.length} pieces</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Worn:</Text>
                    <Text style={styles.detailValue}>{selectedOutfit.wearCount} times</Text>
                  </View>
                  {selectedOutfit.lastWorn && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last worn:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(selectedOutfit.lastWorn).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemsList}>
                  <Text style={styles.itemsTitle}>Items in this outfit:</Text>
                  {selectedOutfit.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <View style={styles.itemIcon}>
                        <Text style={styles.itemEmoji}>👕</Text>
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDetails}>{item.color} • {item.category}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.wearButton}
                    onPress={() => {
                      handleWearOutfit(selectedOutfit);
                      setSelectedOutfit(null);
                    }}
                  >
                    <Icon name="check" size={20} color="white" />
                    <Text style={styles.wearButtonText}>Wear This Outfit</Text>
                  </TouchableOpacity>

                  <View style={styles.secondaryActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleToggleFavorite(selectedOutfit)}
                    >
                      <Icon
                        name={selectedOutfit.isFavorite ? 'favorite' : 'favorite-border'}
                        size={20}
                        color={selectedOutfit.isFavorite ? '#ef4444' : '#6b7280'}
                      />
                      <Text style={styles.actionButtonText}>
                        {selectedOutfit.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteOutfit(selectedOutfit)}
                    >
                      <Icon name="delete" size={20} color="#ef4444" />
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Delete Outfit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

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
              <Text style={styles.modalTitle}>Sort Outfits</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.filterOption,
                    sortBy === option.id && styles.filterOptionSelected
                  ]}
                  onPress={() => {
                    setSortBy(option.id);
                    setShowFilters(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    sortBy === option.id && styles.filterOptionTextSelected
                  ]}>
                    {option.name}
                  </Text>
                  {sortBy === option.id && (
                    <Icon name="check" size={20} color="#6366f1" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outfitsContainer: {
    padding: 20,
  },
  outfitsRow: {
    justifyContent: 'space-between',
  },
  outfitCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  outfitImage: {
    height: 120,
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outfitEmoji: {
    fontSize: 32,
  },
  outfitOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  outfitInfo: {
    padding: 12,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  outfitMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  outfitStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  outfitDetailImage: {
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  outfitDetailEmoji: {
    fontSize: 64,
  },
  outfitDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  itemsList: {
    marginBottom: 20,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  modalActions: {
    gap: 12,
  },
  wearButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  wearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActions: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
  filterSection: {
    marginTop: 20,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#eef2ff',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  filterOptionTextSelected: {
    color: '#6366f1',
    fontWeight: '500',
  },
});

export default OutfitScreen;

