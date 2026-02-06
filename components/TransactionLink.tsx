interface TransactionLinkProps {
  signature: string;
  label?: string;
  className?: string;
}

export function TransactionLink({ 
  signature, 
  label = 'View Transaction',
  className = ''
}: TransactionLinkProps) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';
  
  return (
    <a
      href={`https://solscan.io/tx/${signature}${clusterParam}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}
