import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // In a real application, you would save this data to a database
        // (e.g., Supabase, MongoDB, PostgreSQL) or send an email.

        console.log('--- NEW SHIPPING ADDRESS RECEIVED ---');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Name:', data.name);
        console.log('Email:', data.email);
        console.log('Address:', data.address);
        console.log('City:', data.city);
        console.log('Postal Code:', data.postalCode);
        console.log('Country:', data.country);
        console.log('Wallet:', data.wallet);
        console.log('NFT ID:', data.nftId);
        console.log('Quantity:', data.quantity);
        console.log('-------------------------------------');

        return NextResponse.json({ success: true, message: 'Shipping details received' });
    } catch (error) {
        console.error('Error processing shipping details:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process shipping details' },
            { status: 500 }
        );
    }
}
