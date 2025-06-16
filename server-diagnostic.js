#!/usr/bin/env node

// Server diagnostic and startup helper
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 MERN Ecommerce Server Diagnostic\n');

// Check if we're in the right directory
const requiredFiles = [
    'backend/server.js',
    'package.json',
    '.env',
    'frontend/package.json'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
    console.log('\n❌ Missing required files. Make sure you\'re in the project root directory.');
    process.exit(1);
}

// Check environment variables
console.log('\n🔧 Checking environment configuration...');
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const requiredEnvVars = ['MONGO_URI', 'STRIPE_SECRET_KEY', 'ACCESS_TOKEN_SECRET'];
    
    requiredEnvVars.forEach(envVar => {
        const exists = envContent.includes(envVar);
        console.log(`${exists ? '✅' : '❌'} ${envVar}`);
    });
} catch (error) {
    console.log('❌ Could not read .env file');
}

// Check frontend env
console.log('\n🔧 Checking frontend environment...');
try {
    const frontendEnvContent = fs.readFileSync('frontend/.env', 'utf8');
    const hasStripeKey = frontendEnvContent.includes('VITE_STRIPE_PUBLISHABLE_KEY');
    console.log(`${hasStripeKey ? '✅' : '❌'} VITE_STRIPE_PUBLISHABLE_KEY`);
} catch (error) {
    console.log('❌ Could not read frontend/.env file');
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasDevScript = packageJson.scripts && packageJson.scripts.dev;
    const hasStartScript = packageJson.scripts && packageJson.scripts.start;
    
    console.log(`${hasDevScript ? '✅' : '❌'} dev script`);
    console.log(`${hasStartScript ? '✅' : '❌'} start script`);
} catch (error) {
    console.log('❌ Could not read package.json');
}

console.log('\n🚀 Next steps:');
console.log('1. Run: npm install (to install dependencies)');
console.log('2. Run: cd frontend && npm install (to install frontend dependencies)');
console.log('3. Run: npm run dev (to start backend server)');
console.log('4. In new terminal: cd frontend && npm run dev (to start frontend)');
console.log('5. Access: http://localhost:5173 (not http://localhost:5000)');

console.log('\n💡 Quick start option:');
console.log('Double-click start-servers.bat to start both servers automatically');
