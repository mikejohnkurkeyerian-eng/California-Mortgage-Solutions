import React, {useState, useEffect} from 'react';
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

const API_BASE_URL = API_CONFIG.LOAN_SERVICE;

export default function LoanDetailScreen({route, navigation}: any) {
  const {loanId} = route.params;
  const [loan, setLoan] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanDetails();
  }, [loanId]);

  const fetchLoanDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/applications/${loanId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setLoan(data.data);
      } else {
        Alert.alert('Error', 'Failed to fetch loan details');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch loan details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOff = async () => {
    Alert.alert(
      'Sign Off Loan',
      'Are you sure you want to sign off and close this loan?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Off',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/api/applications/${loanId}/signoff`,
                {method: 'POST'},
              );
              const data = await response.json();

              if (data.success) {
                Alert.alert('Success', 'Loan signed off and closed successfully!');
                navigation.goBack();
              } else {
                Alert.alert(
                  'Error',
                  data.error?.message || 'Failed to sign off loan',
                );
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to sign off loan. Please try again.');
            }
          },
        },
      ],
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      Draft: '#6b7280',
      Submitted: '#3b82f6',
      PreUnderwriting: '#eab308',
      Underwriting: '#a855f7',
      Conditional: '#f97316',
      ClearToClose: '#22c55e',
      Closed: '#6b7280',
    };
    return colors[stage] || '#6b7280';
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading loan details...</Text>
      </View>
    );
  }

  if (!loan) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Loan not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.stageBadge,
              {backgroundColor: getStageColor(loan.stage) + '20'},
            ]}>
            <Text style={[styles.stageText, {color: getStageColor(loan.stage)}]}>
              {loan.stage}
            </Text>
          </View>
          <Text style={styles.loanId}>Loan ID: {loan.id}</Text>
        </View>

        {/* Borrower Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Borrower Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {loan.borrower.firstName} {loan.borrower.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{loan.borrower.email}</Text>
          </View>
          {loan.borrower.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{loan.borrower.phone}</Text>
            </View>
          )}
        </View>

        {/* Loan Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Amount</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(loan.property.loanAmount)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Type</Text>
            <Text style={styles.infoValue}>{loan.loanType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Purpose</Text>
            <Text style={styles.infoValue}>{loan.loanPurpose}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Loan Term</Text>
            <Text style={styles.infoValue}>{loan.loanTerm} months</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{loan.status}</Text>
          </View>
          {loan.interestRate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Interest Rate</Text>
              <Text style={styles.infoValue}>{loan.interestRate}%</Text>
            </View>
          )}
        </View>

        {/* Property Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>
              {loan.property.address.street}
              {'\n'}
              {loan.property.address.city}, {loan.property.address.state}{' '}
              {loan.property.address.zipCode}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property Type</Text>
            <Text style={styles.infoValue}>{loan.property.propertyType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Purchase Price</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(loan.property.purchasePrice)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Down Payment</Text>
            <Text style={styles.infoValue}>
              {formatCurrency(loan.property.downPayment)}
            </Text>
          </View>
        </View>

        {/* Employment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employment Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{loan.employment.status}</Text>
          </View>
          {loan.employment.employerName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employer</Text>
              <Text style={styles.infoValue}>
                {loan.employment.employerName}
              </Text>
            </View>
          )}
          {loan.employment.monthlyIncome && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Monthly Income</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(loan.employment.monthlyIncome)}
              </Text>
            </View>
          )}
        </View>

        {/* Underwriting Decision */}
        {loan.underwritingDecision && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Underwriting Decision</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Decision</Text>
              <Text style={styles.infoValue}>
                {loan.underwritingDecision}
              </Text>
            </View>
            {loan.underwritingConditions &&
              loan.underwritingConditions.length > 0 && (
                <View style={styles.conditionsContainer}>
                  <Text style={styles.conditionsTitle}>Conditions:</Text>
                  {loan.underwritingConditions.map(condition => (
                    <View key={condition.id} style={styles.conditionItem}>
                      <Text style={styles.conditionText}>
                        {condition.description}
                      </Text>
                      <Text
                        style={[
                          styles.conditionStatus,
                          condition.status === 'Satisfied'
                            ? styles.conditionSatisfied
                            : styles.conditionPending,
                        ]}>
                        {condition.status}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
          </View>
        )}

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Documents ({loan.documents.length})
          </Text>
          {loan.documents.length === 0 ? (
            <Text style={styles.noDocuments}>No documents uploaded</Text>
          ) : (
            <View style={styles.documentsList}>
              {loan.documents.map(doc => (
                <View key={doc.id} style={styles.documentItem}>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{doc.fileName}</Text>
                    <Text style={styles.documentType}>{doc.type}</Text>
                  </View>
                  <View
                    style={[
                      styles.verificationBadge,
                      doc.verificationStatus === 'Verified'
                        ? styles.verifiedBadge
                        : doc.verificationStatus === 'Rejected'
                        ? styles.rejectedBadge
                        : styles.pendingBadge,
                    ]}>
                    <Text
                      style={[
                        styles.verificationText,
                        doc.verificationStatus === 'Verified'
                          ? styles.verifiedText
                          : doc.verificationStatus === 'Rejected'
                          ? styles.rejectedText
                          : styles.pendingText,
                      ]}>
                      {doc.verificationStatus}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>{formatDate(loan.createdAt)}</Text>
          </View>
          {loan.submittedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Submitted</Text>
              <Text style={styles.infoValue}>
                {formatDate(loan.submittedAt)}
              </Text>
            </View>
          )}
          {loan.approvedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Approved</Text>
              <Text style={styles.infoValue}>
                {formatDate(loan.approvedAt)}
              </Text>
            </View>
          )}
          {loan.closedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Closed</Text>
              <Text style={styles.infoValue}>{formatDate(loan.closedAt)}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {loan.stage === 'ClearToClose' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.signOffButton}
              onPress={handleSignOff}>
              <Text style={styles.signOffButtonText}>
                Sign Off & Close Loan
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stageBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loanId: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  conditionsContainer: {
    marginTop: 12,
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  conditionText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  conditionStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionSatisfied: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  conditionPending: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 12,
    color: '#6b7280',
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: '#dcfce7',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedText: {
    color: '#16a34a',
  },
  rejectedText: {
    color: '#dc2626',
  },
  pendingText: {
    color: '#d97706',
  },
  noDocuments: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  signOffButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  signOffButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
