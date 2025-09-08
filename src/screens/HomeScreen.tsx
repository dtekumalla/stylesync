import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState('sunny');
  const [temperature, setTemperature] = useState(22);
  const navigation = useNavigation();
  const { user } = useAuth();
  const { clothingItems, outfits, generateOutfitSuggestions } = useWardrobe();

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'cold': return '❄️';
      default: return '☀️';
    }
  };

  const quickActions = [
    {
      title: 'Add Clothes',
      icon: 'camera-alt',
      color: '#6366f1',
      onPress: () => navigation.navigate('Camera' as never)
    },
    {
      title: 'Generate Outfit',
      icon: 'auto-awesome',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('OutfitGeneration' as never)
    },
    {
      title: 'My Wardrobe',
      icon: 'checkroom',
      color: '#d946ef',
      onPress: () => navigation.navigate('Wardrobe' as never)
    },
    {
      title: 'Social Feed',
      icon: 'people',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Social' as never)
    }
  ];

  const recentOutfits = outfits.slice(0, 3);
  const totalItems = clothingItems.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.name || 'User'}!</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile' as never)}
            >
              <Image
                source={{ uri: user?.profileImage || 'https://via.placeholder.com/50' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* Weather Card */}
          <View style={styles.weatherCard}>
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherIcon}>{getWeatherIcon()}</Text>
              <View>
                <Text style={styles.temperature}>{temperature}°C</Text>
                <Text style={styles.weatherText}>Perfect for a light jacket</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.weatherButton}
              onPress={() => navigation.navigate('OutfitGeneration' as never)}
            >
              <Text style={styles.weatherButtonText}>Get Outfit</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <Icon name={action.icon} size={24} color="white" />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Wardrobe</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalItems}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{outfits.length}</Text>
              <Text style={styles.statLabel}>Outfits</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {clothingItems.filter(item => item.isFavorite).length}
              </Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>

        {/* Recent Outfits */}
        {recentOutfits.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Outfits</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Outfits' as never)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentOutfits.map((outfit) => (
                <TouchableOpacity
                  key={outfit.id}
                  style={styles.outfitCard}
                  onPress={() => navigation.navigate('OutfitGeneration' as never)}
                >
                  <View style={styles.outfitImageContainer}>
                    <Text style={styles.outfitPlaceholder}>👕</Text>
                  </View>
                  <Text style={styles.outfitName}>{outfit.name}</Text>
                  <Text style={styles.outfitOccasion}>{outfit.occasion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Style Tips</Text>
          <View style={styles.tipCard}>
            <Icon name="lightbulb" size={24} color="#f59e0b" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Mix & Match</Text>
              <Text style={styles.tipText}>
                Try pairing neutral colors with one bold accent piece for a balanced look.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  weatherButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  weatherButtonText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#6366f1',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
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
  quickActionText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  outfitCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  outfitImageContainer: {
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  outfitPlaceholder: {
    fontSize: 32,
  },
  outfitName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  outfitOccasion: {
    fontSize: 12,
    color: '#6b7280',
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
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
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default HomeScreen;

