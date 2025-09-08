# StyleSync - AI-Powered Wardrobe Management App

StyleSync is a comprehensive mobile application that combines wardrobe management, AI-powered outfit generation, and social media features to help users discover and share their personal style.

## Features

### 🎯 Core Features
- **Smart Wardrobe Management**: Take photos of clothes and let AI organize them automatically
- **AI Outfit Generation**: Get personalized outfit suggestions based on occasion, weather, age, and gender
- **Context-Aware Recommendations**: Smart suggestions that consider appropriateness and social settings
- **Social Media Integration**: Share outfits, discover new styles, and connect with friends
- **Shopping Integration**: Find affordable pieces to complete your wardrobe

### 📱 Key Screens
- **Welcome & Authentication**: Beautiful onboarding with user registration and login
- **Home Dashboard**: Overview of wardrobe stats, quick actions, and recent outfits
- **Camera & Upload**: Easy photo capture and clothing item management
- **AI Outfit Generator**: Context-aware outfit suggestions with confidence ratings
- **Wardrobe Management**: Organized view of all clothing items with search and filters
- **Outfit Collection**: Manage and track your favorite outfit combinations
- **Social Feed**: Discover and share style inspiration with the community
- **Profile & Settings**: Personalize your experience and manage preferences

### 🤖 AI-Powered Features
- **Smart Categorization**: Automatically categorize clothing by type, color, and style
- **Outfit Generation**: Create complete outfits based on multiple factors:
  - Occasion (casual, work, party, formal, date, gym, travel, beach)
  - Weather conditions (hot, warm, cool, cold, rainy)
  - User age and gender preferences
  - Appropriateness for social settings
- **Style Analytics**: Track wearing patterns and style preferences
- **Shopping Suggestions**: AI-recommended items to complete your wardrobe

### 👥 Social Features
- **Style Sharing**: Post photos of your outfits with detailed information
- **Community Discovery**: Explore trending styles and follow influencers
- **Friend Connections**: Build a style squad and share recommendations
- **Activity Feed**: Stay updated on friends' style choices and interactions

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Context API
- **UI Components**: React Native Paper + Custom Components
- **Camera**: Expo Camera
- **Image Handling**: Expo Image Picker
- **Storage**: AsyncStorage
- **Styling**: StyleSheet with Linear Gradients
- **Icons**: React Native Vector Icons

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stylesync
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - For iOS: Press `i` in the terminal or scan QR code with Expo Go app
   - For Android: Press `a` in the terminal or scan QR code with Expo Go app

## Project Structure

```
stylesync/
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx      # User authentication and profile management
│   │   └── WardrobeContext.tsx  # Wardrobe and outfit management
│   └── screens/
│       ├── WelcomeScreen.tsx    # Onboarding and welcome
│       ├── LoginScreen.tsx      # User login
│       ├── RegisterScreen.tsx   # User registration
│       ├── HomeScreen.tsx       # Main dashboard
│       ├── CameraScreen.tsx     # Photo capture and item addition
│       ├── OutfitGenerationScreen.tsx  # AI outfit suggestions
│       ├── WardrobeScreen.tsx   # Wardrobe management
│       ├── OutfitScreen.tsx     # Outfit collection
│       ├── SocialScreen.tsx     # Social media features
│       └── ProfileScreen.tsx    # User profile and settings
├── App.tsx                      # Main app component
├── package.json                 # Dependencies and scripts
├── app.json                     # Expo configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Key Features Implementation

### AI Outfit Generation
The app uses a sophisticated algorithm that considers:
- **Occasion appropriateness**: Different styles for work, parties, dates, etc.
- **Weather compatibility**: Appropriate clothing for different weather conditions
- **Age-appropriate styling**: Ensures suggestions match user's age group
- **Gender-inclusive options**: Supports male, female, and non-binary preferences
- **Confidence scoring**: Each suggestion comes with a confidence rating

### Context-Aware Recommendations
- **Social setting awareness**: Considers the appropriateness of outfits for different social contexts
- **Seasonal recommendations**: Suggests outfits based on current season
- **Wear tracking**: Monitors how often items are worn to improve suggestions
- **Personal preferences**: Learns from user's favorite items and styles

### Social Media Integration
- **Outfit sharing**: Users can post photos of their outfits with detailed information
- **Style discovery**: Browse trending styles and discover new fashion inspiration
- **Community interaction**: Like, comment, and share outfit posts
- **Friend connections**: Build a network of style-conscious friends

## Future Enhancements

- **Machine Learning Integration**: Implement actual ML models for better outfit suggestions
- **Shopping API Integration**: Connect with real shopping platforms for purchase recommendations
- **Advanced Analytics**: Detailed style analytics and trend predictions
- **AR Try-On**: Augmented reality features for virtual outfit try-ons
- **Weather API Integration**: Real-time weather data for better outfit suggestions
- **Push Notifications**: Notifications for outfit reminders and style tips

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@stylesync.app or join our Discord community.

---

**StyleSync** - Discover, Create, and Share Your Perfect Style! ✨

