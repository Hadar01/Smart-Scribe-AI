<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zkG-73MCsgIAvTQQeM-OKE49YWRbiyxo

## Run Locally

**Prerequisites:**  Node.js 18+


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```bash
   cp .env.local.template .env.local
   # Edit .env.local and add your API key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploy to Vercel

This app is optimized for Vercel deployment with the included `vercel.json` configuration.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import the project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect the configuration

3. Add environment variables (optional):
   - Set `GEMINI_API_KEY` if you want server-side API key support
   - The app also supports client-side BYOK (Bring Your Own Key)

4. Deploy! Vercel will build and deploy your app automatically.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **PostCSS** with autoprefixer for CSS processing
- **Lucide React** for icons
- **Google Gemini AI** for text transformation

## Production Build

To build for production locally:

```bash
npm run build
```

The optimized output will be in the `dist/` folder with:
- Code-split bundles for optimal loading
- Minified CSS and JavaScript
- Gzip-compressed assets

## Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.ts` - Vite build configuration
- `vercel.json` - Vercel deployment settings
- `.env.local.template` - Environment variables template
