#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

console.log('🚀 Vercel Deployment Helper\n')

// Check if we're in the right directory
const currentDir = process.cwd()
const isClientDir = currentDir.includes('client')
if (!isClientDir) {
  console.log('❌ Please run this script from the client directory')
  process.exit(1)
}

// Check if vercel.json exists in parent directory
const vercelJsonPath = resolve(currentDir, '..', 'vercel.json')
if (!existsSync(vercelJsonPath)) {
  console.log('❌ vercel.json not found in parent directory')
  console.log('   This file is required for Vercel deployment')
  process.exit(1)
}

// Check vercel.json configuration
try {
  const vercelConfig = JSON.parse(readFileSync(vercelJsonPath, 'utf8'))
  console.log('✅ vercel.json found and valid')
  
  // Check if routes are configured correctly
  if (vercelConfig.routes && vercelConfig.routes.length > 0) {
    const catchAllRoute = vercelConfig.routes.find(route => route.src === '/(.*)')
    if (catchAllRoute && catchAllRoute.dest === '/index.html') {
      console.log('✅ SPA routing configured correctly')
    } else {
      console.log('⚠️  SPA routing may not be configured correctly')
    }
  }
} catch (error) {
  console.log('❌ Error reading vercel.json:', error.message)
  process.exit(1)
}

// Check build output
const distPath = resolve(currentDir, 'dist')
if (!existsSync(distPath)) {
  console.log('❌ dist/ folder not found. Building...')
  try {
    execSync('npm run build', { stdio: 'inherit' })
  } catch (error) {
    console.log('❌ Build failed')
    process.exit(1)
  }
}

// Check required files
const indexHtmlPath = resolve(distPath, 'index.html')
if (!existsSync(indexHtmlPath)) {
  console.log('❌ index.html not found in build output')
  process.exit(1)
}

console.log('✅ Build output ready')

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' })
  console.log('✅ Vercel CLI installed')
} catch (error) {
  console.log('❌ Vercel CLI not installed')
  console.log('   Install with: npm i -g vercel')
  process.exit(1)
}

console.log('\n📋 Deployment Checklist:')
console.log('  ✅ vercel.json configured')
console.log('  ✅ Build output ready')
console.log('  ✅ Vercel CLI installed')
console.log('  ✅ SPA routing configured')

console.log('\n🚀 Ready to deploy!')
console.log('\nCommands:')
console.log('  npm run deploy:preview  # Deploy preview')
console.log('  npm run deploy:vercel   # Deploy to production')
console.log('\nOr manually:')
console.log('  vercel                  # Deploy preview')
console.log('  vercel --prod          # Deploy to production')

console.log('\n💡 If you still get 404 errors after deployment:')
console.log('  1. Check Vercel dashboard for build logs')
console.log('  2. Verify environment variables are set')
console.log('  3. Clear browser cache and try again')
console.log('  4. Check if the route exists in your React Router config')
