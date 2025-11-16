import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';

interface PINEntryScreenProps {
  title?: string;
  subtitle?: string;
  onComplete: (pin: string) => void;
  onCancel?: () => void;
  mode?: 'enter' | 'confirm';
  initialPin?: string;
}

export default function PINEntryScreen({
  title = 'Enter PIN',
  subtitle = 'Enter your 4-digit PIN to continue',
  onComplete,
  onCancel,
  mode = 'enter',
  initialPin,
}: PINEntryScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>(
    mode === 'confirm' ? 'confirm' : 'enter',
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handlePinChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '');
    if (digit.length > 1) return;

    const newPin = pin.split('');
    newPin[index] = digit;
    const updatedPin = newPin.join('');

    setPin(updatedPin);

    // Auto-focus next input
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when 4 digits entered
    if (updatedPin.length === 4) {
      if (step === 'enter' && mode === 'confirm') {
        // Move to confirm step
        setStep('confirm');
        setConfirmPin('');
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      } else if (step === 'confirm') {
        // Verify PINs match
        if (initialPin && updatedPin === initialPin) {
          Keyboard.dismiss();
          onComplete(updatedPin);
        } else {
          Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
          setPin('');
          setConfirmPin('');
          setStep('enter');
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 100);
        }
      } else {
        // Single entry mode
        Keyboard.dismiss();
        onComplete(updatedPin);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const newPin = pin.split('');
    newPin[index] = '';
    setPin(newPin.join(''));
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const currentPin = step === 'confirm' ? confirmPin : pin;
  const displayTitle = step === 'confirm' ? 'Confirm PIN' : title;
  const displaySubtitle =
    step === 'confirm'
      ? 'Re-enter your PIN to confirm'
      : subtitle;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{displayTitle}</Text>
        <Text style={styles.subtitle}>{displaySubtitle}</Text>

        <View style={styles.pinContainer}>
          {[0, 1, 2, 3].map(index => (
            <TextInput
              key={index}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.pinInput,
                (step === 'confirm' ? confirmPin : pin)[index]
                  ? styles.pinInputFilled
                  : null,
              ]}
              value={(step === 'confirm' ? confirmPin : pin)[index] || ''}
              onChangeText={value => handlePinChange(value, index)}
              onKeyPress={({nativeEvent}) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              autoFocus={index === 0 && step === 'enter'}
            />
          ))}
        </View>

        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    fontSize: 24,
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
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 280,
    marginBottom: 32,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  pinInputFilled: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
});

