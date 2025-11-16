import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import type {LoanApplication, LoanStage, ApplicationStatus} from '@loan-platform/shared-types';
import {colors, shadows, spacing, borderRadius, typography} from '../theme/colors';
import {API_CONFIG} from '../config/api';

const API_BASE_URL = API_CONFIG.LOAN_SERVICE;

interface LoanListItem {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  stage: LoanStage;
  status: ApplicationStatus;
  loanAmount: number;
  propertyAddress: string;
  createdAt: string;
  underwritingDecision?: string;
}

export default function DashboardScreen({navigation}: any) {
  const [loans, setLoans] = useState<LoanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStage, setFilterStage] = useState<LoanStage | ''>('');
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, [filterStage]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStage) params.append('stage', filterStage);

      const response = await fetch(`${API_BASE_URL}/api/applications?${params}`);
      const data = await response.json();

      if (data.success && data.data) {
        let loanList = data.data.items || data.data || [];

        const transformed = loanList.map((loan: LoanApplication) => ({
          id: loan.id,
          borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
          borrowerEmail: loan.borrower.email,
          stage: loan.stage,
          status: loan.status,
          loanAmount: loan.property.loanAmount,
          propertyAddress: `${loan.property.address.street}, ${loan.property.address.city}, ${loan.property.address.state}`,
          createdAt: loan.createdAt,
          underwritingDecision: loan.underwritingDecision,
        }));

        setLoans(transformed);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch loans');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchReadyForSignOff = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/applications/ready-for-signoff`,
      );
      const data = await response.json();

      if (data.success && data.data) {
        const transformed = data.data.map((loan: LoanApplication) => ({
          id: loan.id,
          borrowerName: `${loan.borrower.firstName} ${loan.borrower.lastName}`,
          borrowerEmail: loan.borrower.email,
          stage: loan.stage,
          status: loan.status,
          loanAmount: loan.property.loanAmount,
          propertyAddress: `${loan.property.address.street}, ${loan.property.address.city}, ${loan.property.address.state}`,
          createdAt: loan.createdAt,
          underwritingDecision: loan.underwritingDecision,
        }));
        setLoans(transformed);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch loans ready for sign-off');
    }
  };

  const handleSignOff = async (loanId: string) => {
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
                fetchLoans();
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

  const getStageColor = (stage: LoanStage) => {
    const stageColors: Record<LoanStage, string> = {
      Draft: colors.stageDraft,
      Submitted: colors.stageSubmitted,
      PreUnderwriting: colors.stagePreUnderwriting,
      Underwriting: colors.stageUnderwriting,
      Conditional: colors.stageConditional,
      ClearToClose: colors.stageClearToClose,
      Closed: colors.stageClosed,
    };
    return stageColors[stage] || colors.gray500;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredLoans = loans.filter(loan => {
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        loan.borrowerName.toLowerCase().includes(searchLower) ||
        loan.borrowerEmail.toLowerCase().includes(searchLower) ||
        loan.id.toLowerCase().includes(searchLower) ||
        loan.propertyAddress.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: loans.length,
    underwriting: loans.filter(l => l.stage === 'Underwriting').length,
    conditional: loans.filter(l => l.stage === 'Conditional').length,
    readyForSignOff: loans.filter(l => l.stage === 'ClearToClose').length,
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading loans...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchLoans} />
      }>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Loan Pipeline Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage and track loan applications
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Loans</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPurple]}>
            <Text style={[styles.statValue, {color: colors.stageUnderwriting}]}>
              {stats.underwriting}
            </Text>
            <Text style={styles.statLabel}>In Underwriting</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={[styles.statValue, {color: colors.stageConditional}]}>
              {stats.conditional}
            </Text>
            <Text style={styles.statLabel}>Conditional</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={[styles.statValue, {color: colors.stageClearToClose}]}>
              {stats.readyForSignOff}
            </Text>
            <Text style={styles.statLabel}>Ready for Sign-Off</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search loans..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#9ca3af"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStage === '' && styles.filterChipActive,
              ]}
              onPress={() => setFilterStage('')}>
              <Text
                style={[
                  styles.filterChipText,
                  filterStage === '' && styles.filterChipTextActive,
                ]}>
                All
              </Text>
            </TouchableOpacity>
            {(['Draft', 'Submitted', 'Underwriting', 'Conditional', 'ClearToClose'] as LoanStage[]).map(
              stage => (
                <TouchableOpacity
                  key={stage}
                  style={[
                    styles.filterChip,
                    filterStage === stage && styles.filterChipActive,
                  ]}
                  onPress={() => setFilterStage(stage)}>
                  <Text
                    style={[
                      styles.filterChipText,
                      filterStage === stage && styles.filterChipTextActive,
                    ]}>
                    {stage}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.readyButton}
            onPress={fetchReadyForSignOff}>
            <Text style={styles.readyButtonText}>Show Ready for Sign-Off</Text>
          </TouchableOpacity>
        </View>

        {/* Loans List */}
        {filteredLoans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No loans found</Text>
          </View>
        ) : (
          <View style={styles.loansList}>
            {filteredLoans.map(loan => (
              <TouchableOpacity
                key={loan.id}
                style={styles.loanCard}
                onPress={() => {
                  navigation.navigate('LoanDetail', {loanId: loan.id});
                }}>
                <View style={styles.loanCardHeader}>
                  <View style={styles.loanCardHeaderLeft}>
                    <Text style={styles.borrowerName}>
                      {loan.borrowerName}
                    </Text>
                    <Text style={styles.borrowerEmail}>{loan.borrowerEmail}</Text>
                  </View>
                  <View
                    style={[
                      styles.stageBadge,
                      {backgroundColor: getStageColor(loan.stage) + '20'},
                    ]}>
                    <Text
                      style={[
                        styles.stageText,
                        {color: getStageColor(loan.stage)},
                      ]}>
                      {loan.stage}
                    </Text>
                  </View>
                </View>

                <View style={styles.loanCardBody}>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Loan Amount:</Text>
                    <Text style={styles.loanInfoValue}>
                      {formatCurrency(loan.loanAmount)}
                    </Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Property:</Text>
                    <Text style={styles.loanInfoValue} numberOfLines={1}>
                      {loan.propertyAddress}
                    </Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Created:</Text>
                    <Text style={styles.loanInfoValue}>
                      {formatDate(loan.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.loanCardActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      navigation.navigate('LoanDetail', {loanId: loan.id});
                    }}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                  {loan.stage === 'ClearToClose' && (
                    <TouchableOpacity
                      style={styles.signOffButton}
                      onPress={() => handleSignOff(loan.id)}>
                      <Text style={styles.signOffButtonText}>Sign Off</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  statCardPurple: {
    backgroundColor: colors.secondaryLightest,
    borderColor: colors.stageUnderwriting,
  },
  statCardOrange: {
    backgroundColor: colors.warningLightest,
    borderColor: colors.stageConditional,
  },
  statCardGreen: {
    backgroundColor: colors.successLightest,
    borderColor: colors.stageClearToClose,
  },
  statValue: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  filterScroll: {
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.textInverse,
  },
  readyButton: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  readyButtonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  loansList: {
    gap: spacing.md,
  },
  loanCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  loanCardHeaderLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  borrowerName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  borrowerEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  stageBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  stageText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loanCardBody: {
    marginBottom: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  loanInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  loanInfoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  loanInfoValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  loanCardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  viewButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  viewButtonText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  signOffButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.small,
  },
  signOffButtonText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
