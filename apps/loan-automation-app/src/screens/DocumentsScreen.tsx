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
import DocumentChecklistScreen from './DocumentChecklistScreen';
import DocumentUploadScreen from './DocumentUploadScreen';

const API_BASE_URL = API_CONFIG.LOAN_SERVICE;
const DOCUMENT_API_URL = API_CONFIG.DOCUMENT_SERVICE;

interface RouteParams {
  loanId?: string;
  initialView?: 'checklist' | 'upload';
}

export default function DocumentsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  
  const [activeView, setActiveView] = useState<'checklist' | 'upload'>(
    params.initialView || 'checklist'
  );
  const [loanId, setLoanId] = useState<string>(params.loanId || '');

  useEffect(() => {
    if (params.loanId && params.loanId !== loanId) {
      setLoanId(params.loanId);
    }
    if (params.initialView) {
      setActiveView(params.initialView);
    }
  }, [params.loanId, params.initialView]);

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeView === 'checklist' && styles.tabActive]}
          onPress={() => setActiveView('checklist')}>
          <Text
            style={[
              styles.tabText,
              activeView === 'checklist' && styles.tabTextActive,
            ]}>
            ✅ Checklist
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeView === 'upload' && styles.tabActive]}
          onPress={() => setActiveView('upload')}>
          <Text
            style={[
              styles.tabText,
              activeView === 'upload' && styles.tabTextActive,
            ]}>
            📤 Upload
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {activeView === 'checklist' ? (
          <DocumentChecklistScreen key="checklist" />
        ) : (
          <DocumentUploadScreen key="upload" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
  },
});

