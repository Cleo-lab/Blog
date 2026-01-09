// app/api/verify-donation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import TronWeb from 'tronweb';   // ← добавьте: npm i tronweb

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MIN = {
  BTC: 0.00001,
  ETH: 0.001,
  'USDT (Tron)': 1,
};

interface VerificationResult {
  success: boolean;
  message: string;
  amount?: string;
  from?: string;
}

/* ---------- BTC ---------- */
async function verifyBitcoinTx(txId: string, expectedAddress: string): Promise<VerificationResult> {
  try {
    const { data: tx } = await axios.get(`https://blockstream.info/api/tx/${txId}`);
    if (!tx.status?.confirmed) return { success: false, message: 'BTC not confirmed yet' };

    const out = tx.vout.find((o: any) => o.scriptpubkey_address === expectedAddress);
    if (!out) return { success: false, message: 'BTC wrong recipient' };

    const amount = (out.value / 1e8).toString();
    if (parseFloat(amount) < MIN.BTC) return { success: false, message: `Min ${MIN.BTC} BTC` };

    return { success: true, message: 'BTC verified', amount: `${amount} BTC`, from: tx.vin[0]?.prevout?.scriptpubkey_address || 'Unknown' };
  } catch (e: any) {
    console.error('BTC verify error:', e.message);
    return { success: false, message: 'BTC verify failed' };
  }
}

/* ---------- ETH (у вас уже есть, оставляем заглушку) ---------- */
async function verifyEthereumTx(txId: string, expectedAddress: string): Promise<VerificationResult> {
  // ← здесь ваш РАБОЧИЙ код из предыдущего файла
  // ниже заглушка, чтобы не падало
  return { success: false, message: 'ETH verify skipped (already working)' };
}

/* ---------- USDT (TRC-20) ---------- */
async function verifyTronTx(txId: string, expectedAddress: string): Promise<VerificationResult> {
  try {
    // 1. Получаем транзакцию
    const { data: tx } = await axios.post(
      'https://api.trongrid.io/wallet/gettransactionbyid',
      { value: txId },
      { headers: { 'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY || '' } }
    );

    if (!tx.ret || tx.ret[0].contractRet !== 'SUCCESS')
      return { success: false, message: 'USDT not confirmed / failed' };

    const c = tx.raw_data.contract[0];
    if (!c || c.type !== 'TriggerSmartContract')
      return { success: false, message: 'Not a TRC-20 transfer' };

    // 2. Проверяем, что это USDT-контракт
    const USDT_HEX = '41a614f803b6fd780986a42c78ec9c7f77e6ded13c'; // base58 → hex
    if (c.parameter.value.contract_address.toLowerCase() !== USDT_HEX)
      return { success: false, message: 'Not a USDT contract' };

    // 3. Извлекаем получателя и сумму из data
    const data = c.parameter.value.data; // 0xa9059cbb...
    const toHex = '41' + data.slice(32, 72); // адрес получателя (hex)
    const amountRaw = parseInt(data.slice(72), 16);
    const amount = amountRaw / 1e6; // USDT 6 decimals

    // 4. Сравниваем адреса (hex → base58)
    const toBase58 = (TronWeb as any).address.fromHex(toHex);
    if (toBase58 !== expectedAddress)
      return { success: false, message: `Wrong recipient. Expected: ${expectedAddress}, got: ${toBase58}` };

    if (amount < MIN['USDT (Tron)'])
      return { success: false, message: `Min ${MIN['USDT (Tron)']} USDT` };

    return {
      success: true,
      message: 'USDT verified',
      amount: `${amount.toFixed(2)} USDT`,
      from: (TronWeb as any).address.fromHex(c.parameter.value.owner_address) || 'Unknown'
    };
  } catch (e: any) {
    console.error('USDT verify error:', e);
    return { success: false, message: 'USDT verify failed' };
  }
}

/* ---------- ADMIN-режим: обновляем запись ---------- */
async function handleAdminVerification(
  id: string,
  tx_id: string,
  crypto_address: string,
  crypto_ticker: string
) {
  let result: VerificationResult;

  switch (crypto_ticker) {
    case 'BTC':
      result = await verifyBitcoinTx(tx_id, crypto_address);
      break;
    case 'ETH':
      result = await verifyEthereumTx(tx_id, crypto_address);
      break;
    case 'USDT (Tron)':
      result = await verifyTronTx(tx_id, crypto_address);
      break;
    default:
      return NextResponse.json({ error: 'Unsupported coin' }, { status: 400 });
  }

  const updateData: any = {
    verification_error: result.success ? null : result.message
  };

  if (result.success) {
    updateData.status = 'verified';
    updateData.verified_amount = result.amount;
    updateData.verified_at = new Date().toISOString();
    updateData.sender_address = result.from;
  } else {
    updateData.status = 'pending';
  }

  const { error } = await supabase.from('donations').update(updateData).eq('id', id);
  if (error) throw error;

  return NextResponse.json({
    success: result.success,
    message: result.success
      ? `Verified: ${result.amount}`
      : `Failed: ${result.message}`,
    status: result.success ? 'verified' : 'pending',
    amount: result.amount
  });
}

/* ---------- USER-режим: создаём запись ---------- */
async function handleUserSubmission(
  nickname: string,
  tx_id: string,
  crypto_address: string,
  crypto_ticker: string,
  comment?: string
) {
  const { error } = await supabase.from('donations').insert([
    {
      nickname,
      tx_id,
      crypto_address,
      crypto_ticker,
      comment: comment || null,
      status: 'pending',
      is_anonymous: false,
    },
  ]);
  if (error) throw error;
  return NextResponse.json({ success: true, status: 'pending' });
}

/* ---------- MAIN ROUTE ---------- */
export async function POST(request: NextRequest) {
  try {
    const { id, nickname, tx_id, crypto_address, crypto_ticker, comment } = await request.json();

    if (!tx_id || !crypto_address || !crypto_ticker)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    if (id) return await handleAdminVerification(id, tx_id, crypto_address, crypto_ticker);
    if (!nickname) return NextResponse.json({ error: 'Nickname required' }, { status: 400 });
    return await handleUserSubmission(nickname, tx_id, crypto_address, crypto_ticker, comment);
  } catch (e: any) {
    console.error('API error:', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}