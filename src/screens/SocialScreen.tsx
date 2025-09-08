import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  TextInput,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  outfit: {
    name: string;
    occasion: string;
    items: string[];
  };
  date: string;
  tags: string[];
}

const SocialScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');

  const navigation = useNavigation();
  const { user } = useAuth();

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: '1',
      user: {
        id: '1',
        name: 'Alex Chen',
        profileImage: 'https://via.placeholder.com/40'
      },
      image: 'https://via.placeholder.com/300x400',
      caption: 'Loving this casual Friday look! Perfect for the office and after-work drinks 🍸',
      likes: 24,
      comments: 8,
      isLiked: false,
      outfit: {
        name: 'Casual Friday',
        occasion: 'work',
        items: ['White Blouse', 'Dark Jeans', 'Ankle Boots']
      },
      date: '2 hours ago',
      tags: ['casual', 'work', 'friday']
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Sam Taylor',
        profileImage: 'https://via.placeholder.com/40'
      },
      image: 'https://via.placeholder.com/300x400',
      caption: 'Date night outfit that never fails 💕',
      likes: 42,
      comments: 12,
      isLiked: true,
      outfit: {
        name: 'Date Night',
        occasion: 'date',
        items: ['Black Dress', 'Heels', 'Statement Necklace']
      },
      date: '5 hours ago',
      tags: ['date', 'elegant', 'black']
    }
  ];

  const tabs = [
    { id: 'feed', name: 'Feed', icon: 'home' },
    { id: 'discover', name: 'Discover', icon: 'explore' },
    { id: 'friends', name: 'Friends', icon: 'people' },
    { id: 'notifications', name: 'Activity', icon: 'notifications' }
  ];

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleCreatePost = () => {
    // In a real app, this would create a new post
    Alert.alert('Success', 'Post created successfully!');
    setShowCreatePost(false);
    setNewPostCaption('');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.profileImage }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.postDate}>{item.date}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horiz" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.postImageContainer}>
        <Image source={{ uri: item.image }} style={styles.postImage} />
        <View style={styles.outfitOverlay}>
          <View style={styles.outfitInfo}>
            <Text style={styles.outfitName}>{item.outfit.name}</Text>
            <Text style={styles.outfitOccasion}>{item.outfit.occasion}</Text>
          </View>
        </View>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.caption}>{item.caption}</Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.outfitItems}>
          <Text style={styles.outfitItemsTitle}>Outfit pieces:</Text>
          <View style={styles.itemsList}>
            {item.outfit.items.map((itemName, index) => (
              <Text key={index} style={styles.outfitItem}>• {itemName}</Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Icon
            name={item.isLiked ? 'favorite' : 'favorite-border'}
            size={20}
            color={item.isLiked ? '#ef4444' : '#6b7280'}
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chat-bubble-outline" size={20} color="#6b7280" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={20} color="#6b7280" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark-border" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDiscoverContent = () => (
    <View style={styles.discoverContent}>
      <Text style={styles.discoverTitle}>Discover New Styles</Text>
      
      <View style={styles.trendingSection}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Streetwear', 'Minimalist', 'Vintage', 'Bohemian', 'Athleisure'].map((trend, index) => (
            <TouchableOpacity key={index} style={styles.trendCard}>
              <Text style={styles.trendEmoji}>👕</Text>
              <Text style={styles.trendName}>{trend}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.influencersSection}>
        <Text style={styles.sectionTitle}>Style Influencers</Text>
        {['Emma Wilson', 'David Kim', 'Sarah Johnson', 'Mike Chen'].map((influencer, index) => (
          <TouchableOpacity key={index} style={styles.influencerCard}>
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.influencerImage} />
            <View style={styles.influencerInfo}>
              <Text style={styles.influencerName}>{influencer}</Text>
              <Text style={styles.influencerFollowers}>12.5k followers</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFriendsContent = () => (
    <View style={styles.friendsContent}>
      <Text style={styles.friendsTitle}>Your Style Squad</Text>
      
      <View style={styles.friendsList}>
        {['Alex Chen', 'Sam Taylor', 'Jordan Lee', 'Casey Smith'].map((friend, index) => (
          <TouchableOpacity key={index} style={styles.friendCard}>
            <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.friendImage} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend}</Text>
              <Text style={styles.friendStatus}>Active 2 hours ago</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Icon name="message" size={20} color="#6366f1" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StyleSync Social</Text>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => setShowCreatePost(true)}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? '#6366f1' : '#6b7280'}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'feed' && (
        <FlatList
          data={mockPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContainer}
        />
      )}

      {activeTab === 'discover' && renderDiscoverContent()}
      {activeTab === 'friends' && renderFriendsContent()}
      {activeTab === 'notifications' && (
        <View style={styles.notificationsContent}>
          <Text style={styles.notificationsTitle}>Activity</Text>
          <View style={styles.emptyState}>
            <Icon name="notifications-none" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyDescription}>
              When people like or comment on your posts, you'll see them here
            </Text>
          </View>
        </View>
      )}

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={handleCreatePost}>
                <Text style={styles.shareButton}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.createPostContent}>
              <View style={styles.userSection}>
                <Image source={{ uri: user?.profileImage || 'https://via.placeholder.com/40' }} style={styles.createProfileImage} />
                <Text style={styles.createUserName}>{user?.name || 'You'}</Text>
              </View>

              <TextInput
                style={styles.captionInput}
                placeholder="What's your style today?"
                value={newPostCaption}
                onChangeText={setNewPostCaption}
                multiline
                placeholderTextColor="#9ca3af"
              />

              <TouchableOpacity style={styles.addPhotoButton}>
                <Icon name="camera-alt" size={24} color="#6366f1" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
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
  createPostButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#6366f1',
  },
  feedContainer: {
    padding: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  postDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    padding: 4,
  },
  postImageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  outfitOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  outfitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outfitName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outfitOccasion: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  postContent: {
    padding: 15,
  },
  caption: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
  },
  outfitItems: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  outfitItemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  itemsList: {
    gap: 4,
  },
  outfitItem: {
    fontSize: 12,
    color: '#6b7280',
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  discoverContent: {
    padding: 20,
  },
  discoverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  trendingSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  trendCard: {
    width: 100,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trendEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  trendName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  influencersSection: {
    marginBottom: 20,
  },
  influencerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
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
  influencerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  influencerInfo: {
    flex: 1,
  },
  influencerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  influencerFollowers: {
    fontSize: 12,
    color: '#6b7280',
  },
  followButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  friendsContent: {
    padding: 20,
  },
  friendsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  friendsList: {
    gap: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  friendImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  messageButton: {
    padding: 8,
  },
  notificationsContent: {
    flex: 1,
    padding: 20,
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 20,
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
  shareButton: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  createPostContent: {
    gap: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  captionInput: {
    fontSize: 16,
    color: '#1f2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  addPhotoText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
});

export default SocialScreen;

