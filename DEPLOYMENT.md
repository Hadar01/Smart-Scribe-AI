# Deployment Guide

This guide explains how to deploy Smart Scribe AI to various platforms.

## Vercel Deployment (Recommended)

Vercel is the recommended deployment platform for this application. The project includes a `vercel.json` configuration file that optimizes the deployment.

### Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Vercel will automatically detect the configuration

2. **Configure Project**
   - Framework Preset: Vite (auto-detected)
   - Root Directory: Leave as default or set to `smart-scribe-ai` if needed
   - Build Command: `npm run build` (auto-configured via vercel.json)
   - Output Directory: `dist` (auto-configured via vercel.json)

3. **Environment Variables (Optional)**
   - If you want to provide a server-side API key, add:
     - Name: `GEMINI_API_KEY`
     - Value: Your Gemini API key
   - Note: The app also supports client-side BYOK (Bring Your Own Key) where users provide their own API key

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `your-project.vercel.app`

### Continuous Deployment

Once deployed, Vercel will automatically:
- Deploy new commits to the main branch
- Create preview deployments for pull requests
- Provide deployment URLs for testing

## Other Platforms

### Netlify

1. Create a `netlify.toml` file in the root:

```toml
[build]
  command = "cd smart-scribe-ai && npm install && npm run build"
  publish = "smart-scribe-ai/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Connect your repository to Netlify
3. Set environment variables if needed
4. Deploy

### Railway

1. Connect your repository to Railway
2. Set the following:
   - Build Command: `cd smart-scribe-ai && npm install && npm run build`
   - Start Command: Not needed (static site)
3. Add a static site service
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY smart-scribe-ai/package*.json ./
RUN npm ci
COPY smart-scribe-ai/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:

```bash
docker build -t smart-scribe-ai .
docker run -p 80:80 smart-scribe-ai
```

## Environment Variables

The application supports the following environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key (optional, can be provided by users via UI)

## Build Configuration

The project uses:
- **Vite** for bundling and optimization
- **Tailwind CSS** for styling (compiled to CSS)
- **PostCSS** for CSS processing
- **Code splitting** for optimal loading performance

Build outputs:
- Main JavaScript bundle (~465KB, ~116KB gzipped)
- React vendor bundle (~4KB, ~1.5KB gzipped)
- Lucide icons bundle (~19KB, ~6KB gzipped)
- Compiled CSS (~29KB, ~5KB gzipped)

## Security Considerations

- Never commit API keys to the repository
- Use environment variables for sensitive data
- The app supports client-side BYOK for enhanced security
- All API calls are made client-side to protect user privacy

## Troubleshooting

### Build Fails

- Ensure Node.js 18+ is installed
- Run `npm install` to ensure all dependencies are installed
- Check that `smart-scribe-ai/` directory contains all source files

### Tailwind CSS Not Working

- Ensure `postcss.config.js` and `tailwind.config.js` exist
- Verify `index.css` is imported in `index.tsx`
- Check that content paths in `tailwind.config.js` match your file structure

### Import Errors

- Ensure all dependencies are listed in `package.json`
- Run `npm install` to install missing packages
- Check that import paths are correct

## Performance Optimization

The build is optimized with:
- Tree shaking to remove unused code
- Code splitting for parallel loading
- Minification and compression
- CSS extraction and purging
- Asset optimization

## Support

For issues or questions, please open an issue on the GitHub repository.
