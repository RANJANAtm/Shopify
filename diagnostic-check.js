#!/usr/bin/env node

// Quick diagnostic script to check if fixes are working
// Run with: node diagnostic-check.js

import fs from 'fs';
import path from 'path';

console.log('🔍 Ecommerce Project Diagnostic Check\n');

const checks = [];

// Check 1: Frontend environment file exists
try {
  const frontendEnvPath = './frontend/.env';
  if (fs.existsSync(frontendEnvPath)) {
    const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
    if (envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
      checks.push({ name: 'Frontend .env file', status: '✅ GOOD', details: 'Contains Stripe key' });
    } else {
      checks.push({ name: 'Frontend .env file', status: '❌ MISSING', details: 'No Stripe key found' });
    }
  } else {
    checks.push({ name: 'Frontend .env file', status: '❌ MISSING', details: 'File does not exist' });
  }
} catch (error) {
  checks.push({ name: 'Frontend .env file', status: '❌ ERROR', details: error.message });
}

// Check 2: Backend environment configuration
try {
  const backendEnvPath = './.env';
  if (fs.existsSync(backendEnvPath)) {
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    const nodeEnv = envContent.match(/NODE_ENV=(.+)/)?.[1];
    const hasStripeKey = envContent.includes('STRIPE_SECRET_KEY');
    
    if (nodeEnv === 'development' && hasStripeKey) {
      checks.push({ name: 'Backend .env file', status: '✅ GOOD', details: `NODE_ENV=${nodeEnv}, Stripe key present` });
    } else {
      checks.push({ name: 'Backend .env file', status: '⚠️ PARTIAL', details: `NODE_ENV=${nodeEnv}, Stripe key: ${hasStripeKey}` });
    }
  } else {
    checks.push({ name: 'Backend .env file', status: '❌ MISSING', details: 'File does not exist' });
  }
} catch (error) {
  checks.push({ name: 'Backend .env file', status: '❌ ERROR', details: error.message });
}

// Check 3: Currency Context updates
try {
  const currencyContextPath = './frontend/src/context/CurrencyContext.jsx';
  if (fs.existsSync(currencyContextPath)) {
    const content = fs.readFileSync(currencyContextPath, 'utf8');
    const hasLocalStorageCheck = content.includes('typeof window !== \'undefined\'');
    const hasDynamicRates = content.includes('exchangerate-api.com');
    
    if (hasLocalStorageCheck && hasDynamicRates) {
      checks.push({ name: 'Currency Context fixes', status: '✅ GOOD', details: 'localStorage safety and dynamic rates added' });
    } else {
      checks.push({ name: 'Currency Context fixes', status: '⚠️ PARTIAL', details: `localStorage: ${hasLocalStorageCheck}, Dynamic rates: ${hasDynamicRates}` });
    }
  } else {
    checks.push({ name: 'Currency Context fixes', status: '❌ MISSING', details: 'File does not exist' });
  }
} catch (error) {
  checks.push({ name: 'Currency Context fixes', status: '❌ ERROR', details: error.message });
}

// Check 4: Payment controller updates
try {
  const paymentControllerPath = './backend/controllers/payment.controller.js';
  if (fs.existsSync(paymentControllerPath)) {
    const content = fs.readFileSync(paymentControllerPath, 'utf8');
    const hasCurrencyHandling = content.includes('priceInUSD');
    const hasMetadata = content.includes('original_currency');
    
    if (hasCurrencyHandling && hasMetadata) {
      checks.push({ name: 'Payment Controller fixes', status: '✅ GOOD', details: 'Currency handling and metadata added' });
    } else {
      checks.push({ name: 'Payment Controller fixes', status: '⚠️ PARTIAL', details: `Currency handling: ${hasCurrencyHandling}, Metadata: ${hasMetadata}` });
    }
  } else {
    checks.push({ name: 'Payment Controller fixes', status: '❌ MISSING', details: 'File does not exist' });
  }
} catch (error) {
  checks.push({ name: 'Payment Controller fixes', status: '❌ ERROR', details: error.message });
}

// Check 5: OrderSummary Stripe key
try {
  const orderSummaryPath = './frontend/src/components/OrderSummary.jsx';
  if (fs.existsSync(orderSummaryPath)) {
    const content = fs.readFileSync(orderSummaryPath, 'utf8');
    const usesEnvVar = content.includes('import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY');
    
    if (usesEnvVar) {
      checks.push({ name: 'OrderSummary Stripe key', status: '✅ GOOD', details: 'Uses environment variable' });
    } else {
      checks.push({ name: 'OrderSummary Stripe key', status: '❌ HARDCODED', details: 'Still uses hardcoded key' });
    }
  } else {
    checks.push({ name: 'OrderSummary Stripe key', status: '❌ MISSING', details: 'File does not exist' });
  }
} catch (error) {
  checks.push({ name: 'OrderSummary Stripe key', status: '❌ ERROR', details: error.message });
}

// Check 6: Purchase Success Page improvements
try {
  const purchaseSuccessPath = './frontend/src/pages/PurchaseSuccessPage.jsx';
  if (fs.existsSync(purchaseSuccessPath)) {
    const content = fs.readFileSync(purchaseSuccessPath, 'utf8');
    const hasTimeout = content.includes('timeoutPromise');
    const hasErrorHandling = content.includes('NETWORK_ERROR');
    
    if (hasTimeout && hasErrorHandling) {
      checks.push({ name: 'Purchase Success improvements', status: '✅ GOOD', details: 'Timeout and error handling added' });
    } else {
      checks.push({ name: 'Purchase Success improvements', status: '⚠️ PARTIAL', details: `Timeout: ${hasTimeout}, Error handling: ${hasErrorHandling}` });
    }
  } else {
    checks.push({ name: 'Purchase Success improvements', status: '❌ MISSING', details: 'File does not exist' });
  }
} catch (error) {
  checks.push({ name: 'Purchase Success improvements', status: '❌ ERROR', details: error.message });
}

// Display results
console.log('📋 Diagnostic Results:\n');
checks.forEach((check, index) => {
  console.log(`${index + 1}. ${check.name}: ${check.status}`);
  console.log(`   ${check.details}\n`);
});

// Summary
const goodChecks = checks.filter(c => c.status.includes('✅')).length;
const totalChecks = checks.length;
const percentage = Math.round((goodChecks / totalChecks) * 100);

console.log(`\n📊 Summary: ${goodChecks}/${totalChecks} checks passed (${percentage}%)`);

if (percentage === 100) {
  console.log('🎉 All fixes appear to be in place! Ready for testing.');
} else if (percentage >= 80) {
  console.log('✅ Most fixes are in place. Review partial/failed checks above.');
} else {
  console.log('⚠️ Several issues detected. Please review the failed checks above.');
}

console.log('\n🚀 Next Steps:');
console.log('1. Run "npm run dev" to start the development server');
console.log('2. Test currency conversion on the homepage');
console.log('3. Test payment flow with Stripe test cards');
console.log('4. Check browser console for errors');
console.log('5. Review the Testing Guide for detailed test cases');
