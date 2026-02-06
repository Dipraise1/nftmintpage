import { supabase, isSupabaseConfigured } from '../supabase';

export interface OrderData {
  walletAddress: string;
  transactionSignature?: string;
  paymentSignature?: string;
  nftId: string;
  nftName: string;
  quantity: number;
  priceSol: number;
  mintAddresses?: string[];
  status: 'pending' | 'completed' | 'failed';
  network: string;
}

export interface ShippingData {
  orderId: string;
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export async function createOrder(orderData: OrderData) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping database save');
    return null;
  }

  try {
    const { data, error } = await supabase!
      .from('orders')
      .insert({
        wallet_address: orderData.walletAddress,
        transaction_signature: orderData.transactionSignature,
        payment_signature: orderData.paymentSignature,
        nft_id: orderData.nftId,
        nft_name: orderData.nftName,
        quantity: orderData.quantity,
        price_sol: orderData.priceSol,
        mint_addresses: orderData.mintAddresses,
        status: orderData.status,
        network: orderData.network,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'completed' | 'failed',
  mintAddresses?: string[]
) {
  if (!isSupabaseConfigured()) return null;

  try {
    const updateData: any = { status };
    if (mintAddresses) {
      updateData.mint_addresses = mintAddresses;
    }

    const { data, error } = await supabase!
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function saveShippingAddress(shippingData: ShippingData) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping shipping save');
    return null;
  }

  try {
    const { data, error } = await supabase!
      .from('shipping_addresses')
      .insert({
        order_id: shippingData.orderId,
        name: shippingData.name,
        email: shippingData.email,
        address: shippingData.address,
        city: shippingData.city,
        postal_code: shippingData.postalCode,
        country: shippingData.country,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving shipping address:', error);
    throw error;
  }
}

export async function getOrdersByWallet(walletAddress: string) {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase!
      .from('orders')
      .select('*, shipping_addresses(*)')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
