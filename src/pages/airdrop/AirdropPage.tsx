import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AirdropTransaction from '../../entities/airdrop/components/Airdrop';
import styles from './AirdropPage.module.css';
import { selectApineBalance } from '../../store/wallet/selectors';
import useTonWalletAddress from '../../entities/wallet/hooks/useWalletAddress.hook';
import TonWalletConnect from '../../components/UI/TonWalletConnectButton/TonWalletConnect';
import Footer from '../../widgets/footer/Footer';
import { fetchAirdropTransactionData } from '../../entities/airdrop/api/airdrop.api';
import { Message } from '../../entities/airdrop/types';

export const AirdropPage: React.FC = () => {
	const navigate = useNavigate();
	const { isConnected } = useTonWalletAddress();
	const apineBalance = useSelector(selectApineBalance);
	const [messages, setMessages] = useState<Message[] | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { t } = useTranslation();

	useEffect(() => {
		const loadData = async () => {
			if (!isConnected) return;
			try {
				setIsLoading(true);
				setError(null);
				const payloadData = await fetchAirdropTransactionData();
				setMessages(payloadData.messages);
			} catch (error) {
				setError('Error fetching data');
				console.error('Error:', error);
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [isConnected]);

	const handleClose = () => {
		navigate('/');
	};

	const handleConfirm = () => {
		console.log('Transaction confirmed');
	};

	return (
		<div className={styles.modalOverlay} onClick={handleClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>Airdrop</h2>
					<button
						className={styles.closeButton}
						onClick={handleClose}
						type="button"
					>
						<svg className={styles.closeIcon} width="30" height="30" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13 0.8125C10.5895 0.8125 8.23322 1.52728 6.22899 2.86646C4.22477 4.20564 2.66267 6.10907 1.74022 8.33604C0.817781 10.563 0.576428 13.0135 1.04668 15.3777C1.51694 17.7418 2.67769 19.9134 4.38214 21.6179C6.08659 23.3223 8.2582 24.4831 10.6223 24.9533C12.9865 25.4236 15.437 25.1822 17.664 24.2598C19.8909 23.3373 21.7944 21.7752 23.1335 19.771C24.4727 17.7668 25.1875 15.4105 25.1875 13C25.1813 9.76958 23.8953 6.67324 21.611 4.38898C19.3268 2.10472 16.2304 0.818694 13 0.8125V0.8125ZM17.418 16.082C17.594 16.2598 17.6928 16.4998 17.6928 16.75C17.6928 17.0002 17.594 17.2402 17.418 17.418C17.2388 17.5912 16.9993 17.6881 16.75 17.6881C16.5007 17.6881 16.2612 17.5912 16.082 17.418L13 14.3242L9.91797 17.418C9.73878 17.5912 9.49927 17.6881 9.25 17.6881C9.00074 17.6881 8.76123 17.5912 8.58204 17.418C8.40599 17.2402 8.30723 17.0002 8.30723 16.75C8.30723 16.4998 8.40599 16.2598 8.58204 16.082L11.6758 13L8.58204 9.91797C8.43254 9.73582 8.35614 9.50457 8.3677 9.26921C8.37926 9.03385 8.47795 8.8112 8.64458 8.64457C8.8112 8.47795 9.03385 8.37925 9.26921 8.36769C9.50457 8.35614 9.73582 8.43253 9.91797 8.58203L13 11.6758L16.082 8.58203C16.2642 8.43253 16.4954 8.35614 16.7308 8.36769C16.9662 8.37925 17.1888 8.47795 17.3554 8.64457C17.5221 8.8112 17.6208 9.03385 17.6323 9.26921C17.6439 9.50457 17.5675 9.73582 17.418 9.91797L14.3242 13L17.418 16.082Z" fill="#ECECEC" />
						</svg>
					</button>
				</div>
				<div className={styles.modalBody}>
					<div className={styles.optionsContainer}>
						<div className={styles.selectionWrapper}>
							<h3 className={styles.optionHeader}>aPine airdrop</h3>
							<p className={styles.optionParagraph}>{t('a_Pine_amount')}</p>
							<div className={styles.amountPineBox}>
								{isConnected ? (
									apineBalance ? `${apineBalance} aPine` : '0 aPine'
								) : (
									(t('wallet_not_connected'))
								)}
							</div>
							{isConnected && (
								<AirdropTransaction
									onConfirm={handleConfirm}
									onClick={handleClose}
									messages={messages}
									isLoading={isLoading}
									error={error}
								/>
							)}
							<TonWalletConnect />
						</div>
					</div>
					<Footer />
				</div>
			</div>
		</div>
	);
}; 