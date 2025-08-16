# Troubleshooting Guide

## Common Issues and Solutions

### 1. Turbopack Runtime Error
**Error**: `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`

**Solution**:
```bash
# Clear build cache
rm -rf .next
rm -rf node_modules/.cache

# Run without Turbopack
npm run dev

# Or with Turbopack (if needed)
npm run dev:turbo
```

### 2. Port Already in Use
**Error**: `Port 3000 is in use`

**Solution**:
- The app will automatically try ports 3001, 3002, etc.
- Or kill existing processes: `taskkill /f /im node.exe` (Windows)
- Or use a specific port: `npm run dev -- -p 4000`

### 3. Build Errors
**Issue**: Build fails or TypeScript errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript issues
npm run build
```

### 4. Performance Issues
**Issue**: App runs slowly or crashes

**Solution**:
- Disable real-time monitoring if enabled
- Clear browser cache
- Close other applications using CPU/memory
- Use Chrome DevTools to check for memory leaks

### 5. Feature Not Working
**Issue**: Specific features (camera, location, etc.) not working

**Solution**:
- Ensure you're using HTTPS or localhost (required for many APIs)
- Check browser permissions
- Test in different browsers (Chrome, Firefox, Safari)
- Check browser console for errors

## Browser Compatibility

### Fully Supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Limited Support:
- Internet Explorer: Not supported
- Older mobile browsers: Some features may not work

## Performance Tips

1. **Disable real-time monitoring** when not needed
2. **Use dark mode** to reduce battery usage
3. **Close unused browser tabs** to free memory
4. **Export data periodically** instead of keeping app open

## Development Commands

```bash
# Development (standard)
npm run dev

# Development (with Turbopack)
npm run dev:turbo

# Production build
npm run build

# Production server
npm run start

# Linting
npm run lint
```

## Getting Help

If you encounter issues not covered here:

1. Check browser console for errors
2. Try in incognito/private mode
3. Test in different browsers
4. Check GitHub issues: [Your repository URL]
5. Contact: @sahinurdev