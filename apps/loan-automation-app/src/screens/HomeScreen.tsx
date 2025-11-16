import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {colors, shadows, spacing, borderRadius, typography} from '../theme/colors';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({navigation}: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🏡</Text>
          </View>
          <Text style={styles.title}>Welcome to Your Loan Portal</Text>
          <Text style={styles.subtitle}>
            Your home loan journey starts here. Apply, upload documents, and track your progress all in one place.
          </Text>
        </View>

        {/* Main CTA Buttons */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Borrower', {screen: 'Application'} as never)}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIcon}>🚀</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Text style={styles.primaryButtonSubtext}>
                  Start your loan application
                </Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.secondaryButtonsContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Borrower', {
                screen: 'Documents',
                params: {initialView: 'checklist'},
              } as never)}>
              <Text style={styles.secondaryButtonIcon}>✅</Text>
              <Text style={styles.secondaryButtonText}>Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Borrower', {
                screen: 'Documents',
                params: {initialView: 'upload'},
              } as never)}>
              <Text style={styles.secondaryButtonIcon}>📤</Text>
              <Text style={styles.secondaryButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksContainer}>
          <TouchableOpacity
            style={styles.quickLink}
            onPress={() => navigation.navigate('DocumentExamples')}>
            <Text style={styles.quickLinkIcon}>📋</Text>
            <Text style={styles.quickLinkText}>Document Examples</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Secure</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Fast</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Reliable</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl + 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  logoIcon: {
    fontSize: 50,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 24,
    fontSize: 16,
  },
  ctaContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.small,
  },
  secondaryButtonIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    padding: spacing.lg + 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    ...shadows.large,
    borderWidth: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  primaryButtonText: {
    ...typography.h2,
    color: colors.textInverse,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
  },
  primaryButtonSubtext: {
    ...typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.9,
    fontSize: 14,
  },
  arrowIcon: {
    fontSize: 24,
    color: colors.textInverse,
    fontWeight: 'bold',
  },
  quickLinksContainer: {
    marginBottom: spacing.xl,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  quickLinkIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  quickLinkText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

