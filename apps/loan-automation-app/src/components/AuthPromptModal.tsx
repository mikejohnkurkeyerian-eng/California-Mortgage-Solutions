import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import PINEntryScreen from './PINEntryScreen';
import {
  isBiometricAvailable,
  saveLoanId,
  type AuthMethod,
} from '../utils/secureStorage';

interface AuthPromptModalProps {
  visible: boolean;
  loanId: string;
  onSave: (authMethod: AuthMethod) => void;
  onCancel: () => void;
}

export default function AuthPromptModal({
  visible,
  loanId,
  onSave,
  onCancel,
}: AuthPromptModalProps) {
  const [showPINEntry, setShowPINEntry] = useState(false);
  const [pinMode, setPinMode] = useState<'enter' | 'confirm'>('enter');
  const [enteredPin, setEnteredPin] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [selectedAuthMethod, setSelectedAuthMethod] = useState<AuthMethod>('pin');

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    try {
      const available = await isBiometricAvailable();
      setBiometricAvailable(available);
    } catch (error) {
      console.error('Error checking biometric:', error);
      setBiometricAvailable(false);
    }
  };

  const handleBiometric = async () => {
    try {
      const success = await saveLoanId(loanId, 'biometric');
      if (success) {
        onSave('biometric');
      } else {
        Alert.alert('Error', 'Failed to save with biometric authentication');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  const handlePIN = () => {
    setSelectedAuthMethod('pin');
    setEnteredPin('');
    setPinMode('confirm');
    setShowPINEntry(true);
  };

  const handleBoth = () => {
    setSelectedAuthMethod('both');
    setEnteredPin('');
    setPinMode('confirm');
    setShowPINEntry(true);
  };

  const handlePINComplete = async (pin: string) => {
    if (pinMode === 'confirm') {
      // First time entering PIN - save it
      setEnteredPin(pin);
      setPinMode('enter');
      // Show confirmation
      setShowPINEntry(false);
      setTimeout(() => {
        setShowPINEntry(true);
      }, 100);
    } else {
      // Confirming PIN
      if (pin === enteredPin && enteredPin) {
        const success = await saveLoanId(loanId, selectedAuthMethod, enteredPin);
        if (success) {
          setShowPINEntry(false);
          setEnteredPin('');
          setPinMode('confirm');
          onSave(selectedAuthMethod);
        } else {
          Alert.alert('Error', 'Failed to save loan ID');
          setEnteredPin('');
          setPinMode('confirm');
        }
      } else {
        Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
        setEnteredPin('');
        setPinMode('confirm');
        setShowPINEntry(false);
        setTimeout(() => {
          setShowPINEntry(true);
        }, 100);
      }
    }
  };

  const handlePINCancel = () => {
    setShowPINEntry(false);
    setEnteredPin('');
    setPinMode('confirm');
  };

  if (showPINEntry) {
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={onCancel}>
        <PINEntryScreen
          title={pinMode === 'confirm' ? 'Create PIN' : 'Confirm PIN'}
          subtitle={
            pinMode === 'confirm'
              ? 'Enter a 4-digit PIN to secure your loan ID'
              : 'Re-enter your PIN to confirm'
          }
          mode={pinMode === 'confirm' ? 'confirm' : 'enter'}
          initialPin={enteredPin}
          onComplete={handlePINComplete}
          onCancel={handlePINCancel}
        />
      </Modal>
    );
  }

  const biometricType =
    Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Save Loan ID Securely?</Text>
          <Text style={styles.subtitle}>
            Would you like to save your loan ID and protect it with
            authentication?
          </Text>

          <View style={styles.options}>
            {biometricAvailable && (
              <TouchableOpacity
                style={styles.option}
                onPress={handleBiometric}>
                <Text style={styles.optionIcon}>🔐</Text>
                <Text style={styles.optionTitle}>
                  {biometricType}
                </Text>
                <Text style={styles.optionSubtitle}>
                  Quick and secure access
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.option} onPress={handlePIN}>
              <Text style={styles.optionIcon}>🔢</Text>
              <Text style={styles.optionTitle}>4-Digit PIN</Text>
              <Text style={styles.optionSubtitle}>
                Simple and reliable
              </Text>
            </TouchableOpacity>

            {biometricAvailable && (
              <TouchableOpacity style={styles.option} onPress={handleBoth}>
                <Text style={styles.optionIcon}>🛡️</Text>
                <Text style={styles.optionTitle}>Both</Text>
                <Text style={styles.optionSubtitle}>
                  {biometricType} + PIN for extra security
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  options: {
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
});

