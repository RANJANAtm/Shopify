# 🛠️ Debug Guide for Cart Issues

## Current Status:
✅ Backend running on http://localhost:5000
✅ MongoDB connected
❌ Cart controller error fixed

## Testing Steps:

### 1. Test Backend Endpoints Directly

You can test the backend directly using these URLs in your browser or Postman:

```bash
# Test if server is running
GET http://localhost:5000/api/products

# Test cart (requires authentication)
GET http://localhost:5000/api/cart
```

### 2. Start Frontend Server

```bash
cd C:\Users\kbmst\Downloads\ecommerce\mern-ecommerce\frontend
npm run dev
```

### 3. Test Authentication Flow

1. Go to http://localhost:5173
2. Sign up for a new account or login
3. Try adding a product to cart

### 4. If Still Getting Errors

Check browser console for detailed error messages:
- Press F12 in browser
- Go to Console tab
- Look for red error messages
- Check Network tab for failed requests

## Common Issues & Solutions:

### Issue: "Cannot read properties of null"
- **Cause**: User has invalid cart data in database
- **Solution**: The updated controller now handles this

### Issue: CORS errors
- **Cause**: Frontend and backend on different ports
- **Solution**: Manual CORS headers added to server.js

### Issue: Authentication errors
- **Cause**: User not logged in or token expired
- **Solution**: Make sure to login/signup first

### Issue: Database connection
- **Cause**: MongoDB URI invalid or network issues
- **Solution**: Check .env file and internet connection

## Expected Behavior:

1. ✅ User can signup/login
2. ✅ Products display on homepage
3. ✅ "Add to Cart" button works without errors
4. ✅ Cart page shows added items
5. ✅ Quantity can be updated
6. ✅ Items can be removed from cart

## Debug Commands:

```bash
# Check if both servers are running
netstat -an | findstr :5000
netstat -an | findstr :5173

# Restart backend with clean logs
npm run dev

# Check MongoDB connection
# Look for "MongoDB connected" message in backend logs
```

---
📞 **Next Steps:** Start the frontend server and test the cart functionality!
