# Deployment Guide - Preventing 404 Errors in React SPA

This guide explains how to deploy your React + TypeScript app to different hosting providers while preventing 404 errors when refreshing or directly visiting routes like `/dashboard` or `/profile`.

## The Problem

React Router uses client-side routing, which means:
- Routes like `/dashboard` don't exist as actual files on the server
- When you refresh the page or visit a route directly, the server looks for `/dashboard/index.html`
- Since it doesn't exist, you get a 404 error
- The solution is to configure the server to serve `index.html` for all unknown routes

## Solution Overview

We've implemented a comprehensive solution that:
1. ✅ Automatically copies `.htaccess` to build output for Apache servers
2. ✅ Provides Nginx configuration for VPS deployments
3. ✅ Optimizes build output with proper chunking
4. ✅ Includes security headers and caching rules

## Deployment Options

### Option 1: GoDaddy Shared Hosting (Apache)

**What happens automatically:**
- The `.htaccess` file is automatically copied to your build output
- No additional configuration needed

**Steps:**
1. Run `npm run build`
2. Upload the entire `dist` folder to your GoDaddy hosting
3. The `.htaccess` file will handle all routing automatically

**How it works:**
```apache
# From .htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
```

This tells Apache: "If the file/directory exists, serve it. Otherwise, serve index.html and let React Router handle it."

### Option 2: VPS with Nginx

**Steps:**
1. Run `npm run build`
2. Upload the `dist` folder contents to your server (e.g., `/var/www/html`)
3. Copy the `nginx.conf` template to `/etc/nginx/sites-available/your-site`
4. Update the `server_name` and `root` path in the config
5. Create a symlink: `ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/`
6. Test config: `nginx -t`
7. Restart Nginx: `sudo systemctl restart nginx`

**Key configuration:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This tells Nginx: "Try to serve the exact URI, then try with a trailing slash, then fall back to index.html."

### Option 3: Vercel (Automatic)

Vercel automatically handles SPA routing - no configuration needed.

### Option 4: Netlify (Automatic)

Netlify automatically handles SPA routing - no configuration needed.

## Testing Your Deployment

After deployment, test these scenarios:

1. **Direct route access:** Visit `https://yoursite.com/dashboard` directly
2. **Page refresh:** Navigate to `/dashboard` then refresh the page
3. **Deep linking:** Share a direct link to `/profile` with someone
4. **Browser back/forward:** Use browser navigation buttons

All should work without 404 errors.

## Build Process

The build process now automatically:

1. **Optimizes chunks:** Separates vendor, router, and Supabase code
2. **Copies .htaccess:** Automatically includes Apache configuration
3. **Sets base path:** Ensures proper asset loading
4. **Outputs to dist:** Creates a production-ready build

```bash
npm run build
# Output: dist/ folder with .htaccess included
```

## Troubleshooting

### Still getting 404 errors?

1. **Check .htaccess:** Ensure it's in your root directory (same level as index.html)
2. **Apache modules:** Verify `mod_rewrite` is enabled on your hosting
3. **File permissions:** Ensure .htaccess is readable by the web server
4. **Nginx config:** Verify the `try_files` directive is in your location block

### GoDaddy specific issues:

1. **cPanel:** Make sure "Apache Configuration" allows .htaccess overrides
2. **Shared hosting:** Some plans may restrict .htaccess functionality
3. **Contact support:** If issues persist, contact GoDaddy support

### Nginx specific issues:

1. **Config syntax:** Use `nginx -t` to test configuration
2. **Permissions:** Ensure Nginx can read your web root directory
3. **SELinux:** On CentOS/RHEL, check SELinux context

## Security Features

The configuration includes:

- **Security headers:** XSS protection, clickjacking prevention
- **Caching:** Optimized asset caching for better performance
- **Compression:** Gzip compression for faster loading
- **MIME type protection:** Prevents MIME type sniffing attacks

## Performance Optimizations

- **Asset caching:** Static files cached for 1 year
- **Code splitting:** Vendor, router, and app code separated
- **Gzip compression:** Reduces file sizes by 60-80%
- **Proper chunking:** Optimizes loading performance

## Next Steps

1. **Build your app:** `npm run build`
2. **Deploy to your hosting provider** using the appropriate method above
3. **Test all routes** to ensure no 404 errors
4. **Monitor performance** using browser dev tools

Your app should now handle all routes correctly without 404 errors! 🎉
