# PowerShell script to create a test loan
# Run this from the broker-console directory or project root

$apiUrl = "http://localhost:4002/api/applications"

$loanData = @{
    borrowerId = "test-borrower-1"
    borrower = @{
        id = "test-borrower-1"
        firstName = "John"
        lastName = "Doe"
        email = "john.doe@example.com"
        phone = "555-123-4567"
        createdAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        updatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    }
    property = @{
        address = @{
            street = "123 Main Street"
            city = "San Francisco"
            state = "CA"
            zipCode = "94102"
            country = "USA"
        }
        propertyType = "SingleFamily"
        purchasePrice = 500000
        downPayment = 100000
        loanAmount = 400000
    }
    employment = @{
        status = "Employed"
        employerName = "Tech Corp Inc"
        jobTitle = "Software Engineer"
        startDate = "2020-01-15"
        monthlyIncome = 8000
        incomeType = "W2"
        employerAddress = @{
            street = "456 Business Blvd"
            city = "San Francisco"
            state = "CA"
            zipCode = "94105"
        }
    }
    loanType = "Conventional"
    loanPurpose = "Purchase"
    loanTerm = 360
    interestRate = 6.5
    assets = @(
        @{
            id = "asset-1"
            type = "Checking"
            institution = "First National Bank"
            accountNumber = "****1234"
            currentBalance = 25000
        }
    )
    debts = @(
        @{
            id = "debt-1"
            type = "AutoLoan"
            creditor = "Auto Finance Co"
            monthlyPayment = 450
            currentBalance = 12000
        }
    )
    documents = @(
        @{
            id = "doc-1"
            loanId = ""
            type = "DriverLicense"
            fileName = "drivers_license.pdf"
            fileSize = 245760
            mimeType = "application/pdf"
            uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
            uploadedBy = "test-borrower-1"
            storagePath = "/documents/drivers_license.pdf"
            verificationStatus = "Verified"
            verifiedBy = "system"
            verifiedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        }
        @{
            id = "doc-2"
            loanId = ""
            type = "PayStub"
            fileName = "paystub_jan_2024.pdf"
            fileSize = 128000
            mimeType = "application/pdf"
            uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
            uploadedBy = "test-borrower-1"
            storagePath = "/documents/paystub_jan_2024.pdf"
            verificationStatus = "Verified"
        }
        @{
            id = "doc-3"
            loanId = ""
            type = "BankStatement"
            fileName = "bank_statement_jan_2024.pdf"
            fileSize = 512000
            mimeType = "application/pdf"
            uploadedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
            uploadedBy = "test-borrower-1"
            storagePath = "/documents/bank_statement_jan_2024.pdf"
            verificationStatus = "Verified"
        }
    )
    status = "Draft"
    stage = "PreUnderwriting"
    debtToIncomeRatio = 0.36
    loanToValueRatio = 0.80
    createdAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    updatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json -Depth 10

Write-Host "Creating test loan..." -ForegroundColor Yellow
Write-Host "API URL: $apiUrl" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $loanData -ContentType "application/json"
    
    Write-Host "`n✅ Test loan created successfully!" -ForegroundColor Green
    Write-Host "`nLoan ID: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Borrower: $($response.data.borrower.firstName) $($response.data.borrower.lastName)" -ForegroundColor Cyan
    Write-Host "Loan Amount: `$$($response.data.property.loanAmount.ToString('N0'))" -ForegroundColor Cyan
    Write-Host "Stage: $($response.data.stage)" -ForegroundColor Cyan
    Write-Host "`n🌐 View in broker console: http://localhost:3000/dashboard" -ForegroundColor Yellow
    Write-Host "   Then click on the loan card to see the Review & Approve tab!" -ForegroundColor Gray
} catch {
    Write-Host "`n❌ Error creating test loan:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    
    Write-Host "`n💡 Make sure the loan-service is running on port 4002!" -ForegroundColor Yellow
    Write-Host "   Check: http://localhost:4002/health" -ForegroundColor Gray
}

