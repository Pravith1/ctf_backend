# Registration Data Setup

## 📋 Instructions

Place your registration Excel file here with the name: **`registrations.xlsx`**

## 📊 Required Excel Structure

Your Excel file must have the following columns:

### Headers:
- `Timestamp`
- `Name (Team Member 1)`, `Roll No`, `Year`, `Department`
- `Name (Team Member 2)`, `Roll No`, `Year`, `Department`
- `Name (Team Member 3)`, `Roll No`, `Year`, `Department`
- `Do You have previous experience in CTF`

### Example Data:
```
Timestamp | Name (Team Member 1) | Roll No | Year | Department | Name (Team Member 2) | Roll No | Year | Department | Name (Team Member 3) | Roll No | Year | Department | Do You have previous experience in CTF
----------|----------------------|---------|------|------------|----------------------|---------|------|------------|----------------------|---------|------|------------|-------------------------------------
10-5-2025 2:25:30 | ABOO TALIB KHAN | 24Z203 | II | CSE | AHAMED SHALMAN | 24Z207 | II | CSE | JALADHI SAI ANEESH | 24Z230 | II | CSE | Yes, I have attended CTF events
10-5-2025 8:06:18 | I Sreeman | 25Z329 | I | CSE | Kishore | 25Z337 | I | CSE | Jeevan | 25Z332 | I | CSE | No, This is my first CTF
```

## ⚠️ Important Notes

1. **File name must be exactly:** `registrations.xlsx`
2. **Column names must match** the structure above
3. **Roll numbers** can have any case (23n208 or 23N208) - system handles it
4. **Teams can have 1-3 members** - empty cells are okay
5. **Year format:** Can be Roman numerals (I, II, III, IV) or numbers (1, 2, 3, 4)

## 🔄 After Adding/Updating Excel File

**Restart the server** to reload the registration data:
```bash
npm start
```

The server will automatically load and cache the data on startup.

## ✅ Verification

When server starts, you should see:
```
📊 Loading registration data...
✅ Registration data loaded: X teams registered
```

If you see an error, check:
1. File exists at `data/registrations.xlsx`
2. File format is correct
3. Column names match exactly
