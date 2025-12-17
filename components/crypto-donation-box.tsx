// components/crypto-donation-box.tsx
'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Qrcode, Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG as QRCode } from 'qrcode.react';

interface CryptoAddress {
  name: string;
  ticker: string;
  address: string;
}

const DONATION_ADDRESSES: CryptoAddress[] = [
  { name: 'Ethereum (ETH)', ticker: 'ETH', address: '0xBA9abB423596974f4908f12F92CBd9D64b38447b' },
  { name: 'Bitcoin (BTC)', ticker: 'BTC', address: 'bc1qn2395qfw5fknxa83lhyzhrmx7umsj3eyygeph9' },
  { name: 'USDT (TRC-20)', ticker: 'USDT (Tron)', address: 'TJh83QXwZK38hXvwXhEodErZakJhgasSfx' },
];

export default function CryptoDonationBox() {
  const supabase = useSupabase();
  const { toast } = useToast();

  const [activeAddress, setActiveAddress] = useState(DONATION_ADDRESSES[0]);
  const [showQR, setShowQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [nickname, setNickname] = useState('');
  const [txId, setTxId] = useState('');
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [donorNameForMessage, setDonorNameForMessage] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeAddress.address);
      setCopied(true);
      toast({ title: 'Copied!', description: `${activeAddress.ticker} address copied to clipboard.` });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Error', description: 'Failed to copy address', variant: 'destructive' });
    }
  };

  const handleSubmitVerification = async () => {
    if (!txId.trim()) {
      toast({ title: 'Error', description: 'Transaction ID (TxID) is required for verification.', variant: 'destructive' });
      return;
    }
    if (!nickname.trim()) {
      toast({ title: 'Error', description: 'Please enter your name or nickname.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const finalNickname = nickname.trim();

      const requestData = {
        nickname: finalNickname,
        tx_id: txId.trim(),
        crypto_address: activeAddress.address,
        crypto_ticker: activeAddress.ticker,
        is_anonymous: false,
        comment: comment.trim() || null,
      };

      const response = await fetch('/api/verify-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Verification failed on the server.');

      setDonorNameForMessage(finalNickname);
      setShowSuccess(true);

      // reset form
      setNickname('');
      setTxId('');
      setComment('');

      const statusMessage = result.status === 'verified'
        ? 'Your donation has been verified and will appear on the Wall of Gratitude!'
        : 'Your donation info has been submitted and is awaiting manual verification.';
      toast({ title: 'Submitted!', description: statusMessage });
    } catch (e: any) {
      console.error('Submission error:', e);
      toast({ title: 'Error', description: e.message || 'Failed to submit donation info.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto p-6 bg-card shadow-2xl border border-pink-500/50">
      <CardHeader className="p-0 mb-6 text-center">
        <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Support the Project
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {showSuccess ? (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-2xl font-bold text-green-700 mb-4">Thank you, {donorNameForMessage}! 🎉</h4>
            <p className="text-lg text-foreground/80 mb-6">
              You have done a wonderful thing by supporting the project. Your generosity ensures that the content will keep coming. We wish you all the best!
            </p>
            <Button onClick={() => window.location.href = '/'} variant="secondary" className="mt-6 font-bold">
              Go to Homepage
            </Button>
          </div>
        ) : (
          <>
            {/* 1. Address Selection */}
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">1. Choose Currency:</p>
              <div className="flex flex-wrap gap-2">
                {DONATION_ADDRESSES.map((addr) => (
                  <Button
                    key={addr.ticker}
                    variant={activeAddress.ticker === addr.ticker ? 'default' : 'outline'}
                    onClick={() => setActiveAddress(addr)}
                    className={activeAddress.ticker === addr.ticker ? 'bg-pink-500 hover:bg-pink-600' : 'border-border/50'}
                  >
                    {addr.ticker}
                  </Button>
                ))}
              </div>
            </div>

            {/* 2. Address & QR Display */}
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 mb-8">
              <p className="text-sm text-foreground/60 mb-2 flex justify-between items-center">
                Send {activeAddress.ticker} to:
                <Button size="sm" variant="ghost" onClick={() => setShowQR(!showQR)} className="text-xs text-pink-500">
                  {showQR ? 'Hide QR' : 'Show QR'}
                </Button>
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-background px-3 py-2 rounded border border-border/50 break-all">
                  {activeAddress.address}
                </code>
                <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {showQR && (
                <div className="mt-4 text-center p-2 bg-background rounded">
                  <QRCode value={activeAddress.address} size={150} level="H" />
                  <p className="text-xs mt-2 text-foreground/60">Scan to pay {activeAddress.ticker}</p>
                </div>
              )}
            </div>

            {/* 3. Verification/Comment Form */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-sm font-semibold mb-3">3. Verify Your Donation & Leave a Message</p>

              {/* NEW EXPLANATION TEXT */}
              <p className="text-xs text-foreground/70 mb-4">
                Want to stay completely anonymous? Simply send coins to the address above and skip this form.
                If you'd like to become our hero and be mentioned on the "People Who Keep My Blog Alive" wall,
                please fill in your name/nickname and the transaction ID (TxID) below.
              </p>

              <Input
                placeholder="Your Name / Nickname (Public)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isSubmitting}
                className="mb-3 bg-background border-border/50"
              />

              <Input
                placeholder="Transaction ID (TxID) or Hash *"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                disabled={isSubmitting}
                className="mb-4 bg-background border-border/50"
              />

              <Textarea
                placeholder="Optional: Leave a private message for the administrator"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4 bg-background border-border/50 resize-y"
                rows={3}
              />

              <Button
                onClick={handleSubmitVerification}
                disabled={isSubmitting || !txId.trim() || !nickname.trim()}
                className="w-full bg-pink-500 hover:bg-pink-600 font-bold"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Donation Info'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}