# Static Board - Production Deployment

## Development

```bash
# Install dependencies
npm install

# Start mock server (Terminal 1)
npm run mock-server

# Start dev server (Terminal 2) - automatically uses localhost:3001
npm run dev
```

## Production Deployment

### Option 1: Build with specific gateway domain
```bash
# Edit package.json and replace "your-gateway-domain.com" with your actual domain
# Then build:
npm run build:prod

# Deploy the dist/ folder to your web host
```

### Option 2: Auto-detect domain (Recommended)
```bash
# Build without setting API host - uses current domain automatically
npm run build

# Deploy the dist/ folder to your web host
```

## Cloudflare Pages Deployment

### Setup (One-time)
```bash
# Install wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Install project dependencies (includes wrangler locally)
npm install
```

### Deploy
```bash
# Deploy with auto-detect domain (uses the Cloudflare Pages URL)
npm run deploy

# OR deploy with specific gateway domain
# (Edit package.json first to set your domain in build:prod)
npm run deploy:prod
```

### Custom Domain
After deployment, you can add a custom domain in the Cloudflare dashboard:
1. Go to Cloudflare Pages dashboard
2. Select your `kando-static-board` project  
3. Go to Custom domains
4. Add your domain (e.g., `board-demo.yourdomain.com`)

## URLs

- **Landing**: `https://kando-static-board.pages.dev/` → Shows demo landing page
- **Demo Board**: `https://kando-static-board.pages.dev/683b697294a7e8893427f87e` → Loads the demo board
- **Custom Board**: `https://kando-static-board.pages.dev/board-id` → Loads board with that ID

## Demo Configuration

The demo uses mock-id `683b697294a7e8893427f87e` consistently across:
- Android app UI publish button
- Static board deployment
- Mock server endpoints

## API Calls

The app makes requests to:
```
https://your-domain.com/uhC0k2Wp2_M-l3tf2f5VK-ev4JV6PzqZTfZXLZrDYgZHGe3PnEcQl/{board-id}/content/get_documents_with_tag
https://your-domain.com/uhC0k2Wp2_M-l3tf2f5VK-ev4JV6PzqZTfZXLZrDYgZHGe3PnEcQl/{board-id}/content/get_commits_for_document  
https://your-domain.com/uhC0k2Wp2_M-l3tf2f5VK-ev4JV6PzqZTfZXLZrDYgZHGe3PnEcQl/{board-id}/content/get_commit
```

Your Holo gateway needs to handle these paths and route them to the appropriate Holochain conductor.