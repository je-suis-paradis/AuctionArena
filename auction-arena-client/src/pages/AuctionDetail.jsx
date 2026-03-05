import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuction, getBids, placeBid, withdrawBid } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AuctionDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const [auctionRes, bidsRes] = await Promise.all([
                    getAuction(id),
                    getBids(id),
                ]);
                setAuction(auctionRes.data);
                setBids(bidsRes.data);
            } catch {
                navigate('/');
            }
        };
        load();
    }, [id]); // eslint-disable-line

    const refresh = async () => {
        try {
            const [auctionRes, bidsRes] = await Promise.all([
                getAuction(id),
                getBids(id),
            ]);
            setAuction(auctionRes.data);
            setBids(bidsRes.data);
        } catch {
            navigate('/');
        }
    };

    const handleBid = async (amount) => {
        setError('');
        setSuccess('');
        try {
            await placeBid(id, { amount: parseFloat(amount) });
            setSuccess('Bid placed!');
            setBidAmount('');
            refresh();
        } catch (err) {
            setError(err.response?.data || 'Failed to place bid.');
        }
    };

    const handleWithdraw = async (bidId) => {
        try {
            await withdrawBid(bidId);
            setSuccess('Bid withdrawn!');
            refresh();
        } catch (err) {
            setError(err.response?.data || 'Failed to withdraw bid.');
        }
    };

    if (!auction) return <p style={{ padding: '2rem' }}>Loading...</p>;

    const isOwner = user?.userId === auction.sellerId;
    const isOpen = auction.isOpen;
    const minBid = auction.currentBid + 1;
    const userHighestBid = bids.find(b => b.bidderUsername === user?.username);

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <div style={styles.punchHole} />
                <h3 style={styles.title}>{auction.title}</h3>
                <p style={styles.seller}>by @{auction.sellerUsername}</p>
                <p style={styles.description}>{auction.description}</p>

                <div style={styles.priceBox}>
                    <span style={styles.priceLabel}>Current Bid</span>
                    <span style={styles.price}>${auction.currentBid.toFixed(2)}</span>
                </div>

                <div style={styles.meta}>
                    <span>Ends: {new Date(auction.endDate).toLocaleString()}</span>
                    <span>{auction.bidCount} bid{auction.bidCount !== 1 ? 's' : ''}</span>
                </div>

                {user && !isOwner && isOpen && (
                    <div style={styles.bidSection}>
                        {error && <p style={styles.error}>{error}</p>}
                        {success && <p style={styles.successMsg}>{success}</p>}

                        <button
                            style={styles.autoBtn}
                            onClick={() => handleBid(minBid)}
                        >
                            Auto Bid +$1.00 (${minBid.toFixed(2)})
                        </button>

                        <div style={styles.customBid}>
                            <input
                                style={styles.input}
                                type="number"
                                step="0.01"
                                placeholder={`Min $${minBid.toFixed(2)}`}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                            />
                            <button
                                style={styles.bidBtn}
                                onClick={() => handleBid(bidAmount)}
                            >
                                Place Bid
                            </button>
                        </div>

                        {userHighestBid && (
                            <button
                                style={styles.withdrawBtn}
                                onClick={() => handleWithdraw(userHighestBid.id)}
                            >
                                Withdraw My Bid
                            </button>
                        )}
                    </div>
                )}

                {isOwner && (
                    <p style={styles.ownerNote}>This is your auction</p>
                )}

                {!isOpen && (
                    <p style={styles.closedNote}>This auction has ended</p>
                )}

                <div style={styles.bidHistory}>
                    <h3 style={styles.bidHistoryTitle}>Bid History</h3>
                    {bids.length === 0 ? (
                        <p style={styles.noBids}>No bids yet. Be the first!</p>
                    ) : (
                        bids.map((bid) => (
                            <div key={bid.id} style={styles.bidRow}>
                                <span>@{bid.bidderUsername}</span>
                                <span style={styles.bidAmount}>
                                    ${bid.amount.toFixed(2)}
                                </span>
                                <span style={styles.bidTime}>
                                    {new Date(bid.placedAt).toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
    },
    card: {
        backgroundColor: '#F0EDCE',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 4px 20px rgba(33, 24, 87, 0.15)',
        position: 'relative',
    },
    punchHole: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#73D9D1',
        border: '3px solid #211857',
        margin: '0 auto 1.5rem auto',
    },
    title: {
        color: '#211857',
        fontSize: '1.4rem',
        marginBottom: '0.3rem',
        textAlign: 'center',
    },
    seller: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#211857',
        fontSize: '0.85rem',
        marginBottom: '1rem',
    },
    description: {
        color: '#211857',
        marginBottom: '1.5rem',
        lineHeight: '1.6',
    },
    priceBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '3px double #211857',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
    },
    priceLabel: {
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#211857',
    },
    price: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#E44147',
    },
    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#211857',
        marginBottom: '1.5rem',
        fontStyle: 'italic',
    },
    bidSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        marginBottom: '1.5rem',
    },
    autoBtn: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        padding: '0.8rem',
        borderRadius: '999px',
        border: 'none',
        backgroundColor: '#211857',
        color: '#F0EDCE',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    customBid: {
        display: 'flex',
        gap: '0.5rem',
    },
    input: {
        fontFamily: "'Space Mono', monospace",
        padding: '0.7rem 1rem',
        borderRadius: '999px',
        border: '2px solid #211857',
        backgroundColor: '#73D9D1',
        color: '#211857',
        fontSize: '0.9rem',
        flex: 1,
        outline: 'none',
    },
    bidBtn: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        padding: '0.7rem 1.2rem',
        borderRadius: '999px',
        border: 'none',
        backgroundColor: '#E44147',
        color: '#F0EDCE',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    withdrawBtn: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        padding: '0.7rem',
        borderRadius: '999px',
        border: '2px solid #E44147',
        backgroundColor: 'transparent',
        color: '#E44147',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    ownerNote: {
        textAlign: 'center',
        color: '#211857',
        fontStyle: 'italic',
        fontSize: '0.85rem',
        marginBottom: '1rem',
    },
    closedNote: {
        textAlign: 'center',
        color: '#E44147',
        fontWeight: '700',
        marginBottom: '1rem',
    },
    error: {
        color: '#E44147',
        fontSize: '0.85rem',
        textAlign: 'center',
    },
    successMsg: {
        color: '#211857',
        fontWeight: '700',
        fontSize: '0.85rem',
        textAlign: 'center',
    },
    bidHistory: {
        borderTop: '2px solid #211857',
        paddingTop: '1.5rem',
        marginTop: '1rem',
    },
    bidHistoryTitle: {
        color: '#211857',
        marginBottom: '1rem',
        fontSize: '1rem',
    },
    noBids: {
        fontStyle: 'italic',
        color: '#211857',
        fontSize: '0.85rem',
    },
    bidRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(33, 24, 87, 0.2)',
        fontSize: '0.85rem',
        color: '#211857',
    },
    bidAmount: {
        fontWeight: '700',
        color: '#E44147',
    },
    bidTime: {
        fontStyle: 'italic',
        fontSize: '0.75rem',
    },
};

export default AuctionDetail;