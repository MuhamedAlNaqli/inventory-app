import { Pressable, StyleSheet, View, Text, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { Field } from '@/components/Field'
import { useRouter } from 'expo-router';

// Custom icons
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { MicrosoftIcon } from "@/components/icons/MicrosoftIcon";

export default function LoginScreen(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function onLoginAsync(){
        setLoading(true);
        // Basic validation to check if username and password are not empty
        if (!username || !password) {
            alert("Please enter both username and password.");
            setLoading(false);
            return;
        }

        // Simulate a login API call
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        // After successful login, navigate to the main inventory screen
        setLoading(false);
        router.replace("/inventory");
    }

  return (
        <View>
            <ActivityIndicator animating={loading} size="large" color="#0000ff" />
            <Field
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                style={{marginBottom: 16}}
            />
            <Field
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{marginBottom: 25}}
            />
            <Pressable
                onPress={onLoginAsync}
                style={styles.loginButton}
            >
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable
                onPress={onLoginAsync}
                style={styles.signInMicrosoftButton}
            >
                <MicrosoftIcon size={20} />
                <Text style={[styles.buttonText, { marginLeft: 10 }]}>Sign in with Microsoft</Text>
            </Pressable>


            <Pressable
                onPress={onLoginAsync}
                style={styles.signInGoogleButton}
            >
                <GoogleIcon size={20} />
                <Text style={[styles.googleButtonText, { marginLeft: 10 }]}>Sign in with Google</Text>
            </Pressable>
        </View>
  )
}

// Design tokens — extract these to a theme file if you have one
const colors = {
  primary: '#0C0A09',
  surface: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textOnLight: '#1F1F1F',
  border: '#747775',          // Google's recommended border color
  microsoft: '#2F2F2F',       // Microsoft's recommended button color
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

const buttonBase = {
  minHeight: 48,                 // a11y / HIG / Material touch target
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  borderRadius: radius.md,       // 12 reads more modern than 20 here
  marginBottom: spacing.md,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
  }),
};

const styles = StyleSheet.create({
  loginButton: {
    ...buttonBase,
    backgroundColor: colors.primary,
  },
  // Per Google's branding guidelines: white surface, dark text, multi-color "G"
  signInGoogleButton: {
    ...buttonBase,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  // Per Microsoft's branding guidelines: #2F2F2F or white with their squares logo
  signInMicrosoftButton: {
    ...buttonBase,
    backgroundColor: colors.microsoft,
  },
  buttonIcon: {
    marginRight: spacing.sm,
    width: 20,
    height: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',           // '600' is more typographically correct than 'bold'
    letterSpacing: 0.25,
    color: colors.textOnDark,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',           // '600' is more typographically correct than 'bold'
    letterSpacing: 0.25,
    color: colors.textOnLight,
  },
  buttonTextOnLight: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.25,
    color: colors.textOnLight,   // use this on the Google button
  },
  buttonPressed: {
    opacity: 0.85,                // pair with Pressable's style callback
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});