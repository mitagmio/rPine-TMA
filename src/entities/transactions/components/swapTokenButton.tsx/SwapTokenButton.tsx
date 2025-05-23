import React from 'react';
import { useSelector } from 'react-redux';
import * as motion from 'motion/react-client';
import { RootState } from '../../../../store/store';
import { useWalletStore } from '../../../../store/wallet/useWalletStore';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { sendTransaction } from '../../api/transactions.api';
import { useTranslation } from 'react-i18next';
import styles from './SwapTokenButton.module.css';

interface SwapTokenButtonProps {
	onSwap: () => void;
}

export const SwapTokenButton: React.FC<SwapTokenButtonProps> = ({ onSwap }) => {
	const [tonConnectUI] = useTonConnectUI();
	const { isConnected } = useWalletStore(tonConnectUI);

	const { t } = useTranslation();

	const loading = useSelector((state: RootState) => state.swapRoutes.loading);
	const inputAssetAmount = useSelector((state: RootState) => state.swapRoutes.inputAssetAmount);
	const inputAssetAddress = useSelector((state: RootState) => state.swapRoutes.inputAssetAddress);
	const outputAssetAddress = useSelector((state: RootState) => state.swapRoutes.outputAssetAddress);
	const route = useSelector((state: RootState) => state.swapRoutes.route);

	const isDisabled = loading || !inputAssetAmount || !inputAssetAddress || !outputAssetAddress || !route;

	const handleSwap = async () => {
		if (!route?.bestRouteSplitDex?.swapMessages) {
			console.error('No swap messages available');
			return;
		}

		try {
			const transaction = {
				validUntil: Math.floor(Date.now() / 1000) + 600,
				messages: route.bestRouteSplitDex.swapMessages
			};

			await sendTransaction(tonConnectUI, transaction);
			onSwap();
		} catch (error) {
			console.error('Error sending swap transaction:', error);
		}
	};

	if (!isConnected) {
		return null;
	}

	return (
		<motion.button
			className={styles.swapButton}
			disabled={isDisabled}
			onClick={handleSwap}
			whileHover={!isDisabled ? { scale: 1.02 } : {}}
			whileTap={!isDisabled ? { scale: 0.95 } : {}}
		>
			{loading ? (t('loading_state')) : (t('swap_button'))}
		</motion.button>
	);
};

export default SwapTokenButton;

