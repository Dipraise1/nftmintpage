import { NextResponse } from 'next/server';
import { createOrder, saveShippingAddress } from '@/lib/db/orders';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        const {
            name,
            email,
            address,
            city,
            postalCode,
            country,
            wallet,
            nftId,
            nftName,
            quantity,
            priceSol,
        } = data;

        // Validate required fields
        if (!name || !email || !address || !city || !postalCode || !country) {
            return NextResponse.json(
                { success: false, message: 'Missing required shipping details' },
                { status: 400 }
            );
        }

        let orderId = null;

        // Save to database if configured
        if (isSupabaseConfigured()) {
            try {
                // Create order record
                const order = await createOrder({
                    walletAddress: wallet,
                    nftId,
                    nftName,
                    quantity,
                    priceSol,
                    status: 'pending',
                    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
                });

                if (order) {
                    orderId = order.id;

                    // Save shipping address
                    await saveShippingAddress({
                        orderId: order.id,
                        name,
                        email,
                        address,
                        city,
                        postalCode,
                        country,
                    });
                }
            } catch (dbError) {
                console.error('Database error:', dbError);
                // Continue even if database save fails
            }
        }

        // Log to console as backup
        console.log('--- NEW SHIPPING ADDRESS RECEIVED ---');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Order ID:', orderId || 'N/A (DB not configured)');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Address:', address);
        console.log('City:', city);
        console.log('Postal Code:', postalCode);
        console.log('Country:', country);
        console.log('Wallet:', wallet);
        console.log('NFT ID:', nftId);
        console.log('Quantity:', quantity);
        console.log('-------------------------------------');

        return NextResponse.json({ 
            success: true, 
            message: 'Shipping details received',
            orderId 
        });
    } catch (error) {
        console.error('Error processing shipping details:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process shipping details' },
            { status: 500 }
        );
    }
}
