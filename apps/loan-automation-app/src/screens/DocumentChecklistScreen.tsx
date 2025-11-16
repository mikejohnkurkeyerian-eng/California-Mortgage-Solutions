import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import type {
  LoanApplication,
  DocumentType,
} from '@loan-platform/shared-types';
import {
  getDocumentRequirements,
  checkDocumentCompleteness,
  type DocumentRequirement,
} from '@loan-platform/shared-types';
import {API_CONFIG} from '../config/api';
import AuthPromptModal from '../components/AuthPromptModal';
import AuthGate from '../components/AuthGate';
import {
  hasSavedLoanId,
  getLoanId,
  type AuthMethod,
} from '../utils/secureStorage';

const API_BASE_URL = API_CONFIG.LOAN_SERVICE;
const DOCUMENT_API_URL = API_CONFIG.DOCUMENT_SERVICE;

interface RouteParams {
  loanId?: string;
}

export default function DocumentChecklistScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  
  const [loanId, setLoanId] = useState<string>(params.loanId || '');
  const [loan, setLoan] = useState<LoanApplication | null>(null);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [completeness, setCompleteness] = useState<{
    complete: boolean;
    missing: DocumentRequirement[];
  } | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchLoanAndChecklist = async (skipAuth: boolean = false) => {
    if (!loanId) {
      Alert.alert('Error', 'Please enter a loan ID');
      return;
    }

    // Check if loan ID is saved and requires authentication
    if (!skipAuth && !isAuthenticated) {
      try {
        const hasSaved = await hasSavedLoanId();
        if (hasSaved) {
          // Check if the saved loan ID matches
          const savedLoanId = await getLoanId(undefined, false);
          if (savedLoanId === loanId) {
            // Show auth gate
            setShowAuthGate(true);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Continue anyway - don't block the user
      }
    }

    setLoading(true);

    try {
      // Fetch loan
      const loanResponse = await fetch(`${API_BASE_URL}/api/applications/${loanId}`);
      
      if (!loanResponse.ok) {
        const errorText = await loanResponse.text();
        console.error('Loan fetch error:', loanResponse.status, errorText);
        Alert.alert(
          'Error',
          `Failed to fetch loan (Status: ${loanResponse.status}).\n\nMake sure:\n• Your backend services are running (pnpm start)\n• The loan ID is correct\n• The loan was created successfully`
        );
        setLoading(false);
        return;
      }

      const loanData = await loanResponse.json();

      if (!loanData.success || !loanData.data) {
        console.error('Loan data error:', loanData);
        Alert.alert(
          'Loan Not Found',
          `The loan ID "${loanId}" was not found.\n\nPossible reasons:\n• The loan service was restarted (loans are stored in memory)\n• The loan ID is incorrect\n• The loan was not created successfully\n\nTry submitting a new application or check the loan ID.`
        );
        setLoading(false);
        return;
      }

      const loanApp: LoanApplication = loanData.data;
      setLoan(loanApp);

      // Get document requirements
      const reqs = getDocumentRequirements(loanApp);
      setRequirements(reqs);

      // Check completeness
      const complete = checkDocumentCompleteness(loanApp, reqs);
      setCompleteness(complete);

      // Fetch documents to refresh
      const docsResponse = await fetch(
        `${DOCUMENT_API_URL}/api/loan/${loanId}`,
      );
      const docsData = await docsResponse.json();

      if (docsData.success && docsData.data) {
        loanApp.documents = docsData.data;
        setLoan({...loanApp});
        const updatedComplete = checkDocumentCompleteness(loanApp, reqs);
        setCompleteness(updatedComplete);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert(
        'Connection Error',
        `Failed to connect to the loan service.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nMake sure your backend services are running:\n• Run "pnpm start" in the project root\n• Check that loan-service is running on port 4002`
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-load checklist when loan ID is provided via route params
  useEffect(() => {
    if (params.loanId) {
      if (params.loanId !== loanId) {
        setLoanId(params.loanId);
      }
      // Auto-fetch the loan if we have an ID but no loan data yet
      if (params.loanId && !loan && !loading) {
        // Use a small delay to ensure state is updated
        const timer = setTimeout(() => {
          // Create a temporary function that uses the param directly
          const tempLoanId = params.loanId!;
          setLoanId(tempLoanId);
          // Fetch using the param directly
          fetch(`${API_BASE_URL}/api/applications/${tempLoanId}`)
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
              }
              const loanData = await response.json();
              if (loanData.success && loanData.data) {
                const loanApp: LoanApplication = loanData.data;
                setLoan(loanApp);
                const reqs = getDocumentRequirements(loanApp);
                setRequirements(reqs);
                const complete = checkDocumentCompleteness(loanApp, reqs);
                setCompleteness(complete);
              }
            })
            .catch((error) => {
              console.error('Auto-fetch error:', error);
            });
        }, 200);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.loanId]);

  const getDocumentStatus = (docType: DocumentType) => {
    if (!loan) return 'missing';
    const uploaded = loan.documents.some(doc => doc.type === docType);
    return uploaded ? 'uploaded' : 'missing';
  };

  const getStatusColor = (status: string, required: boolean) => {
    if (status === 'uploaded') return '#22c55e';
    if (required && status === 'missing') return '#ef4444';
    return '#6b7280';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'uploaded') return '✓';
    return '○';
  };

  const handleUploadDocument = async (documentType: DocumentType) => {
    if (!loanId) {
      Alert.alert('Error', 'Please enter a loan ID first');
      return;
    }

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        const file = result[0];
        await uploadDocument(file, documentType);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const uploadDocument = async (file: any, documentType: DocumentType) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });
      formData.append('loanId', loanId);
      formData.append('documentType', documentType);

      const response = await fetch(`${DOCUMENT_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Document uploaded successfully!');
        // Refresh the loan data
        await fetchLoanAndChecklist();
      } else {
        Alert.alert('Error', data.error?.message || 'Failed to upload document');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAll = () => {
    if (!loanId) {
      Alert.alert('Error', 'Please enter a loan ID first');
      return;
    }
    // Navigate to upload screen with loan ID
    navigation.navigate('Documents' as never, {loanId} as never);
  };

  useEffect(() => {
    if (loan) {
      const reqs = getDocumentRequirements(loan);
      setRequirements(reqs);
      const complete = checkDocumentCompleteness(loan, reqs);
      setCompleteness(complete);
    }
  }, [loan]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Document Checklist</Text>
            <TouchableOpacity
              style={styles.examplesButton}
              onPress={() => navigation.navigate('DocumentExamples' as never)}>
              <Text style={styles.examplesButtonText}>📋 Examples</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            See which documents you need to upload based on your loan profile
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Loan ID</Text>
          <TextInput
            style={styles.input}
            value={loanId}
            onChangeText={setLoanId}
            placeholder="Enter loan ID"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={async () => {
              try {
                // Check if we should prompt to save
                const hasSaved = await hasSavedLoanId();
                if (!hasSaved && loanId.trim()) {
                  setShowAuthPrompt(true);
                } else {
                  await fetchLoanAndChecklist();
                }
              } catch (error) {
                console.error('Error checking saved loan ID:', error);
                // Continue anyway - don't block the user
                await fetchLoanAndChecklist();
              }
            }}
            disabled={loading || !loanId}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.fetchButtonText}>Load Checklist</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Auth Prompt Modal - Only show if auth is enabled */}
        {showAuthPrompt && (
          <AuthPromptModal
            visible={showAuthPrompt}
            loanId={loanId}
            onSave={async (authMethod: AuthMethod) => {
              try {
                setShowAuthPrompt(false);
                setIsAuthenticated(true);
                await fetchLoanAndChecklist(true);
              } catch (error) {
                console.error('Error in onSave:', error);
                setShowAuthPrompt(false);
                fetchLoanAndChecklist(true);
              }
            }}
            onCancel={() => {
              setShowAuthPrompt(false);
              // Continue without saving
              fetchLoanAndChecklist(true);
            }}
          />
        )}

        {/* Auth Gate Modal */}
        {showAuthGate && (
          <Modal
            visible={showAuthGate}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setShowAuthGate(false)}>
            <AuthGate
              loanId={loanId}
              onAuthenticated={async (authenticatedLoanId: string) => {
                setShowAuthGate(false);
                setIsAuthenticated(true);
                setLoanId(authenticatedLoanId);
                await fetchLoanAndChecklist(true);
              }}
              onCancel={() => {
                setShowAuthGate(false);
              }}
            />
          </Modal>
        )}

        {completeness && (
          <View
            style={[
              styles.progressCard,
              completeness.complete && styles.progressCardComplete,
            ]}>
            <Text style={styles.progressTitle}>Document Progress</Text>
            <Text style={styles.progressText}>
              {requirements.length - completeness.missing.length} of{' '}
              {requirements.length} documents uploaded
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((requirements.length - completeness.missing.length) /
                        requirements.length) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            {completeness.complete && (
              <Text style={styles.completeMessage}>
                ✓ All required documents uploaded!
              </Text>
            )}
          </View>
        )}

        {loan && requirements.length > 0 && (
          <View style={styles.checklistContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Required Documents</Text>
              <TouchableOpacity
                style={styles.uploadAllButton}
                onPress={handleUploadAll}
                disabled={!loanId}>
                <Text style={styles.uploadAllButtonText}>📤 Upload All</Text>
              </TouchableOpacity>
            </View>
            {requirements
              .filter(req => req.required)
              .map((req, index) => {
                const status = getDocumentStatus(req.documentType);
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.checklistItem}
                    onPress={() => status !== 'uploaded' && handleUploadDocument(req.documentType)}
                    disabled={status === 'uploaded' || loading}>
                    <View style={styles.checklistItemLeft}>
                      <Text
                        style={[
                          styles.statusIcon,
                          {color: getStatusColor(status, req.required)},
                        ]}>
                        {getStatusIcon(status)}
                      </Text>
                      <View style={styles.checklistItemText}>
                        <Text style={styles.checklistItemTitle}>
                          {req.documentType.replace(/([A-Z])/g, ' $1').trim()}
                        </Text>
                        <Text style={styles.checklistItemDescription}>
                          {req.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.checklistItemRight}>
                      {status !== 'uploaded' && (
                        <TouchableOpacity
                          style={styles.uploadButton}
                          onPress={() => handleUploadDocument(req.documentType)}
                          disabled={loading}>
                          <Text style={styles.uploadButtonText}>Upload</Text>
                        </TouchableOpacity>
                      )}
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              getStatusColor(status, req.required) + '20',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            {color: getStatusColor(status, req.required)},
                          ]}>
                          {status === 'uploaded' ? 'Uploaded' : 'Missing'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

            {requirements.filter(req => !req.required).length > 0 && (
              <>
                <Text style={[styles.sectionTitle, {marginTop: 24}]}>
                  Optional Documents
                </Text>
                {requirements
                  .filter(req => !req.required)
                  .map((req, index) => {
                    const status = getDocumentStatus(req.documentType);
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.checklistItem}
                        onPress={() => handleUploadDocument(req.documentType)}
                        disabled={loading}>
                        <View style={styles.checklistItemLeft}>
                          <Text
                            style={[
                              styles.statusIcon,
                              {color: getStatusColor(status, req.required)},
                            ]}>
                            {getStatusIcon(status)}
                          </Text>
                          <View style={styles.checklistItemText}>
                            <Text style={styles.checklistItemTitle}>
                              {req.documentType.replace(/([A-Z])/g, ' $1').trim()}
                            </Text>
                            <Text style={styles.checklistItemDescription}>
                              {req.description}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.checklistItemRight}>
                          <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => handleUploadDocument(req.documentType)}
                            disabled={loading}>
                            <Text style={styles.uploadButtonText}>Upload</Text>
                          </TouchableOpacity>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  getStatusColor(status, req.required) + '20',
                              },
                            ]}>
                            <Text
                              style={[
                                styles.statusText,
                                {color: getStatusColor(status, req.required)},
                              ]}>
                              {status === 'uploaded' ? 'Uploaded' : 'Optional'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </>
            )}
          </View>
        )}

        {loan && completeness && !completeness.complete && (
          <View style={styles.missingContainer}>
            <Text style={styles.missingTitle}>Missing Documents</Text>
            {completeness.missing.map((req, index) => (
              <Text key={index} style={styles.missingItem}>
                • {req.documentType.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
            ))}
          </View>
        )}

        {!loan && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Enter a loan ID and click "Load Checklist" to see required
              documents
            </Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  examplesButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  examplesButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  fetchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  fetchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#fef3c7',
  },
  progressCardComplete: {
    borderColor: '#dcfce7',
    backgroundColor: '#f0fdf4',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  completeMessage: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 8,
  },
  checklistContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  uploadAllButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  uploadAllButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  checklistItemLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: 'bold',
  },
  checklistItemText: {
    flex: 1,
  },
  checklistItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  checklistItemDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  checklistItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  missingContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  missingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 12,
  },
  missingItem: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

