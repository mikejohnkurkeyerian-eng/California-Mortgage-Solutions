import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {colors, shadows, spacing, borderRadius, typography} from '../theme/colors';

interface BrokerHomeScreenProps {
  navigation: any;
}

export default function BrokerHomeScreen({navigation}: BrokerHomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💼</Text>
          </View>
          <Text style={styles.title}>Broker Console</Text>
          <Text style={styles.subtitle}>
            Manage your loan pipeline, review applications, and approve submissions
          </Text>
        </View>

        {/* Main CTA Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('BrokerDashboard')}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <Text style={styles.buttonIcon}>📊</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.primaryButtonText}>Open Dashboard</Text>
                <Text style={styles.primaryButtonSubtext}>
                  View and manage all loans
                </Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureText}>Pipeline</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✅</Text>
            <Text style={styles.featureText}>Approvals</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📈</Text>
            <Text style={styles.featureText}>Analytics</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
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
    backgroundColor: colors.secondaryLightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
    borderWidth: 3,
    borderColor: colors.secondaryLight,
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
  primaryButton: {
    width: '100%',
    padding: spacing.lg + 4,
    backgroundColor: colors.secondary,
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

