import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showMintSuccess = (signature: string, mintAddress: string) => {
  toast.success(
    (t) => (
      <div className="flex flex-col space-y-2">
        <div className="font-bold">NFT Minted Successfully! 🎉</div>
        <div className="text-xs text-gray-300">
          Your NFT will appear in your wallet shortly.
        </div>
        <a
          href={`https://solscan.io/tx/${signature}${process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet' ? '?cluster=devnet' : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs underline"
          onClick={() => toast.dismiss(t.id)}
        >
          View on Solscan →
        </a>
      </div>
    ),
    { duration: 10000 }
  );
};

export const showTransactionLink = (signature: string, label: string = 'View Transaction') => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const clusterParam = network === 'devnet' ? '?cluster=devnet' : '';
  
  return toast.success(
    (t) => (
      <div className="flex flex-col space-y-2">
        <div className="font-semibold">{label}</div>
        <a
          href={`https://solscan.io/tx/${signature}${clusterParam}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs underline"
          onClick={() => toast.dismiss(t.id)}
        >
          View on Solscan →
        </a>
      </div>
    ),
    { duration: 8000 }
  );
};
