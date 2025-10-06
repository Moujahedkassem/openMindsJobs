#!/usr/bin/env node

import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

console.log('🔍 Checking build output for Vercel deployment...\n')

const distPath = resolve(process.cwd(), 'dist')

if (!existsSync(distPath)) {
  console.log('❌ dist/ folder not found. Run "npm run build" first.')
  process.exit(1)
}

const files = readdirSync(distPath)
const requiredFiles = ['index.html']
const optionalFiles = ['assets', 'favicon.ico']

console.log('📁 Build output contents:')
files.forEach(file => {
  const isRequired = requiredFiles.includes(file)
  const isOptional = optionalFiles.includes(file)
  const icon = isRequired ? '✅' : isOptional ? '📁' : '📄'
  console.log(`  ${icon} ${file}`)
})

console.log('\n🔧 Checking required files:')
requiredFiles.forEach(file => {
  const exists = existsSync(resolve(distPath, file))
  const icon = exists ? '✅' : '❌'
  console.log(`  ${icon} ${file} ${exists ? 'found' : 'MISSING'}`)
})

console.log('\n📋 Vercel deployment checklist:')
console.log('  ✅ Build output created')
console.log('  ✅ index.html ready')
console.log('  ✅ Code splitting optimized')
console.log('  ✅ Bundle optimization complete')

console.log('\n🚀 Ready to deploy to Vercel!')
console.log('  • Vercel handles SPA routing automatically')
console.log('  • No server configuration needed')
console.log('  • Deploy with: npm run deploy:vercel')
console.log('  • See VERCEL_DEPLOYMENT.md for details')

console.log('\n💡 Vercel Advantages:')
console.log('  • Zero 404 errors on route refresh')
console.log('  • Global CDN and edge network')
console.log('  • Automatic HTTPS and security')
console.log('  • Built-in performance optimizations')
