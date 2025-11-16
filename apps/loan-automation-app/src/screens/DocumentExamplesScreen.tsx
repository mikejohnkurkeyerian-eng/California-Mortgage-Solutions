import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors, shadows, spacing, borderRadius, typography} from '../theme/colors';

interface Example {
  title: string;
  description: string;
  documents: string[];
  scenarios: {
    employment?: string;
    loanType?: string;
    propertyType?: string;
  };
}

const examples: Example[] = [
  {
    title: 'W-2 Employee, Conventional Loan',
    description: 'Traditional employment with standard loan',
    scenarios: {
      employment: 'Employed (W-2)',
      loanType: 'Conventional',
      propertyType: 'Single Family',
    },
    documents: [
      'Driver\'s License or State ID',
      'Pay Stubs (last 30 days)',
      'W-2 Forms (last 2 years)',
      'Bank Statements (last 2 months)',
      'Purchase Agreement',
      'Homeowner\'s Insurance Quote',
      '\nNote: Lender will obtain:\n• Credit report\n• Appraisal\n• Title report\n• Employment verification (VOE)\n• Tax transcripts\n• All loan forms (signed electronically)',
    ],
  },
  {
    title: 'Self-Employed, FHA Loan, Condo',
    description: 'Independent contractor with government-backed loan',
    scenarios: {
      employment: 'Self-Employed',
      loanType: 'FHA',
      propertyType: 'Condo',
    },
    documents: [
      'Driver\'s License or State ID',
      'Personal Tax Returns (1040s) - last 2 years with Schedule C',
      'Business Tax Returns - last 2 years',
      'Year-to-Date Profit & Loss Statement',
      'Bank Statements (last 2 months)',
      'Purchase Agreement',
      'Homeowner\'s Insurance Quote',
      'HOA Documents (if available)',
      '\nNote: Lender will obtain:\n• Credit report\n• FHA appraisal\n• Title report\n• FHA case number\n• All loan forms (signed electronically)',
    ],
  },
  {
    title: 'Business Owner, VA Loan, Multi-Family',
    description: 'Business owner using VA benefits for investment property',
    scenarios: {
      employment: 'Business Owner',
      loanType: 'VA',
      propertyType: 'Multi-Family',
    },
    documents: [
      'Driver\'s License or State ID',
      'Certificate of Eligibility (COE)',
      'DD-214 or Statement of Service',
      'Personal Tax Returns (1040s) - last 2 years',
      'Business Tax Returns (Form 1120S) - last 2 years',
      'Year-to-Date P&L Statement',
      'Bank Statements (last 2 months)',
      'Purchase Agreement',
      'Homeowner\'s Insurance Quote',
      '\nNote: Lender will obtain:\n• Credit report\n• VA appraisal\n• Title report\n• Rental income verification (if needed)\n• All loan forms (signed electronically)',
    ],
  },
  {
    title: 'Retired Borrower, Conventional Loan',
    description: 'Retired borrower using retirement income',
    scenarios: {
      employment: 'Retired',
      loanType: 'Conventional',
      propertyType: 'Single Family',
    },
    documents: [
      'Driver\'s License or State ID',
      'Tax Returns (1040s) - last 2 years showing retirement income',
      'Social Security Award Letter',
      'Pension Statements (if applicable)',
      'Bank Statements (last 2 months)',
      'Purchase Agreement',
      'Homeowner\'s Insurance Quote',
      '\nNote: Lender will obtain:\n• Credit report\n• Appraisal\n• Title report\n• Retirement account verification (if needed)\n• All loan forms (signed electronically)',
    ],
  },
];

export default function DocumentExamplesScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Document Requirements Examples</Text>
          <Text style={styles.subtitle}>
            See what documents are typically needed based on different borrower
            profiles and loan types
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            When you submit your loan application, our automated system analyzes
            your profile and generates a personalized checklist of required
            documents based on:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Your employment status</Text>
            <Text style={styles.bullet}>• Your income type (W-2, self-employed, etc.)</Text>
            <Text style={styles.bullet}>• Your loan type (Conventional, FHA, VA, USDA)</Text>
            <Text style={styles.bullet}>• Your property type (Single Family, Condo, etc.)</Text>
            <Text style={styles.bullet}>• Your assets and debts</Text>
          </View>
          <Text style={styles.infoText}>
            The examples below show typical document requirements for common
            scenarios. Your actual checklist will be personalized to your
            specific situation.
          </Text>
        </View>

        {examples.map((example, index) => (
          <TouchableOpacity
            key={index}
            style={styles.exampleCard}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}>
            <View style={styles.exampleHeader}>
              <View style={styles.exampleHeaderLeft}>
                <Text style={styles.exampleTitle}>{example.title}</Text>
                <Text style={styles.exampleDescription}>
                  {example.description}
                </Text>
                <View style={styles.scenarioTags}>
                  {example.scenarios.employment && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {example.scenarios.employment}
                      </Text>
                    </View>
                  )}
                  {example.scenarios.loanType && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {example.scenarios.loanType}
                      </Text>
                    </View>
                  )}
                  {example.scenarios.propertyType && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {example.scenarios.propertyType}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {expandedIndex === index ? '▼' : '▶'}
              </Text>
            </View>

            {expandedIndex === index && (
              <View style={styles.documentsList}>
                <Text style={styles.documentsTitle}>Required Documents:</Text>
                {example.documents.map((doc, docIndex) => (
                  <View key={docIndex} style={styles.documentItem}>
                    <Text style={styles.documentBullet}>•</Text>
                    <Text style={styles.documentText}>{doc}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>💡 Remember</Text>
          <Text style={styles.footerText}>
            After you submit your application, you'll receive an automated email
            and SMS with your personalized document checklist. You can also view
            your checklist anytime in your borrower portal.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.primaryLightest,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  infoTitle: {
    ...typography.h4,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  bulletList: {
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  bullet: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  exampleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exampleHeaderLeft: {
    flex: 1,
  },
  exampleTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exampleDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scenarioTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.primaryLightest,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  tagText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  documentsList: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  documentsTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  documentItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
    alignItems: 'flex-start',
  },
  documentBullet: {
    ...typography.bodySmall,
    color: colors.primary,
    marginRight: spacing.xs,
    fontWeight: 'bold',
  },
  documentText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  footerCard: {
    backgroundColor: colors.successLightest,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.successLight,
  },
  footerTitle: {
    ...typography.h4,
    color: colors.successDark,
    marginBottom: spacing.xs,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

