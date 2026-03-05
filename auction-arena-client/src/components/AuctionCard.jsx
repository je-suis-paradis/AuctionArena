import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuctionCard = ({ auction }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const timeLeft = () => {
        const now = new Date();
        const end = new Date(auction.endDate);
        const diff = end - now;
        if (diff <= 0) return 'Ended';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
    };

    return (
        <div
            style={styles.tag}
            onClick={() => navigate(`/auction/${auction.id}`)}
        >
            {}
            <div style={styles.hole} />

            {}
            <div style={styles.zigzag} />

            <h3 style={styles.title}>{auction.title}</h3>
            <p style={styles.description}>
                {auction.description.length > 80
                    ? auction.description.slice(0, 80) + '...'
                    : auction.description}
            </p>

            <div style={styles.divider} />

            {}
            {!user ? (
                <div style={styles.priceBox}>
                    <span style={styles.priceLabel}>Current Bid</span>
                    <span style={styles.price}>
                        ${auction.currentBid.toFixed(2)}
                    </span>
                </div>
            ) : (
                <div style={styles.priceBox}>
                    <span style={styles.priceLabel}>Current Bid</span>
                    <span style={styles.price}>
                        ${auction.currentBid.toFixed(2)}
                    </span>
                    <span style={styles.clickHint}>Click to bid →</span>
                </div>
            )}

            <div style={styles.footer}>
                <span style={styles.timeLeft}>{timeLeft()}</span>
                <span style={styles.bids}>
                    {auction.bidCount} bid{auction.bidCount !== 1 ? 's' : ''}
                </span>
            </div>
        </div>
    );
};

const styles = {
    tag: {
        backgroundColor: '#F0EDCE',
        borderRadius: '12px',
        padding: '1.5rem',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '3px 3px 0px #211857',
        border: '2px solid #211857',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    hole: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#73D9D1',
        border: '2px solid #211857',
        margin: '0 auto 0.5rem auto',
    },
    zigzag: {
        height: '8px',
        backgroundImage: `
            linear-gradient(135deg, #73D9D1 25%, transparent 25%),
            linear-gradient(225deg, #73D9D1 25%, transparent 25%)
        `,
        backgroundSize: '16px 8px',
        backgroundPosition: '0 0, 8px 0',
        marginBottom: '0.5rem',
        marginLeft: '-1.5rem',
        marginRight: '-1.5rem',
    },
    title: {
        color: '#211857',
        fontSize: '1rem',
        marginBottom: '0.3rem',
    },
    description: {
        color: '#211857',
        fontSize: '0.8rem',
        lineHeight: '1.5',
        fontStyle: 'italic',
    },
    divider: {
        borderTop: '2px dashed #211857',
        margin: '0.5rem 0',
    },
    priceBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px double #211857',
        borderRadius: '8px',
        padding: '0.7rem',
    },
    priceLabel: {
        fontSize: '0.65rem',
        fontWeight: '700',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#211857',
    },
    price: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#E44147',
        fontFamily: "'Space Mono', monospace",
    },
    clickHint: {
        fontSize: '0.7rem',
        color: '#211857',
        fontStyle: 'italic',
        marginTop: '0.3rem',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: '#211857',
    },
    timeLeft: {
        fontWeight: '700',
    },
    bids: {
        fontStyle: 'italic',
    },
};

export default AuctionCard;