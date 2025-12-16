# 📁 Which Folders to Save Before Hard Wipe

## ✅ **MOST IMPORTANT: "AI PROCCESS TEST" Folder**

**This is the ACTIVE project we've been working on!**

Location: `C:\Users\Mike\Desktop\AI PROCCESS TEST\`

**Contains:**
- ✅ All the NEW features we just built:
  - Broker console with lender settings
  - Multi-lender support with AI selection
  - Automated loan processing
  - Condition generation
  - All the latest code

**SAVE THIS ONE!** 🔴 **CRITICAL**

---

## ⚠️ **Other Folders Status:**

### "AI-Broker" Folder
- ✅ Has `package.json` (looks like a project)
- ⚠️ **May be an older version** - Check if it has:
  - `services/loan-service/src/automation.ts` (NEW - latest version)
  - `web/broker-console/` (NEW - we just built this)
  - Multi-lender support

**Recommendation:** If it's older, you don't need it. If it's a different project, save it.

### "AI-Broker-backup" Folder
- ❌ No `package.json`
- ⚠️ **Probably not a working project** - Might be old backup files

**Recommendation:** Check what's in it. If it's just old files, you can skip it.

### "AI-Broker-clean" Folder
- ❌ No `package.json`
- ⚠️ **Probably not a working project** - Might be old files

**Recommendation:** Check what's in it. If it's just old files, you can skip it.

---

## 🎯 **My Recommendation:**

### **Must Save:**
1. ✅ **"AI PROCCESS TEST"** - This is your ACTIVE project with all new features!

### **Should Check:**
2. ⚠️ **"AI-Broker"** - Check if it has newer code or is a different project
   - If it has `automation.ts` and `web/broker-console/`, it might be the same as AI PROCCESS TEST
   - If it's older, skip it

### **Probably Skip:**
3. ❌ **"AI-Broker-backup"** - If it's just old backup files
4. ❌ **"AI-Broker-clean"** - If it's just old files

---

## 🔍 **Quick Check:**

Run this to see which has the latest features:

```powershell
# Check for latest features
$folders = @("AI PROCCESS TEST", "AI-Broker")
foreach ($folder in $folders) {
    $path = "C:\Users\Mike\Desktop\$folder"
    Write-Host "`n📁 $folder"
    if (Test-Path "$path\services\loan-service\src\automation.ts") {
        Write-Host "  ✅ Has automation.ts (latest)"
    }
    if (Test-Path "$path\services\loan-service\src\lender-selection.ts") {
        Write-Host "  ✅ Has lender-selection.ts (latest)"
    }
    if (Test-Path "$path\web\broker-console\src\components\LenderManagement.tsx") {
        Write-Host "  ✅ Has LenderManagement.tsx (latest)"
    }
    if (Test-Path "$path\web\broker-console\src\components\LenderComparison.tsx") {
        Write-Host "  ✅ Has LenderComparison.tsx (latest)"
    }
}
```

---

## ✅ **Final Answer:**

**If you save these 4 folders:**
- ✅ "AI PROCCESS TEST" - **SAVE THIS!** (Most important)
- ⚠️ "AI-Broker" - Check if it's the same as above (might be duplicate)
- ⚠️ "AI-Broker-backup" - Probably old backup (check first)
- ⚠️ "AI-Broker-clean" - Probably old files (check first)

**You should be ALRIGHT if:**
1. ✅ "AI PROCCESS TEST" is saved (this is your main project!)
2. ⚠️ The other folders might be duplicates or old backups

**To be SAFE:**
- Save "AI PROCCESS TEST" (most important!)
- If unsure, save all 4 folders (can't hurt)
- After hard wipe, check which one has the latest code

---

## 🎯 **Best Approach:**

1. **Save "AI PROCCESS TEST"** (the one we've been working on)
2. **Quickly check** the other 3 folders - see what's in them
3. **If they're duplicates/old**, skip them to save space
4. **If unsure**, save all 4 (better safe than sorry!)

**The "AI PROCCESS TEST" folder is definitely the one you need!** ✅

