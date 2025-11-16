import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import type {DocumentType} from '@loan-platform/shared-types';
import {API_CONFIG} from '../config/api';
import AuthPromptModal from '../components/AuthPromptModal';
import AuthGate from '../components/AuthGate';
import {
  hasSavedLoanId,
  getLoanId,
  type AuthMethod,
} from '../utils/secureStorage';

const API_BASE_URL = API_CONFIG.DOCUMENT_SERVICE;

interface RouteParams {
  loanId?: string;
}

export default function DocumentUploadScreen() {
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  
  const [step, setStep] = useState<'loanId' | 'upload' | 'review' | 'submitted'>('loanId');
  const [uploading, setUploading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [classifiedFiles, setClassifiedFiles] = useState<any[]>([]);
  const [loanId, setLoanId] = useState<string>(params.loanId || '');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (params.loanId && params.loanId !== loanId) {
      setLoanId(params.loanId);
      if (params.loanId) {
        setStep('upload');
      }
    }
  }, [params.loanId]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      if (result && result.length > 0) {
        await uploadDocuments(result);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled
      } else {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleLoanIdSubmit = async () => {
    if (!loanId.trim()) {
      Alert.alert('Error', 'Please enter a loan ID');
      return;
    }

    try {
      // Check if we should prompt to save
      const hasSaved = await hasSavedLoanId();
      if (!hasSaved) {
        setShowAuthPrompt(true);
      } else {
        // Check if saved loan ID matches
        const savedLoanId = await getLoanId(undefined, false);
        if (savedLoanId === loanId) {
          // Show auth gate
          setShowAuthGate(true);
        } else {
          // Different loan ID, proceed
          setStep('upload');
        }
      }
    } catch (error) {
      console.error('Error checking saved loan ID:', error);
      // Continue anyway - don't block the user
      setStep('upload');
    }
  };

  const uploadDocuments = async (files: any[]) => {
    if (!loanId) {
      Alert.alert('Error', 'Please enter a loan ID first');
      return;
    }

    setUploading(true);

    try {
      const uploaded: any[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.type || 'application/pdf',
          name: file.name,
        } as any);
        formData.append('loanId', loanId);
        formData.append('documentType', 'Other'); // Will be classified later

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();

        if (data.success) {
          uploaded.push(data.data);
        } else {
          Alert.alert('Error', `Failed to upload ${file.name}`);
        }
      }

      if (uploaded.length > 0) {
        setUploadedFiles(prev => [...prev, ...uploaded]);
        setStep('review');
      }
    } catch (error) {
      Alert.alert('Error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      Alert.alert('Error', 'No documents to submit');
      return;
    }

    setClassifying(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/loan/${loanId}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setClassifiedFiles(data.data);
        setStep('submitted');
        Alert.alert(
          'Success!',
          `AI has classified ${data.data.length} document(s). They will now appear in your checklist.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Optionally navigate to checklist
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', data.error?.message || 'Failed to classify documents');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit documents for classification');
    } finally {
      setClassifying(false);
    }
  };

  // Step 1: Enter Loan ID
  if (step === 'loanId') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter Your Loan ID</Text>
          <Text style={styles.subtitle}>
            Please enter your loan ID to begin uploading documents
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Loan ID</Text>
            <TextInput
              style={styles.input}
              value={loanId}
              onChangeText={setLoanId}
              placeholder="Enter loan ID"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !loanId.trim() && styles.buttonDisabled]}
            onPress={handleLoanIdSubmit}
            disabled={!loanId.trim()}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          {/* Auth Prompt Modal - Only show if auth is enabled */}
          {showAuthPrompt && (
            <AuthPromptModal
              visible={showAuthPrompt}
              loanId={loanId}
              onSave={async (authMethod: AuthMethod) => {
                try {
                  setShowAuthPrompt(false);
                  setIsAuthenticated(true);
                  setStep('upload');
                } catch (error) {
                  console.error('Error in onSave:', error);
                  setShowAuthPrompt(false);
                  setStep('upload');
                }
              }}
              onCancel={() => {
                setShowAuthPrompt(false);
                // Continue without saving
                setStep('upload');
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
                  setStep('upload');
                }}
                onCancel={() => {
                  setShowAuthGate(false);
                }}
              />
            </Modal>
          )}
        </View>
      </ScrollView>
    );
  }

  // Step 2: Upload Documents
  if (step === 'upload') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Upload Documents</Text>
            <TouchableOpacity onPress={() => setStep('loanId')}>
              <Text style={styles.changeLoanId}>Change Loan ID</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Select multiple documents to upload. AI will automatically classify them.
          </Text>

          <View style={styles.loanIdDisplay}>
            <Text style={styles.loanIdLabel}>Loan ID:</Text>
            <Text style={styles.loanIdValue}>{loanId}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton, uploading && styles.buttonDisabled]}
            onPress={pickDocument}
            disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>📤</Text>
                <Text style={styles.buttonText}>Select Documents to Upload</Text>
              </>
            )}
          </TouchableOpacity>

          {uploadedFiles.length > 0 && (
            <View style={styles.uploadedContainer}>
              <Text style={styles.uploadedTitle}>
                Uploaded Documents ({uploadedFiles.length})
              </Text>
              {uploadedFiles.map((file, index) => (
                <View key={file.id || index} style={styles.fileItem}>
                  <Text style={styles.fileIcon}>📄</Text>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.fileName}</Text>
                    <Text style={styles.fileSize}>
                      {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.submitButton, uploading && styles.buttonDisabled]}
                onPress={() => setStep('review')}
                disabled={uploading}>
                <Text style={styles.submitButtonText}>Review & Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  // Step 3: Review and Submit
  if (step === 'review') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Review Documents</Text>
          <Text style={styles.subtitle}>
            Review your uploaded documents. AI will classify them automatically when you submit.
          </Text>

          <View style={styles.uploadedContainer}>
            <Text style={styles.uploadedTitle}>
              Ready to Submit ({uploadedFiles.length} documents)
            </Text>
            {uploadedFiles.map((file, index) => (
              <View key={file.id || index} style={styles.fileItem}>
                <Text style={styles.fileIcon}>📄</Text>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.fileName}</Text>
                  <Text style={styles.fileSize}>
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.aiInfoBox}>
            <Text style={styles.aiInfoTitle}>🤖 AI Classification</Text>
            <Text style={styles.aiInfoText}>
              Our AI will automatically analyze each document and classify it by type (Pay Stub, W-2, Bank Statement, etc.). The classified documents will then appear in your checklist.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setStep('upload')}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, classifying && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={classifying}>
              {classifying ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit for Classification</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Step 4: Submitted Successfully
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Documents Classified!</Text>
          <Text style={styles.successSubtitle}>
            AI has analyzed and classified {classifiedFiles.length} document(s)
          </Text>
        </View>

        <View style={styles.classifiedContainer}>
          <Text style={styles.classifiedTitle}>Classified Documents</Text>
          {classifiedFiles.map((file, index) => (
            <View key={file.id || index} style={styles.classifiedItem}>
              <Text style={styles.classifiedIcon}>📄</Text>
              <View style={styles.classifiedInfo}>
                <Text style={styles.classifiedFileName}>{file.fileName}</Text>
                <Text style={styles.classifiedType}>
                  Type: {file.type.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.nextStepsBox}>
          <Text style={styles.nextStepsTitle}>Next Steps</Text>
          <Text style={styles.nextStepsText}>
            ✓ Your documents have been classified{'\n'}
            ✓ They will appear in your checklist{'\n'}
            ✓ Switch to the Checklist tab to see them
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setStep('upload');
            setUploadedFiles([]);
            setClassifiedFiles([]);
          }}>
          <Text style={styles.buttonText}>Upload More Documents</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  changeLoanId: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  loanIdDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  loanIdLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
    fontWeight: '600',
  },
  loanIdValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 20,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#10b981',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadedContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  uploadedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  aiInfoBox: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  aiInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  aiInfoText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },
  successContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#86efac',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#15803d',
    textAlign: 'center',
  },
  classifiedContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  classifiedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  classifiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  classifiedIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  classifiedInfo: {
    flex: 1,
  },
  classifiedFileName: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  classifiedType: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  nextStepsBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 22,
  },
});

