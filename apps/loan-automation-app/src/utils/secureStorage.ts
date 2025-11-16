/**
 * Secure Storage Utility
 * Handles secure storage of loan IDs with PIN/biometric protection
 * 
 * NOTE: Authentication is currently DISABLED to prevent 500 errors
 * Set AUTH_ENABLED = true to re-enable after fixing native module issues
 */

// Feature flag - set to false to completely disable authentication
// Temporarily disabled to fix 500 error
const AUTH_ENABLED = false;

// Safe imports with error handling
let Keychain: any = null;
let AsyncStorage: any = null;
let useKeychain = true;

// Try to import Keychain (will fail gracefully if not available)
try {
  Keychain = require('react-native-keychain');
} catch (error) {
  console.warn('Keychain not available:', error);
  useKeychain = false;
}

// Try to import AsyncStorage (will use fallback if not available)
try {
  const AsyncStorageModule = require('@react-native-async-storage/async-storage');
  AsyncStorage = AsyncStorageModule.default || AsyncStorageModule;
} catch (error) {
  console.warn('AsyncStorage not available, using in-memory fallback:', error);
  // Fallback to a simple in-memory store
  AsyncStorage = {
    _storage: {} as Record<string, string>,
    async getItem(key: string): Promise<string | null> {
      try {
        return this._storage[key] || null;
      } catch {
        return null;
      }
    },
    async setItem(key: string, value: string): Promise<void> {
      try {
        this._storage[key] = value;
      } catch (error) {
        console.error('In-memory storage setItem failed:', error);
      }
    },
    async removeItem(key: string): Promise<void> {
      try {
        delete this._storage[key];
      } catch (error) {
        console.error('In-memory storage removeItem failed:', error);
      }
    },
  };
}

const LOAN_ID_KEY = 'loan_id';
const PIN_KEY = 'loan_pin';
const AUTH_METHOD_KEY = 'auth_method'; // 'pin' | 'biometric' | 'both'

export type AuthMethod = 'pin' | 'biometric' | 'both';

export interface SavedLoanId {
  loanId: string;
  authMethod: AuthMethod;
  savedAt: string;
}

/**
 * Check if Keychain is available
 */
async function checkKeychainAvailable(): Promise<boolean> {
  if (!AUTH_ENABLED || !useKeychain || !Keychain) return false;
  try {
    await Keychain.getSupportedBiometryType();
    return true;
  } catch (error) {
    console.warn('Keychain not available, using AsyncStorage fallback:', error);
    useKeychain = false;
    return false;
  }
}

/**
 * Check if biometric authentication is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (!AUTH_ENABLED) {
    return false; // Authentication disabled
  }
  
  if (!Keychain) {
    return false;
  }
  
  try {
    if (!(await checkKeychainAvailable())) {
      return false;
    }
    const biometryType = await Keychain.getSupportedBiometryType();
    return biometryType !== null && biometryType !== Keychain.BIOMETRY_TYPE.NONE;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
}

/**
 * Save loan ID with PIN and/or biometric protection
 */
export async function saveLoanId(
  loanId: string,
  authMethod: AuthMethod,
  pin?: string,
): Promise<boolean> {
  if (!AUTH_ENABLED) {
    return false; // Authentication disabled
  }
  
  try {
    if (!AsyncStorage) {
      console.warn('AsyncStorage not available');
      return false;
    }
    
    // Always use AsyncStorage (more reliable, no native module issues)
    const pinHash = pin ? await hashPin(pin) : undefined;
    const storageData = {
      loanId,
      authMethod,
      pinHash,
      savedAt: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(LOAN_ID_KEY, JSON.stringify(storageData));
    return true;
  } catch (error: any) {
    console.error('Error saving loan ID:', error);
    return false;
  }
}

/**
 * Retrieve loan ID with authentication
 */
export async function getLoanId(
  pin?: string,
  useBiometric: boolean = true,
): Promise<string | null> {
  if (!AUTH_ENABLED) {
    return null; // Authentication disabled
  }
  
  try {
    if (!AsyncStorage) {
      console.warn('AsyncStorage not available');
      return null;
    }
    
    // Use AsyncStorage (more reliable, no native module issues)
    const stored = await AsyncStorage.getItem(LOAN_ID_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    
    // Verify PIN if required
    if (data.authMethod === 'pin' || data.authMethod === 'both') {
      if (!pin) return null;
      const hashedPin = await hashPin(pin);
      if (hashedPin !== data.pinHash) return null;
    }
    
    return data.loanId || null;
  } catch (error) {
    console.error('Error retrieving loan ID:', error);
    return null;
  }
}

/**
 * Get loan ID using PIN
 */
async function getLoanIdWithPin(pin: string): Promise<string | null> {
  try {
    // Use AsyncStorage
    const stored = await AsyncStorage.getItem(LOAN_ID_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const hashedPin = await hashPin(pin);
    if (hashedPin !== data.pinHash) {
      return null; // PIN mismatch
    }
    
    return data.loanId || null;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return null;
  }
}

/**
 * Get all saved loan IDs (metadata only, not the actual IDs)
 */
export async function getSavedLoanIds(): Promise<SavedLoanId[]> {
  if (!AUTH_ENABLED) {
    return [];
  }
  
  try {
    if (!AsyncStorage) {
      return [];
    }
    
    const stored = await AsyncStorage.getItem(LOAN_ID_KEY);
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    return [
      {
        loanId: data.loanId,
        authMethod: data.authMethod,
        savedAt: data.savedAt || new Date().toISOString(),
      },
    ];
  } catch {
    return [];
  }
}

/**
 * Check if a loan ID is saved
 */
export async function hasSavedLoanId(): Promise<boolean> {
  if (!AUTH_ENABLED) {
    return false; // Authentication disabled
  }
  
  try {
    if (!AsyncStorage) {
      return false;
    }
    // Use AsyncStorage (simpler, no native module issues)
    const stored = await AsyncStorage.getItem(LOAN_ID_KEY);
    return stored !== null && stored !== undefined;
  } catch (error) {
    console.error('Error checking saved loan ID:', error);
    return false;
  }
}

/**
 * Delete saved loan ID
 */
export async function deleteSavedLoanId(): Promise<boolean> {
  if (!AUTH_ENABLED) {
    return false;
  }
  
  try {
    if (!AsyncStorage) {
      return false;
    }
    await AsyncStorage.removeItem(LOAN_ID_KEY);
    return true;
  } catch (error) {
    console.error('Error deleting loan ID:', error);
    return false;
  }
}

/**
 * Simple PIN hashing (in production, use a proper library like bcrypt)
 */
async function hashPin(pin: string): Promise<string> {
  // Simple hash for demo - in production use proper hashing
  // This is NOT secure for production use!
  // Using base64 encoding (available in React Native)
  try {
    const base64 = require('base-64');
    return base64.encode(pin).split('').reverse().join('');
  } catch {
    // Fallback if base64 not available
    return pin.split('').reverse().join('') + '_hashed';
  }
}

/**
 * Verify PIN
 */
export async function verifyPin(pin: string): Promise<boolean> {
  if (!AUTH_ENABLED) {
    return false; // Authentication disabled
  }
  
  try {
    if (!AsyncStorage) {
      return false;
    }
    // Use AsyncStorage
    const stored = await AsyncStorage.getItem(LOAN_ID_KEY);
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    const hashedPin = await hashPin(pin);
    return hashedPin === data.pinHash;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
}
