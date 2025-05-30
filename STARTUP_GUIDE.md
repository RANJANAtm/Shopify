# 🚀 Frontend Startup Guide

## If you're getting "Cannot GET /" error, follow these steps:

### Step 1: Navigate to Frontend Directory
```bash
cd C:\Users\kbmst\Downloads\ecommerce\mern-ecommerce\frontend
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

### Step 4: Access the Application
- Frontend should be running on: http://localhost:5173
- Backend should be running on: http://localhost:5000

## Common Issues & Solutions:

### Issue 1: Port Already in Use
If you get "Port 5173 is already in use":
```bash
# Kill the process using the port
netstat -ano | findstr :5173
# Then kill the process ID shown
taskkill /PID <process_id> /F

# Or use a different port
npm run dev -- --port 3000
```

### Issue 2: Dependencies Not Installed
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Backend Not Running
Make sure backend is also running:
```bash
# In a separate terminal, go to backend
cd C:\Users\kbmst\Downloads\ecommerce\mern-ecommerce\backend
npm run dev
```

### Issue 4: Browser Cache
- Clear your browser cache
- Try opening in incognito/private mode
- Try a different browser

## Expected Output when Starting:
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

## Verification Steps:
1. ✅ Frontend running on http://localhost:5173
2. ✅ Backend running on http://localhost:5000
3. ✅ No console errors in browser
4. ✅ ModernCart homepage loads with modern design

## If Still Not Working:
1. Check Windows Firewall settings
2. Try running as Administrator
3. Check if antivirus is blocking the ports
4. Restart your computer and try again

---
💡 **Pro Tip**: Always run frontend and backend in separate terminal windows!
