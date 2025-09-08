import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Switch,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    age: '',
    gender: 'non-binary' as 'male' | 'female' | 'non-binary'
  });

  const navigation = useNavigation();
  const { user, updateUser, logout } = useAuth();
  const { clothingItems, outfits } = useWardrobe();

  const stats = [
    { label: 'Clothing Items', value: clothingItems.length, icon: 'checkroom' },
    { label: 'Outfits', value: outfits.length, icon: 'style' },
    { label: 'Favorites', value: clothingItems.filter(item => item.isFavorite).length, icon: 'favorite' },
    { label: 'Posts', value: 12, icon: 'photo' }
  ];

  const menuItems = [
    { id: 'wardrobe', title: 'My Wardrobe', icon: 'checkroom', color: '#6366f1' },
    { id: 'outfits', title: 'My Outfits', icon: 'style', color: '#8b5cf6' },
    { id: 'favorites', title: 'Favorites', icon: 'favorite', color: '#ef4444' },
    { id: 'shopping', title: 'Shopping List', icon: 'shopping-bag', color: '#10b981' },
    { id: 'analytics', title: 'Style Analytics', icon: 'analytics', color: '#f59e0b' },
    { id: 'settings', title: 'Settings', icon: 'settings', color: '#6b7280' }
  ];

  const handleEditProfile = () => {
    setEditData({
      name: user?.name || '',
      age: user?.age?.toString() || '',
      gender: user?.gender || 'non-binary'
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editData.name || !editData.age) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await updateUser({
        name: editData.name,
        age: parseInt(editData.age),
        gender: editData.gender
      });
      setShowEditProfile(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleMenuPress = (itemId: string) => {
    switch (itemId) {
      case 'wardrobe':
        navigation.navigate('Wardrobe' as never);
        break;
      case 'outfits':
        navigation.navigate('Outfits' as never);
        break;
      case 'settings':
        setShowSettings(true);
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available in future updates');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Icon name="edit" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}
            >
              <Icon name="settings" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <Image
              source={{ uri: user?.profileImage || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userDetails}>
              {user?.age} years old • {user?.gender}
            </Text>
            <Text style={styles.userBio}>
              Fashion enthusiast and style explorer
            </Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Icon name={stat.icon} size={24} color="#6366f1" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={24} color="white" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Icon name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Icon name="add" size={20} color="#10b981" />
            <Text style={styles.activityText}>Added "Blue Denim Jacket" to wardrobe</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Icon name="style" size={20} color="#8b5cf6" />
            <Text style={styles.activityText}>Created "Casual Friday" outfit</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Icon name="favorite" size={20} color="#ef4444" />
            <Text style={styles.activityText}>Liked Sam's outfit post</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleSaveProfile}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={editData.name}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, name: value }))}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age *</Text>
                <TextInput
                  style={styles.input}
                  value={editData.age}
                  onChangeText={(value) => setEditData(prev => ({ ...prev, age: value }))}
                  placeholder="Enter your age"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender Identity</Text>
                <View style={styles.genderContainer}>
                  {(['male', 'female', 'non-binary'] as const).map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderButton,
                        editData.gender === gender && styles.genderButtonSelected
                      ]}
                      onPress={() => setEditData(prev => ({ ...prev, gender }))}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        editData.gender === gender && styles.genderButtonTextSelected
                      ]}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Settings</Text>
              <View style={{ width: 60 }} />
            </View>

            <View style={styles.settingsContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Switch value={true} onValueChange={() => {}} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingTitle}>Show Age</Text>
                <Switch value={user?.socialSettings?.showAge || false} onValueChange={() => {}} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingTitle}>Show Location</Text>
                <Switch value={user?.socialSettings?.showLocation || false} onValueChange={() => {}} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingValue}>Friends Only</Text>
              </View>
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
    marginBottom: 30,
  },
  editButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  userBio: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -15,
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
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  activityContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  editForm: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  genderButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: 'white',
  },
  settingsContent: {
    gap: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingTitle: {
    fontSize: 16,
    color: '#1f2937',
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default ProfileScreen;

