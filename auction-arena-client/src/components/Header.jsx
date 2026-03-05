import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };
    return (
        <header style={styles.wrapper}>
            <div style={styles.signContainer}>
                <Link to="/" style={styles.logo}>
                    P-Nut's Auction Arena
                </Link>
                <div style ={styles.glow} aria-hidden="true">
                    P-Nut's Auction Arena
                </div>
            </div>

            <nav style={styles.nav}>
    {user ? (
        <>
            <span style={styles.username}>@{user.username}</span>
            <Link to="/create" style={styles.navLink}>+ New Auction</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
                Log Out
            </button>
        </>
    ) : (
        <>
            <Link to="/login" style={styles.navLink}>Log In</Link>
            <Link to="/register" style={styles.navLink}>Register</Link>
        </>
    )}
</nav>
        </header>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        backgroundColor: '#73D9D1',
    },
    signContainer: {
        position: 'relative',
        display: 'inline-block',
    },
    logo: {
    fontFamily: "'Boogaloo', cursive",
    fontSize: '2.8rem',
    color: '#E44147',
    textDecoration: 'none',
    letterSpacing: '2px',
    textShadow: `
        0 0 10px rgba(228, 65, 71, 0.6),
        0 0 20px rgba(228, 65, 71, 0.4),
        0 0 40px rgba(228, 65, 71, 0.2)
    `,
    backgroundColor: '#F0EDCE',
    padding: '0.3rem 1.5rem',
    borderRadius: '999px',
    border: 'none',
    boxShadow: `
        0 0 15px rgba(228, 65, 71, 0.4),
        0 0 40px rgba(228, 65, 71, 0.2),
        0 4px 15px rgba(33, 24, 87, 0.2)
    `,
},

    glow: {
        display: 'none',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    navLink: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        color: '#211857',
        textDecoration: 'none',
        fontSize: '0.9rem',
        border: '2px solid #211857',
        padding: '0.4rem 1rem',
        borderRadius: '999px',
        transition: 'all 0.2s ease',
    },
    username: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        fontStyle: 'italic',
        color: '#211857',
        fontSize: '0.9rem',
    },
    logoutBtn: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        color: '#E44147',
        backgroundColor: 'transparent',
        border: '2px solid #E44147',
        padding: '0.4rem 1rem',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '0.9rem',
    },
};

export default Header;