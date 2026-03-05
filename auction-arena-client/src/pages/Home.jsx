import { useState, useEffect } from 'react';
import { getAuctions } from '../services/api';
import AuctionCard from '../components/AuctionCard';

const Home = () => {
    const [auctions, setAuctions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAuctions = async (query = '') => {
        try {
            const res = await getAuctions(query);
            setAuctions(res.data);
        } catch {
            console.error('Failed to fetch auctions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAuctions(search);
    };

    return (
        <div style={styles.wrapper}>
            <form onSubmit={handleSearch} style={styles.searchBar}>
                <input
                    style={styles.searchInput}
                    placeholder="Search auctions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button style={styles.searchBtn} type="submit">
                    Search
                </button>
            </form>

            {loading ? (
                <p style={styles.message}>Loading auctions...</p>
            ) : auctions.length === 0 ? (
                <p style={styles.message}>No auctions found.</p>
            ) : (
                <div style={styles.grid}>
                    {auctions.map((auction) => (
                        <AuctionCard key={auction.id} auction={auction} />
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    searchBar: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
    },
    searchInput: {
        fontFamily: "'Space Mono', monospace",
        padding: '0.8rem 1.2rem',
        borderRadius: '999px',
        border: '2px solid #211857',
        backgroundColor: '#F0EDCE',
        color: '#211857',
        fontSize: '0.9rem',
        flex: 1,
        outline: 'none',
    },
    searchBtn: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        padding: '0.8rem 1.5rem',
        borderRadius: '999px',
        border: 'none',
        backgroundColor: '#211857',
        color: '#F0EDCE',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
    },
    message: {
        textAlign: 'center',
        color: '#211857',
        fontStyle: 'italic',
        marginTop: '3rem',
    },
};

export default Home;