FULL APPLICATION TEST SUITE
===========================

This folder contains a set of "fake" documents designed to test the full loan application flow.

Files included:
1. paystub.txt 
   - Triggers: "Overtime Income Detected" (Warning)
   - Matches: Pay Stubs (Last 30 Days)

2. w2_2023.txt
   - Matches: W-2 Forms (Last 2 Years)

3. w2_2022.txt
   - Matches: W-2 Forms (Last 2 Years)

4. bank_statement.txt
   - Triggers: "Large Deposit Detected" (Warning)
   - Matches: Bank Statements (Last 2 Months)

5. id_card.txt
   - Matches: Photo ID

6. tax_return_1040.txt
   - Matches: Tax Returns (1040)

7. form_1099.txt
   - Matches: 1099 Forms

8. asset_statement_401k.txt
   - Matches: Asset Statements (401k/IRA)

9. letter_of_explanation_nsf.txt
   - Matches: Letter of Explanation (Generic or Specific)

INSTRUCTIONS:
-------------
1. Go to the Borrower Dashboard.
2. Open your file explorer to this folder:
   d:\AI PROCCESS TEST\web\broker-console\public\test-docs\full_test_suite
3. Select ALL files (Ctrl+A).
4. Drag and drop them into the "Smart Document Upload" zone.
5. Watch as they are automatically sorted and insights are generated.
6. Once all requirements are met, click "Submit Application".
