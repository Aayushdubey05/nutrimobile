import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F5F3"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* App Name */}
          <Text style={styles.appName}>
            NutriVision-3D
          </Text>

          {/* Food Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
              }}
              style={styles.foodImage}
              resizeMode="cover"
            />
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            See your food. Understand your nutrition.
          </Text>

          {/* Bottom Button */}
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>
              Get Started
            </Text>
          </Pressable>

        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F3',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 26,
  },

  appName: {
    marginTop: 62,
    fontSize: 29,
    fontWeight: '800',
    color: '#1B1B1B',
    letterSpacing: -0.8,
  },

  imageContainer: {
    width: width - 52,
    height: width - 52,
    maxHeight: 390,
    marginTop: 30,
    borderRadius: 19,
    overflow: 'hidden',

    // Android shadow
    elevation: 5,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  foodImage: {
    width: '100%',
    height: '100%',
  },

  tagline: {
    marginTop: 32,
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  button: {
    position: 'absolute',
    left: 26,
    right: 26,
    bottom: 66,

    height: 56,
    borderRadius: 30,

    backgroundColor: '#1B1B1B',

    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
