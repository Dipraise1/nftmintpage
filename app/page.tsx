'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface NFT {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  supply: number;
  maxSupply: number;
}

const nftCollection: NFT[] = [
  {
    id: '1',
    name: 'Tai-Chi Waves',
    description: 'Vibrant abstract artwork with signature yin-yang pattern. My signature element is the arrangement of thick layers of strong colors in a ying-yang pattern.',
    price: 0.1,
    image: 'https://www.a-w.ch/images/artworks/centrifugal.jpg',
    rarity: 'common',
    supply: 342,
    maxSupply: 1000,
  },
  {
    id: '2',
    name: 'Centrifugal',
    description: 'Highly energetic colors in dynamic circular motion. Acrylic on Canvas, 2022.',
    price: 0.25,
    image: 'https://www.a-w.ch/images/artworks/centrifugal.jpg',
    rarity: 'rare',
    supply: 120,
    maxSupply: 500,
  },
  {
    id: '3',
    name: 'Monumental Gravity',
    description: 'Oversized artwork representing communication, exchange, equality and peace. Monumental Gravity artworks stand for communication, exchange, equality and peace.',
    price: 0.5,
    image: 'https://www.a-w.ch/images/artworks/monumental-gravity-schwanden.jpg',
    rarity: 'epic',
    supply: 45,
    maxSupply: 200,
  },
  {
    id: '4',
    name: 'ART MUSTANG',
    description: 'The ART MUSTANG by ANTONIO WEHRLI combines the beauty and fascination of a 1965 Ford Mustang Fastback muscle car with uplifting, fascinating and highly energetic colorflow.',
    price: 1.0,
    image: 'https://www.a-w.ch/images/artworks/art-mustang-poster.jpg',
    rarity: 'legendary',
    supply: 12,
    maxSupply: 50,
  },
];

