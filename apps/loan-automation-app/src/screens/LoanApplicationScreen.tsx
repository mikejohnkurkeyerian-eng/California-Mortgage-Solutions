import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {LoanApplication} from '@loan-platform/shared-types';
import {API_CONFIG} from '../config/api';
import {
  validateEmail,
  validatePhoneNumber,
  formatPhoneNumber,
  validateDateOfBirth,
  formatDateOfBirth,
  validateStreetAddress,
  validateCity,
  validateZipCode,
  validateEmployerName,
} from '../utils/validation';

const API_BASE_URL = API_CONFIG.LOAN_SERVICE;

interface FormData {
  // Borrower Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Property Info
  street: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  purchasePrice: string;
  downPayment: string;
  
  // Employment Info
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  monthlyIncome: string;
  incomeType: string;
  
  // Loan Info
  loanType: string;
  loanPurpose: string;
  loanTerm: string;
}

export default function LoanApplicationScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'SingleFamily',
    purchasePrice: '',
    downPayment: '',
    employmentStatus: 'Employed',
    employerName: '',
    jobTitle: '',
    monthlyIncome: '',
    incomeType: 'W2',
    loanType: 'Conventional',
    loanPurpose: 'Purchase',
    loanTerm: '360',
  });

  const updateField = (field: keyof FormData, value: string) => {
    // Auto-format phone number and date of birth
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    } else if (field === 'dateOfBirth') {
      value = formatDateOfBirth(value);
    }
    setFormData(prev => ({...prev, [field]: value}));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Info
        if (!formData.firstName || !formData.lastName) {
          Alert.alert('Validation Error', 'First name and last name are required');
          return false;
        }
        
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.valid) {
          Alert.alert('Validation Error', emailValidation.error || 'Invalid email');
          return false;
        }

        if (formData.phone) {
          const phoneValidation = validatePhoneNumber(formData.phone);
          if (!phoneValidation.valid) {
            Alert.alert('Validation Error', phoneValidation.error || 'Invalid phone number');
            return false;
          }
        } else {
          Alert.alert('Validation Error', 'Phone number is required');
          return false;
        }

        if (formData.dateOfBirth) {
          const dobValidation = validateDateOfBirth(formData.dateOfBirth);
          if (!dobValidation.valid) {
            Alert.alert('Validation Error', dobValidation.error || 'Invalid date of birth');
            return false;
          }
        } else {
          Alert.alert('Validation Error', 'Date of birth is required');
          return false;
        }

        return true;
      case 2: // Property Info
        const streetValidation = validateStreetAddress(formData.street);
        if (!streetValidation.valid) {
          Alert.alert('Validation Error', streetValidation.error || 'Invalid street address');
          return false;
        }

        const cityValidation = validateCity(formData.city);
        if (!cityValidation.valid) {
          Alert.alert('Validation Error', cityValidation.error || 'Invalid city');
          return false;
        }

        if (!formData.state || formData.state.length !== 2) {
          Alert.alert('Validation Error', 'State must be 2 letters (e.g., CA, NY)');
          return false;
        }

        const zipValidation = validateZipCode(formData.zipCode);
        if (!zipValidation.valid) {
          Alert.alert('Validation Error', zipValidation.error || 'Invalid ZIP code');
          return false;
        }

        if (!formData.purchasePrice || !formData.downPayment) {
          Alert.alert('Validation Error', 'Purchase price and down payment are required');
          return false;
        }

        const purchasePrice = parseFloat(formData.purchasePrice);
        const downPayment = parseFloat(formData.downPayment);
        if (isNaN(purchasePrice) || purchasePrice <= 0) {
          Alert.alert('Validation Error', 'Purchase price must be a valid positive number');
          return false;
        }
        if (isNaN(downPayment) || downPayment <= 0) {
          Alert.alert('Validation Error', 'Down payment must be a valid positive number');
          return false;
        }
        if (downPayment >= purchasePrice) {
          Alert.alert('Validation Error', 'Down payment must be less than purchase price');
          return false;
        }

        return true;
      case 3: // Employment Info
        if (!formData.employmentStatus || !formData.monthlyIncome) {
          Alert.alert('Validation Error', 'Employment status and monthly income are required');
          return false;
        }

        if (formData.employmentStatus === 'Employed') {
          const employerValidation = validateEmployerName(formData.employerName);
          if (!employerValidation.valid) {
            Alert.alert('Validation Error', employerValidation.error || 'Invalid employer name');
            return false;
          }
        }

        const monthlyIncome = parseFloat(formData.monthlyIncome);
        if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
          Alert.alert('Validation Error', 'Monthly income must be a valid positive number');
          return false;
        }

        return true;
      case 4: // Loan Info
        if (!formData.loanType || !formData.loanPurpose || !formData.loanTerm) {
          Alert.alert('Validation Error', 'Please fill in all required fields');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Navigate to confirmation screen instead of submitting directly
        navigation.navigate('Confirmation', {formData});
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Allow going back to any previous step or current step
    // Allow going forward only if previous steps are valid
    if (stepNumber <= currentStep) {
      // Going back - always allowed
      setCurrentStep(stepNumber);
    } else if (stepNumber === currentStep + 1) {
      // Going forward one step - validate current step first
      if (validateStep(currentStep)) {
        setCurrentStep(stepNumber);
      }
    } else if (stepNumber > currentStep + 1) {
      // Trying to skip ahead multiple steps - validate all intermediate steps
      let allStepsValid = true;
      for (let i = currentStep; i < stepNumber; i++) {
        if (!validateStep(i)) {
          allStepsValid = false;
          break;
        }
      }
      if (allStepsValid) {
        setCurrentStep(stepNumber);
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

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

      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanApplication),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success',
          `Loan application created successfully!\n\nLoan ID: ${data.data.id}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  dateOfBirth: '',
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  propertyType: 'SingleFamily',
                  purchasePrice: '',
                  downPayment: '',
                  employmentStatus: 'Employed',
                  employerName: '',
                  jobTitle: '',
                  monthlyIncome: '',
                  incomeType: 'W2',
                  loanType: 'Conventional',
                  loanPurpose: 'Purchase',
                  loanTerm: '360',
                });
                setCurrentStep(1);
              },
            },
          ],
        );
      } else {
        Alert.alert('Error', data.error?.message || 'Failed to create loan application');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderPropertyInfo();
      case 3:
        return renderEmploymentInfo();
      case 4:
        return renderLoanInfo();
      default:
        return null;
    }
  };

  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <Text style={styles.label}>First Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.firstName}
        onChangeText={value => updateField('firstName', value)}
        placeholder="Enter your first name"
      />

      <Text style={styles.label}>Last Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.lastName}
        onChangeText={value => updateField('lastName', value)}
        placeholder="Enter your last name"
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={value => updateField('email', value)}
        placeholder="your.email@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={value => updateField('phone', value)}
        placeholder="(555) 123-4567"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        value={formData.dateOfBirth}
        onChangeText={value => updateField('dateOfBirth', value)}
        placeholder="MM/DD/YYYY"
      />
    </View>
  );

  const renderPropertyInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Property Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about the property</Text>

      <Text style={styles.label}>Street Address *</Text>
      <TextInput
        style={styles.input}
        value={formData.street}
        onChangeText={value => updateField('street', value)}
        placeholder="123 Main Street"
      />

      <Text style={styles.label}>City *</Text>
      <TextInput
        style={styles.input}
        value={formData.city}
        onChangeText={value => updateField('city', value)}
        placeholder="San Francisco"
      />

      <Text style={styles.label}>State *</Text>
      <TextInput
        style={styles.input}
        value={formData.state}
        onChangeText={value => updateField('state', value)}
        placeholder="CA"
        maxLength={2}
        autoCapitalize="characters"
      />

      <Text style={styles.label}>ZIP Code *</Text>
      <TextInput
        style={styles.input}
        value={formData.zipCode}
        onChangeText={value => updateField('zipCode', value)}
        placeholder="94102"
        keyboardType="numeric"
        maxLength={5}
      />

      <Text style={styles.label}>Property Type *</Text>
      <View style={styles.radioGroup}>
        {['SingleFamily', 'Condo', 'Townhouse', 'MultiFamily'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.radioOption,
              formData.propertyType === type && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('propertyType', type)}>
            <Text
              style={[
                styles.radioText,
                formData.propertyType === type && styles.radioTextSelected,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Purchase Price *</Text>
      <TextInput
        style={styles.input}
        value={formData.purchasePrice}
        onChangeText={value => updateField('purchasePrice', value)}
        placeholder="500000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Down Payment *</Text>
      <TextInput
        style={styles.input}
        value={formData.downPayment}
        onChangeText={value => updateField('downPayment', value)}
        placeholder="100000"
        keyboardType="numeric"
      />

      {formData.purchasePrice && formData.downPayment && (
        <View style={styles.calculatedInfo}>
          <Text style={styles.calculatedLabel}>Loan Amount:</Text>
          <Text style={styles.calculatedValue}>
            ${(
              parseFloat(formData.purchasePrice) -
              parseFloat(formData.downPayment)
            ).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmploymentInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Employment & Income</Text>
      <Text style={styles.stepSubtitle}>Tell us about your employment</Text>

      <Text style={styles.label}>Employment Status *</Text>
      <View style={styles.radioGroup}>
        {['Employed', 'SelfEmployed', 'BusinessOwner', 'Retired'].map(
          status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.radioOption,
                formData.employmentStatus === status &&
                  styles.radioOptionSelected,
              ]}
              onPress={() => updateField('employmentStatus', status)}>
              <Text
                style={[
                  styles.radioText,
                  formData.employmentStatus === status &&
                    styles.radioTextSelected,
                ]}>
                {status.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {formData.employmentStatus === 'Employed' && (
        <>
          <Text style={styles.label}>Employer Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.employerName}
            onChangeText={value => updateField('employerName', value)}
            placeholder="Company Name"
          />

          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            value={formData.jobTitle}
            onChangeText={value => updateField('jobTitle', value)}
            placeholder="Your Job Title"
          />
        </>
      )}

      <Text style={styles.label}>Monthly Income *</Text>
      <TextInput
        style={styles.input}
        value={formData.monthlyIncome}
        onChangeText={value => updateField('monthlyIncome', value)}
        placeholder="8000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Income Type *</Text>
      <View style={styles.radioGroup}>
        {['W2', 'SelfEmployed', 'BusinessOwner'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.radioOption,
              formData.incomeType === type && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('incomeType', type)}>
            <Text
              style={[
                styles.radioText,
                formData.incomeType === type && styles.radioTextSelected,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderLoanInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Loan Details</Text>
      <Text style={styles.stepSubtitle}>Finalize your loan application</Text>

      <Text style={styles.label}>Loan Type *</Text>
      <View style={styles.radioGroup}>
        {['Conventional', 'FHA', 'VA', 'USDA'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.radioOption,
              formData.loanType === type && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('loanType', type)}>
            <Text
              style={[
                styles.radioText,
                formData.loanType === type && styles.radioTextSelected,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Loan Purpose *</Text>
      <View style={styles.radioGroup}>
        {['Purchase', 'Refinance', 'CashOut'].map(purpose => (
          <TouchableOpacity
            key={purpose}
            style={[
              styles.radioOption,
              formData.loanPurpose === purpose && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('loanPurpose', purpose)}>
            <Text
              style={[
                styles.radioText,
                formData.loanPurpose === purpose && styles.radioTextSelected,
              ]}>
              {purpose}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Loan Term (months) *</Text>
      <View style={styles.radioGroup}>
        {['180', '240', '360'].map(term => (
          <TouchableOpacity
            key={term}
            style={[
              styles.radioOption,
              formData.loanTerm === term && styles.radioOptionSelected,
            ]}
            onPress={() => updateField('loanTerm', term)}>
            <Text
              style={[
                styles.radioText,
                formData.loanTerm === term && styles.radioTextSelected,
              ]}>
              {term} months ({parseInt(term) / 12} years)
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Application Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Borrower:</Text>
          <Text style={styles.summaryValue}>
            {formData.firstName} {formData.lastName}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Loan Amount:</Text>
          <Text style={styles.summaryValue}>
            $
            {formData.purchasePrice && formData.downPayment
              ? (
                  parseFloat(formData.purchasePrice) -
                  parseFloat(formData.downPayment)
                ).toLocaleString()
              : '0'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Loan Type:</Text>
          <Text style={styles.summaryValue}>{formData.loanType}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[
          {step: 1, label: 'Personal'},
          {step: 2, label: 'Property'},
          {step: 3, label: 'Employment'},
          {step: 4, label: 'Loan'},
        ].map(({step, label}) => (
          <TouchableOpacity
            key={step}
            style={[
              styles.progressStepWrapper,
            ]}
            onPress={() => handleStepClick(step)}
            activeOpacity={0.7}>
            <View
              style={[
                styles.progressStep,
                step <= currentStep && styles.progressStepActive,
                step === currentStep && styles.progressStepCurrent,
              ]}>
              <Text
                style={[
                  styles.progressStepText,
                  step <= currentStep && styles.progressStepTextActive,
                ]}>
                {step}
              </Text>
            </View>
            <Text
              style={[
                styles.progressStepLabel,
                step <= currentStep && styles.progressStepLabelActive,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            disabled={loading}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Submit Application' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressStepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressStepActive: {
    backgroundColor: '#2563eb',
  },
  progressStepCurrent: {
    borderWidth: 3,
    borderColor: '#1d4ed8',
    transform: [{scale: 1.1}],
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressStepTextActive: {
    color: '#ffffff',
  },
  progressStepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
  },
  progressStepLabelActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    minWidth: 100,
  },
  radioOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  radioText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: '#ffffff',
  },
  calculatedInfo: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  calculatedLabel: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 4,
  },
  calculatedValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  summaryContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

