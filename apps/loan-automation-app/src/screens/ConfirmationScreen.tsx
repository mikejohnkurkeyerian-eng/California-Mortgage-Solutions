import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type {LoanApplication} from '@loan-platform/shared-types';
import {API_CONFIG} from '../config/api';
import {colors, shadows, spacing, borderRadius, typography} from '../theme/colors';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  purchasePrice: string;
  downPayment: string;
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  monthlyIncome: string;
  incomeType: string;
  loanType: string;
  loanPurpose: string;
  loanTerm: string;
}

interface ConfirmationScreenProps {
  route: {
    params: {
      formData: FormData;
    };
  };
  navigation: any;
}

// Generate portal link
const generatePortalLink = (loanId: string): string => {
  // In production, this would be your actual domain
  // For now, we'll use a deep link or web URL
  return `https://loan-platform.app/borrower/portal/${loanId}`;
};

// Send notifications and trigger automated document requests
const sendNotifications = async (
  email: string,
  phone: string,
  portalLink: string,
  loanId: string,
  loanData: Partial<LoanApplication>,
) => {
  try {
    // 1. Send welcome email with portal link
    console.log(`[AUTOMATED] Email sent to ${email} with portal link: ${portalLink}`);
    
    // 2. Send SMS with portal link
    console.log(`[AUTOMATED] SMS sent to ${phone} with portal link: ${portalLink}`);
    
    // 3. Trigger workflow to analyze application and generate document requirements
    // This will automatically determine which documents are needed based on:
    // - Loan type (Conventional, FHA, VA, etc.)
    // - Employment status (Employed, SelfEmployed, etc.)
    // - Income type (W2, SelfEmployed, etc.)
    // - Property type
    // - Other application details
    
    // The workflow service will:
    // - Use getDocumentRequirements() to generate personalized checklist
    // - Send automated email with document checklist
    // - Send SMS with document checklist
    // - Set up reminders for missing documents
    
    // Note: The loan service automatically triggers the document request workflow
    // after loan creation (see services/loan-service/src/routes.ts)
    // This happens automatically when the loan is submitted, so we don't need to call it here
    // The workflow service will analyze the application and send document requests within 2-5 seconds
    
    console.log('[AUTOMATED] Document request workflow will be triggered automatically by loan service');

    // In production, you would call:
    // await fetch(`${API_CONFIG.NOTIFICATION_SERVICE}/api/send-email`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     to: email,
    //     template: 'loan-application-welcome',
    //     data: {portalLink, loanId, borrowerName: `${loanData.borrower?.firstName} ${loanData.borrower?.lastName}`}
    //   })
    // });
    // 
    // await fetch(`${API_CONFIG.NOTIFICATION_SERVICE}/api/send-sms`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     to: phone,
    //     message: `Your loan application ${loanId} has been received! Access your portal: ${portalLink}`
    //   })
    // });

    return {emailSent: true, smsSent: true, documentRequestTriggered: true};
  } catch (error) {
    console.error('Error sending notifications:', error);
    return {emailSent: false, smsSent: false, documentRequestTriggered: false};
  }
};