export default function MintPage() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [selectedNFT, setSelectedNFT] = useState<NFT>(nftCollection[0]);
  const [quantity, setQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleConnectWallet = () => {
    setVisible(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setMinted(false);
  };

  const handleMint = async () => {
    if (!connected) {
      handleConnectWallet();
      return;
    }
    setIsMinting(true);
    // Simulate minting process - replace with actual Solana minting logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsMinting(false);
    setMinted(true);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'border-gray-300 bg-gray-50';
      case 'rare':
        return 'border-slate-300 bg-slate-50';
      case 'epic':
        return 'border-slate-400 bg-slate-100';
      case 'legendary':
        return 'border-slate-500 bg-slate-200';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-200 text-gray-700';
      case 'rare':
        return 'bg-slate-200 text-slate-700';
      case 'epic':
        return 'bg-slate-300 text-slate-800';
      case 'legendary':
        return 'bg-slate-400 text-slate-900';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 md:h-14">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm md:text-base font-bold text-slate-900">
                Antonio Wehrli
              </h1>
            </div>
            <div className="hidden lg:flex items-center space-x-5">
              <a href="https://www.a-w.ch" className="text-gray-700 hover:text-slate-900 transition-colors font-medium text-xs">
                Portfolio
              </a>
              <a href="https://www.a-w.ch/artist" className="text-gray-700 hover:text-slate-900 transition-colors font-medium text-xs">
                The Artist
              </a>
              <a href="https://www.a-w.ch/contact-us" className="text-gray-700 hover:text-slate-900 transition-colors font-medium text-xs">
                Contact
              </a>
              {/* Social Links */}
              <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-gray-200">
                <a href="https://www.instagram.com/wehrliantonio/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4 2.209 0 4 1.791 4 4 0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://twitter.com/wehrliantonio" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/antoniowehrli/" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://web.facebook.com/AntonioWehrliArtSpace" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
              {/* Wallet Connection Button */}
              {connected && publicKey ? (
                <button 
                  onClick={handleDisconnect}
                  className="px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 font-medium flex items-center space-x-1.5 hover:bg-gray-200 transition-all"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="font-mono text-[10px] md:text-xs hidden sm:inline">{formatAddress(publicKey.toString())}</span>
                  <span className="font-mono text-[10px] sm:hidden">Wallet</span>
                </button>
              ) : (
                <button 
                  onClick={handleConnectWallet}
                  className="px-3 md:px-4 py-1 md:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] md:text-xs font-semibold transition-all"
                >
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </button>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Full Screen Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="lg:hidden fixed inset-0 bg-white z-[70] overflow-y-auto">
              <div className="min-h-screen px-6 py-8">
                {/* Header with close button */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-slate-900">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Navigation Links */}
                <nav className="space-y-2 mb-10">
                  <a 
                    href="https://www.a-w.ch" 
                    className="flex items-center py-3.5 px-4 text-base font-medium text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                    </svg>
                    Portfolio
                  </a>
                  <a 
                    href="https://www.a-w.ch/artist" 
                    className="flex items-center py-3.5 px-4 text-base font-medium text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    The Artist
                  </a>
                  <a 
                    href="https://www.a-w.ch/contact-us" 
                    className="flex items-center py-3.5 px-4 text-base font-medium text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5 mr-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </a>
                </nav>
                
                {/* Social Links Section */}
                <div className="pt-6 pb-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">Follow Us</p>
                  <div className="grid grid-cols-4 gap-3">
                    <a 
                      href="https://www.instagram.com/wehrliantonio/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-slate-900 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4 2.209 0 4 1.791 4 4 0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                      <span className="text-xs text-gray-500 group-hover:text-slate-900">Instagram</span>
                    </a>
                    <a 
                      href="https://twitter.com/wehrliantonio" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-slate-900 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                      <span className="text-xs text-gray-500 group-hover:text-slate-900">Twitter</span>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/antoniowehrli/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-slate-900 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                      <span className="text-xs text-gray-500 group-hover:text-slate-900">LinkedIn</span>
                    </a>
                    <a 
                      href="https://web.facebook.com/AntonioWehrliArtSpace" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <svg className="w-6 h-6 text-gray-600 group-hover:text-slate-900 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                      <span className="text-xs text-gray-500 group-hover:text-slate-900">Facebook</span>
                    </a>
                  </div>
                </div>
                
                {/* Mobile Wallet Button */}
                <div className="pt-6 border-t border-gray-200">
                  {connected && publicKey ? (
                    <button 
                      onClick={() => {
                        handleDisconnect();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-all"
                    >
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      <span className="font-mono text-sm">{formatAddress(publicKey.toString())}</span>
                      <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        handleConnectWallet();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all text-base flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Connect Wallet</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      {/* Main Content */}
      <main className="pt-16 md:pt-20 pb-8 md:pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-slate-900 px-4">
              Tai-Chi Waves Collection
            </h1>
            <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto px-4">
              Own a piece of Antonio Wehrli&apos;s vibrant, energetic abstract art as a digital collectible
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Left Side - NFT Selector Gallery */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Choose Your NFT</h2>
                <p className="text-xs md:text-sm text-gray-600">Select an artwork from the collection to mint</p>
              </div>

              {/* NFT Gallery Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {nftCollection.map((nft) => (
                  <button
                    key={nft.id}
                    onClick={() => {
                      setSelectedNFT(nft);
                      setMinted(false);
                    }}
                    className={`relative aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedNFT.id === nft.id
                        ? 'border-slate-900 shadow-xl scale-105'
                        : 'border-gray-200 hover:border-slate-400'
                    } ${getRarityColor(nft.rarity)}`}
                  >
                    {/* Selected Indicator */}
                    {selectedNFT.id === nft.id && (
                      <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Rarity Badge */}
                    <div className={`absolute top-1.5 md:top-2 left-1.5 md:left-2 z-10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${getRarityBadgeColor(nft.rarity)}`}>
                      {nft.rarity.toUpperCase()}
                    </div>

                    {/* NFT Image */}
                    <div className="absolute inset-0 bg-slate-200">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center p-2 md:p-4 bg-black/40 rounded-lg backdrop-blur-sm">
                          <h3 className="font-bold text-xs md:text-sm mb-0.5 md:mb-1 drop-shadow-lg">{nft.name}</h3>
                          <p className="text-[10px] md:text-xs opacity-90 drop-shadow-md">{nft.price} SOL</p>
                        </div>
                      </div>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1.5 md:p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-[10px] md:text-xs font-semibold">{nft.price} SOL</span>
                        <span className="text-white/80 text-[10px] md:text-xs">{nft.supply}/{nft.maxSupply}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected NFT Details */}
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-7 border border-gray-200 shadow-lg">
                {/* Large Preview Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-5 md:mb-6 border border-gray-200">
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2364758b;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%23475569;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23334155;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="400" fill="url(%23grad)"/%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-300">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                      <span className="text-gray-800 text-[10px] font-semibold">NFT</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-5 gap-3">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-800">{selectedNFT.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-2">{selectedNFT.description}</p>
                  </div>
                  <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getRarityBadgeColor(selectedNFT.rarity)} self-start sm:self-auto`}>
                    {selectedNFT.rarity.toUpperCase()}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-5 mt-4 md:mt-5">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-slate-900">{selectedNFT.supply}</div>
                    <div className="text-[10px] md:text-xs text-gray-600 mt-1 md:mt-1.5">Minted</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2 md:mt-2.5">
                      <div className="bg-slate-900 h-1 rounded-full" style={{width: `${(selectedNFT.supply/selectedNFT.maxSupply)*100}%`}}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-slate-900">{selectedNFT.maxSupply}</div>
                    <div className="text-[10px] md:text-xs text-gray-600 mt-1 md:mt-1.5">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-slate-900">{selectedNFT.maxSupply - selectedNFT.supply}</div>
                    <div className="text-[10px] md:text-xs text-gray-600 mt-1 md:mt-1.5">Remaining</div>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-gray-800 font-semibold text-sm">Solana</div>
                        <div className="text-gray-500 text-xs">SPL Token</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 text-xs font-semibold">Verified</div>
                      <div className="text-gray-500 text-xs">Program</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Minting Interface */}
            <div className="space-y-6 md:space-y-8">
              {/* Wallet Connection Prompt */}
              {!connected && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-5 md:p-6">
                  <div className="flex items-start space-x-4 md:space-x-5">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-800 font-semibold mb-2 text-sm">Connect Your Wallet</h3>
                      <p className="text-gray-600 text-xs">Connect your wallet to start minting exclusive artworks from Antonio Wehrli&apos;s collection.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Display */}
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-semibold text-sm">Price per NFT</span>
                  <div className="text-right">
                    <span className="text-xl md:text-2xl font-bold text-slate-900">
                      {selectedNFT.price} SOL
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">≈ ${(selectedNFT.price * 150).toLocaleString()} USD</span>
                  <div className="flex items-center space-x-1 text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Live Price</span>
                  </div>
                </div>
                {selectedNFT.rarity !== 'common' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-600">Premium NFT:</span>
                      <span className="font-semibold text-slate-900">+{(selectedNFT.price - 0.1).toFixed(2)} SOL</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 border border-gray-200 shadow-lg">
                <label className="block text-gray-700 font-semibold mb-4 text-sm">
                  Quantity
                </label>
                <div className="flex items-center space-x-4 md:space-x-5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 md:w-13 md:h-13 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center bg-gray-50 rounded-xl py-4 md:py-5 border border-gray-200">
                    <div className="text-3xl md:text-4xl font-bold text-slate-900">
                      {quantity}
                    </div>
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="w-12 h-12 md:w-13 md:h-13 rounded-xl bg-slate-100 border border-slate-300 text-slate-900 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                  >
                    +
                  </button>
                </div>
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Max 10 per transaction
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 text-sm md:text-base font-semibold">Total</span>
                  <span className="text-xl md:text-2xl font-bold text-slate-900">
                    {(selectedNFT.price * quantity).toFixed(2)} SOL
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  ≈ ${((selectedNFT.price * quantity) * 150).toLocaleString()} USD
                </div>
                {quantity > 1 && (
                  <div className="text-[10px] text-gray-500 mt-2">
                    {quantity} × {selectedNFT.price} SOL each
                  </div>
                )}
              </div>

              {/* Mint Button */}
              <button
                onClick={handleMint}
                disabled={isMinting || (minted && connected)}
                className="w-full py-4 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isMinting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Minting...
                    </>
                  ) : minted ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Minted Successfully!
                    </>
                  ) : connected ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Mint Now
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Connect Wallet & Mint
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              {/* Success Message */}
              {minted && (
                <div className="bg-green-50 border border-green-200 rounded-xl md:rounded-2xl p-5 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-5 h-5 md:w-5 md:h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-700 mb-2 text-sm">Congratulations!</p>
                      <p className="text-xs text-gray-600">Your artwork has been minted successfully. Check your wallet to view your NFT.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-5">
                <div className="flex items-start space-x-3">
                  <svg className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-700">
                    <strong className="text-slate-900">Note:</strong> This is a demo mint page. Connect your wallet to proceed with the actual minting process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Artist Info Section */}
          <div className="mt-16 md:mt-24 bg-white rounded-2xl md:rounded-3xl p-5 md:p-7 lg:p-10 border border-gray-200 shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div>
                {/* Logo */}
                <div className="mb-3 md:mb-4">
                  <img
                    src="https://www.a-w.ch/Logo.jpg"
                    alt="Antonio Wehrli Logo"
                    className="h-auto w-auto max-w-[140px] md:max-w-[160px]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="inline-block px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold mb-4 md:mb-5">
                  THE ARTIST
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 text-slate-900">
                  Who is Antonio Wehrli?
                </h2>
                <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                  Antonio Wehrli is a contemporary artist who lives and creates in Glarus, Switzerland and Chengdu, China. 
                  His abstract and figurative works often feature vibrant and highly energetic colors, done in various 
                  self-developed painting techniques. They invite the viewer to a colorful world of wonders and dreams.
                </p>
                <p className="text-gray-700 text-xs md:text-sm mb-4 md:mb-5 leading-relaxed">
                  I paint vibrant, highly energetic abstract and figurative artworks. My signature element is the arrangement 
                  of thick layers of strong colors in a ying-yang pattern, which I like to call <strong className="text-gray-900">Tai-Chi waves</strong>.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 md:gap-3">
                  <a
                    href="https://www.a-w.ch/artist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all text-xs md:text-sm"
                  >
                    Learn More
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="https://www.a-w.ch/portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 md:px-5 py-2 md:py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-xs md:text-sm"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  {/* Using actual Centrifugal image from the website */}
                  <img
                    src="https://www.a-w.ch/images/artworks/Centrifugal%2020220815%20-%2066cm%20-%20Acrylic%20on%20Canvas%20-%202022.jpg"
                    alt="Antonio Wehrli - Centrifugal Artwork"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2364758b;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%23475569;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23334155;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="400" fill="url(%23grad)"/%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
                    <p className="text-base md:text-lg font-bold text-white mb-1 drop-shadow-lg">Contemporary Art</p>
                    <p className="text-xs md:text-sm text-white/90 drop-shadow-md">Vibrant • Energetic • Abstract</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="mt-12 md:mt-16 text-center">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-5 md:mb-6">Join the @wehrliantonio community</h3>
            <div className="flex justify-center items-center space-x-3 md:space-x-4 flex-wrap gap-3 md:gap-0">
              <a href="https://www.instagram.com/wehrliantonio/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all group">
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4 2.209 0 4 1.791 4 4 0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/wehrliantonio" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all group">
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/antoniowehrli/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all group">
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://web.facebook.com/AntonioWehrliArtSpace" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all group">
                <svg className="w-6 h-6 text-slate-600 group-hover:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-600 mt-5 text-xs">Discover the artist&apos;s daily life</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">AW - Antonio Wehrli | © 2026 All Rights Reserved</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="https://www.a-w.ch" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-slate-900 transition-colors text-sm">
                Official Website
              </a>
              <a href="https://www.a-w.ch/contact-us" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-slate-900 transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
