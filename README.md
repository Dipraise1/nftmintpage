# Antonio Wehrli - Mint Page

A vibrant, modern NFT minting page for Antonio Wehrli's digital art collection, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Vibrant design matching Antonio Wehrli's artistic aesthetic
- 🌊 Tai-Chi wave pattern visual elements
- 💰 Minting interface with quantity selector
- 📊 Collection statistics display
- 📱 Fully responsive design
- ⚡ Built with Next.js 14 App Router

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mintproject/
├── app/
│   ├── globals.css       # Global styles and Tailwind imports
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main mint page
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── next.config.mjs       # Next.js configuration
```

## Customization

### Colors

The color scheme can be customized in `tailwind.config.ts`. The current design uses:
- Pink (#ff6b6b) - Primary color
- Blue (#0ea5e9) - Accent color
- Purple - Gradient combinations

### Minting Logic

The minting functionality in `app/page.tsx` is currently a demo. To integrate with a real blockchain:

1. Install Web3 libraries (e.g., `ethers.js` or `viem`)
2. Add wallet connection (e.g., MetaMask, WalletConnect)
3. Implement smart contract interaction
4. Add transaction handling and error management

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

## License

This project is created for Antonio Wehrli's art collection.

## Links

- [Antonio Wehrli Website](https://www.a-w.ch/)
- [Instagram](https://www.instagram.com/wehrliantonio/)
- [LinkedIn](https://www.linkedin.com/in/antoniowehrli/)
# nftmintpage