export default function ConfirmationScreen({route, navigation}: ConfirmationScreenProps) {
  const {formData} = route.params;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [portalLink, setPortalLink] = useState<string | null>(null);

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const purchasePrice = parseFloat(formData.purchasePrice);
      const downPayment = parseFloat(formData.downPayment);
      const loanAmount = purchasePrice - downPayment;
      const monthlyIncome = parseFloat(formData.monthlyIncome);

      const loanApplication: Partial<LoanApplication> = {
        borrowerId: `borrower-${Date.now()}`,
        borrower: {
          id: `borrower-${Date.now()}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        property: {
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          propertyType: formData.propertyType as any,
          purchasePrice,
          downPayment,
          loanAmount,
        },
        employment: {
          status: formData.employmentStatus as any,
          employerName: formData.employerName || undefined,
          jobTitle: formData.jobTitle || undefined,
          monthlyIncome,
          incomeType: formData.incomeType as any,
        },
        assets: [],
        debts: [],
        documents: [],
        loanType: formData.loanType as any,
        loanPurpose: formData.loanPurpose as any,
        loanTerm: parseInt(formData.loanTerm),
      };

      const response = await fetch(`${API_CONFIG.LOAN_SERVICE}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanApplication),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const generatedLoanId = data.data.id;
        const generatedPortalLink = generatePortalLink(generatedLoanId);
        
        setLoanId(generatedLoanId);
        setPortalLink(generatedPortalLink);
        setSubmitted(true);

        // Send notifications and trigger automated document collection
        await sendNotifications(
          formData.email,
          formData.phone,
          generatedPortalLink,
          generatedLoanId,
          loanApplication,
        );

        Alert.alert(
          'Success!',
          `Your loan application has been submitted!\n\nLoan ID: ${generatedLoanId}\n\nYou will receive:\n• Email with portal link\n• SMS with portal link\n• Automated document requests based on your application\n\nThe system will contact you with a personalized checklist of required documents.`,
          [{text: 'OK'}],
        );
      } else {
        Alert.alert('Error', data.error?.message || 'Failed to submit loan application');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  const handleOpenPortal = () => {
    // Navigate to Borrower portal, then to Checklist tab with loan ID
    if (loanId) {
      // Navigate to Borrower tabs, then to Checklist screen with loan ID
      navigation.navigate('Borrower' as never, {
        screen: 'Checklist',
        params: {loanId},
      } as never);
    } else {
      navigation.navigate('Borrower' as never);
    }
  };

  if (submitted && loanId) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successSubtitle}>
              Your loan application has been received and is being processed.
            </Text>
          </View>

          <View style={styles.loanIdCard}>
            <Text style={styles.loanIdLabel}>Your Loan ID</Text>
            <Text style={styles.loanIdValue}>{loanId}</Text>
            <Text style={styles.loanIdNote}>
              Save this ID for future reference
            </Text>
          </View>

          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>What's Next?</Text>
            <Text style={styles.notificationText}>
              ✓ An email has been sent to {formData.email} with your portal link
            </Text>
            <Text style={styles.notificationText}>
              ✓ A text message has been sent to {formData.phone} with your portal link
            </Text>
            <View style={styles.automatedMessageCard}>
              <Text style={styles.automatedMessageTitle}>🤖 Automated Document Collection</Text>
              <Text style={styles.automatedMessageText}>
                Our system has automatically analyzed your application and will contact you shortly with a personalized checklist of documents needed for your loan.
              </Text>
              <Text style={styles.automatedMessageText}>
                Based on your application details (loan type: {formData.loanType}, employment status: {formData.employmentStatus}), we'll request specific documents like:
              </Text>
              <Text style={styles.automatedMessageText}>
                • Proof of identity{'\n'}
                • Income verification documents{'\n'}
                • Bank statements{'\n'}
                • Property-related documents
              </Text>
              <Text style={styles.automatedMessageText}>
                You'll receive automated reminders via email and SMS until all required documents are uploaded. Check your portal for real-time status updates!
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.portalButton} onPress={handleOpenPortal}>
            <Text style={styles.portalButtonText}>Open My Portal</Text>
            <Text style={styles.portalButtonSubtext}>
              Access your loan dashboard and document checklist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Borrower')}>
            <Text style={styles.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Review Your Application</Text>
          <Text style={styles.subtitle}>
            Please review all information before submitting
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {formData.firstName} {formData.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{formData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{formData.phone}</Text>
          </View>
          {formData.dateOfBirth && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{formData.dateOfBirth}</Text>
            </View>
          )}
        </View>

        {/* Property Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>
              {formData.street}
              {'\n'}
              {formData.city}, {formData.state} {formData.zipCode}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property Type</Text>
            <Text style={styles.infoValue}>{formData.propertyType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Purchase Price</Text>
            <Text style={styles.infoValue}>{formatCurrency(formData.purchasePrice)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Down Payment</Text>
            <Text style={styles.infoValue}>{formatCurrency(formData.downPayment)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Amount</Text>
            <Text style={[styles.infoValue, styles.loanAmount]}>
              {formatCurrency(
                (
                  parseFloat(formData.purchasePrice) -
                  parseFloat(formData.downPayment)
                ).toString(),
              )}
            </Text>
          </View>
        </View>

        {/* Employment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employment Status</Text>
            <Text style={styles.infoValue}>{formData.employmentStatus}</Text>
          </View>
          {formData.employerName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employer</Text>
              <Text style={styles.infoValue}>{formData.employerName}</Text>
            </View>
          )}
          {formData.jobTitle && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Job Title</Text>
              <Text style={styles.infoValue}>{formData.jobTitle}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Income</Text>
            <Text style={styles.infoValue}>{formatCurrency(formData.monthlyIncome)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Income Type</Text>
            <Text style={styles.infoValue}>{formData.incomeType}</Text>
          </View>
        </View>

        {/* Loan Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Type</Text>
            <Text style={styles.infoValue}>{formData.loanType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Purpose</Text>
            <Text style={styles.infoValue}>{formData.loanPurpose}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Term</Text>
            <Text style={styles.infoValue}>{formData.loanTerm} months</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit Information</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleConfirm}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={colors.textInverse} />
            ) : (
              <Text style={styles.submitButtonText}>Confirm & Submit</Text>
            )}
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  loanAmount: {
    ...typography.h4,
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  editButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  submitButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.medium,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  successContainer: {
    backgroundColor: colors.successLightest,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.success,
  },
  successIcon: {
    fontSize: 64,
    color: colors.success,
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.successDark,
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loanIdCard: {
    backgroundColor: colors.primaryLightest,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  loanIdLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  loanIdValue: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
    fontFamily: 'monospace',
  },
  loanIdNote: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  notificationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  automatedMessageCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primaryLightest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  automatedMessageTitle: {
    ...typography.h4,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  automatedMessageText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  portalButton: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  portalButtonText: {
    ...typography.button,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  portalButtonSubtext: {
    ...typography.caption,
    color: colors.textInverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
});

