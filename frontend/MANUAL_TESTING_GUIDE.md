# 🧪 Frontend-Backend Cart Integration - Manual Testing Guide

## 🎯 Overview

This guide provides step-by-step instructions to manually test the complete cart functionality between the frontend and backend.

## 🚀 Prerequisites

- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:5173`
- Browser with developer tools open

## 📋 Test Scenarios

### 1. **Authentication & Cart Initialization**

**Objective**: Verify user authentication and cart creation

**Steps**:

1. Open `http://localhost:5173` in browser
2. Navigate to Sign In page
3. Create a new account or sign in with existing credentials
4. Verify user is redirected to dashboard/home
5. Check browser console for any authentication errors

**Expected Results**:

- ✅ User successfully authenticated
- ✅ JWT token stored in localStorage
- ✅ No authentication errors in console

---

### 2. **Product Browsing & Add to Cart**

**Objective**: Test adding products to cart from product pages

**Steps**:

1. Navigate to products page or product detail page
2. Find a product that's in stock
3. Click "Add to Cart" button
4. Verify cart count updates in header
5. Check browser console for API calls

**Expected Results**:

- ✅ Product added to cart successfully
- ✅ Cart count updates in real-time
- ✅ Success message displayed
- ✅ API call to `/api/cart/items` made successfully

---

### 3. **Cart Page Functionality**

**Objective**: Test all cart page operations

**Steps**:

1. Navigate to cart page (`/cart`)
2. Verify all added items are displayed
3. Test quantity updates:
   - Increase quantity using + button
   - Decrease quantity using - button
   - Verify total updates in real-time
4. Test remove item functionality
5. Test clear cart functionality

**Expected Results**:

- ✅ All cart items displayed correctly
- ✅ Quantity updates work and reflect in totals
- ✅ Remove item works
- ✅ Clear cart works
- ✅ Real-time price calculations

---

### 4. **Coupon System**

**Objective**: Test coupon application and removal

**Steps**:

1. Add items to cart
2. Navigate to cart page
3. Enter coupon code: `SAVE10`
4. Click "Apply Coupon"
5. Verify discount is applied
6. Test removing coupon
7. Test invalid coupon codes

**Expected Results**:

- ✅ Valid coupon applies discount correctly
- ✅ Invalid coupon shows error message
- ✅ Coupon removal works
- ✅ Total calculations update correctly

---

### 5. **Error Handling**

**Objective**: Test error scenarios and user feedback

**Steps**:

1. Try to add out-of-stock product
2. Try to add invalid product ID
3. Try to update quantity beyond stock limit
4. Test with expired/invalid JWT token
5. Test network errors (disconnect internet)

**Expected Results**:

- ✅ Appropriate error messages displayed
- ✅ UI doesn't crash on errors
- ✅ Graceful fallback to localStorage when needed
- ✅ User-friendly error notifications

---

### 6. **Checkout Flow**

**Objective**: Test complete checkout process

**Steps**:

1. Add items to cart
2. Navigate to checkout page
3. Fill in shipping information
4. Select payment method
5. Verify order summary
6. Test form validation

**Expected Results**:

- ✅ Checkout page loads with cart items
- ✅ Form validation works
- ✅ Order summary displays correctly
- ✅ Payment method selection works

---

### 7. **Cross-Browser Testing**

**Objective**: Ensure functionality works across browsers

**Steps**:

1. Test in Chrome
2. Test in Firefox
3. Test in Safari
4. Test in Edge
5. Test on mobile browsers

**Expected Results**:

- ✅ All functionality works consistently
- ✅ Responsive design works
- ✅ No browser-specific issues

---

### 8. **Performance Testing**

**Objective**: Test cart performance with large datasets

**Steps**:

1. Add 10+ items to cart
2. Test cart page loading time
3. Test quantity updates with many items
4. Test search/filter functionality

**Expected Results**:

- ✅ Cart page loads quickly (< 2 seconds)
- ✅ Quantity updates are responsive
- ✅ No performance degradation with many items

---

## 🔧 Developer Tools Testing

### Network Tab

1. Open browser developer tools
2. Go to Network tab
3. Perform cart operations
4. Verify API calls:
   - `GET /api/cart` - Retrieve cart
   - `POST /api/cart/items` - Add item
   - `PUT /api/cart/items/:id` - Update quantity
   - `DELETE /api/cart/items/:id` - Remove item
   - `POST /api/cart/coupon` - Apply coupon
   - `DELETE /api/cart/coupon` - Remove coupon

### Console Tab

1. Check for any JavaScript errors
2. Verify authentication status
3. Check for API response errors
4. Monitor localStorage operations

### Application Tab

1. Check localStorage for:
   - JWT token
   - Cart data (fallback)
   - User preferences
2. Verify session storage
3. Check cookies if used

---

## 🐛 Common Issues & Solutions

### Issue: Cart not updating

**Solution**: Check authentication token and API calls

### Issue: Products not loading

**Solution**: Verify backend server is running

### Issue: Coupon not applying

**Solution**: Check coupon code and cart total

### Issue: Quantity not updating

**Solution**: Verify product stock and API response

---

## 📊 Success Criteria

### ✅ All tests pass

- Authentication works
- Cart operations work
- Coupon system works
- Error handling works
- Performance is acceptable

### ✅ User Experience

- Smooth interactions
- Clear feedback
- No broken functionality
- Responsive design

### ✅ Technical Requirements

- API integration working
- Real-time updates
- Error handling
- localStorage fallback

---

## 🎉 Completion Checklist

- [ ] Authentication tested
- [ ] Add to cart tested
- [ ] Cart page tested
- [ ] Quantity updates tested
- [ ] Coupon system tested
- [ ] Error handling tested
- [ ] Checkout flow tested
- [ ] Cross-browser tested
- [ ] Performance tested
- [ ] Developer tools verified

---

## 📞 Support

If you encounter issues during testing:

1. Check browser console for errors
2. Verify backend server is running
3. Check network connectivity
4. Review API documentation
5. Contact development team

---

**🎯 Goal**: Ensure seamless cart functionality between frontend and backend for optimal user experience!
