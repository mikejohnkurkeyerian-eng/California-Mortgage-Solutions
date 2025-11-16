import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import PINEntryScreen from './PINEntryScreen';
import {
  getLoanId,
  hasSavedLoanId,
  isBiometricAvailable,
  verifyPin,
} from '../utils/secureStorage';

interface AuthGateProps {
  loanId: string;
  onAuthenticated: (loanId: string) => void;
  onCancel?: () => void;
}

export default function AuthGate({
  loanId,
  onAuthenticated,
  onCancel,
}: AuthGateProps) {
  const [showPINEntry, setShowPINEntry] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [authMethod, setAuthMethod] = useState<'pin' | 'biometric' | 'both'>(
    'pin',
  );

  useEffect(() => {
    checkAuthMethod();
  }, []);

  const checkAuthMethod = async () => {
    try {
      const hasSaved = await hasSavedLoanId();
      if (!hasSaved) {
        // No saved loan ID, allow access
        onAuthenticated(loanId);
        return;
      }

      const bioAvailable = await isBiometricAvailable();
      setBiometricAvailable(bioAvailable);

      // Try biometric first if available
      if (bioAvailable) {
        tryBiometric();
      } else {
        // Fall back to PIN
        setShowPINEntry(true);
      }
    } catch (error) {
      console.error('Error checking auth method:', error);
      // On error, allow access to not block user
      onAuthenticated(loanId);
    }
  };

  const tryBiometric = async () => {
    try {
      const savedLoanId = await getLoanId(undefined, true);
      if (savedLoanId && savedLoanId === loanId) {
        onAuthenticated(loanId);
      } else {
        // Biometric failed or loan ID doesn't match, try PIN
        setShowPINEntry(true);
      }
    } catch (error) {
      // Biometric cancelled or failed, show PIN entry
      setShowPINEntry(true);
    }
  };

  const handlePINComplete = async (pin: string) => {
    try {
      const isValid = await verifyPin(pin);
      if (isValid) {
        const savedLoanId = await getLoanId(pin, false);
        if (savedLoanId && savedLoanId === loanId) {
          onAuthenticated(loanId);
        } else {
          Alert.alert(
            'Error',
            'Loan ID mismatch. Please check your loan ID.',
          );
          if (onCancel) {
            onCancel();
          }
        }
      } else {
        Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
        setShowPINEntry(true); // Show PIN entry again
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      Alert.alert('Error', 'Failed to verify PIN. Please try again.');
      setShowPINEntry(true);
    }
  };

  const handleBiometricPress = () => {
    tryBiometric();
  };

  const handlePINCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (showPINEntry) {
    return (
      <PINEntryScreen
        title="Enter PIN"
        subtitle="Enter your 4-digit PIN to access your loan"
        onComplete={handlePINComplete}
        onCancel={handlePINCancel}
      />
    );
  }

  const biometricType =
    Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔒 Secure Access</Text>
        <Text style={styles.subtitle}>
          Authenticate to access your loan information
        </Text>

        {biometricAvailable && (
          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricPress}>
            <Text style={styles.biometricIcon}>🔐</Text>
            <Text style={styles.biometricText}>
              Use {biometricType}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.pinButton}
          onPress={() => setShowPINEntry(true)}>
          <Text style={styles.pinText}>Enter PIN</Text>
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  biometricButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  biometricIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  biometricText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  pinButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  pinText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
});

