-- NFT Mint Site Database Schema
-- Run this in your Supabase SQL Editor

-- Create orders table to track all NFT mint transactions
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Wallet and transaction info
  wallet_address TEXT NOT NULL,
  transaction_signature TEXT,
  payment_signature TEXT,
  
  -- NFT details
  nft_id TEXT NOT NULL,
  nft_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_sol DECIMAL(10, 4) NOT NULL,
  
  -- Mint addresses (JSON array of minted NFT addresses)
  mint_addresses JSONB,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  
  -- Network
  network TEXT DEFAULT 'devnet' -- devnet or mainnet-beta
);

-- Create shipping_addresses table
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Link to order
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Customer details
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Address
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  
  -- Fulfillment status
  shipped BOOLEAN DEFAULT FALSE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  tracking_number TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_wallet ON orders(wallet_address);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_shipping_order_id ON shipping_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_email ON shipping_addresses(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_updated_at BEFORE UPDATE ON shipping_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - restrict in production)
CREATE POLICY "Enable read access for all users" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON shipping_addresses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON shipping_addresses
  FOR INSERT WITH CHECK (true);
