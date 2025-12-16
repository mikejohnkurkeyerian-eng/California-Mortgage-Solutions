# Highlight Missing Form Fields Implementation

## Overview
Implemented a visual highlighting feature for form insights. When a user clicks "Fix It" on an insight, they are navigated to the relevant section, and the specific fields requiring attention are visually highlighted with a pulsing amber border.

## Changes

### 1. Form Intelligence (`src/lib/form-intelligence.ts`)
- Updated `FormInsight` interface to include `targetFields` in the action payload.
- Updated analysis methods (`analyzeBorrowerInfo`, `analyzeEmployment`, `analyzeAssets`, `analyzeLiabilities`, `analyzeRealEstate`) to populate `targetFields` with specific dot-notation paths (e.g., `borrower.firstName`, `employment[0].monthlyIncome.base`).

### 2. Loan Application Page (`src/app/borrower/apply/page.tsx`)
- Added `highlightedFields` state (Set<string>) to track fields that need attention.
- Updated `handleInsightAction` to:
    - Navigate to the correct step.
    - Scroll to top.
    - Set `highlightedFields` based on the insight's `targetFields`.
- Added `handleFieldFocus` to remove highlighting when a user interacts with a field.
- Passed `highlightedFields` and `handleFieldFocus` to all child form components.

### 3. UI Components
- **`Input.tsx`**: Added `highlighted` prop. When true, applies `ring-2 ring-amber-500 border-amber-500 animate-pulse` styles.
- **Child Forms** (`AddressHistoryForm`, `EmploymentHistoryForm`, `AssetTable`, `LiabilityTable`, `RealEstateTable`):
    - Updated props to accept `highlightedFields` and `onFieldFocus`.
    - Mapped specific field paths (e.g., `currentAddress.street`, `assets[index].value`) to the `highlighted` prop of individual `Input` components.

### 4. Bug Fixes
- Fixed type errors in `LoanApplicationPage.tsx` where `highlighted` prop was incorrectly passed to native checkbox inputs.
- Added missing `CardDescription` export to `src/components/ui/Card.tsx` to fix build errors in Settings page.

## Verification
- **Build Status**: TypeScript errors in application code have been resolved. (Remaining errors in `verify-rules.ts` are unrelated to this feature).
- **Functionality**:
    - Clicking "Fix It" navigates to the correct section.
    - Specific fields are highlighted in amber.
    - Highlighting disappears when the user focuses the field.
