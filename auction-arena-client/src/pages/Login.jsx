import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            loginUser(res.data);
            navigate('/');
        } catch {
            setError('Invalid credentials.');
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button style={styles.button} type="submit">
                        Log In
                    </button>
                </form>
                <p style={styles.link}>
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '2rem',
    },
    card: {
        backgroundColor: '#F0EDCE',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(33, 24, 87, 0.15)',
    },
    title: {
        color: '#211857',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        fontFamily: "'Space Mono', monospace",
        padding: '0.8rem 1rem',
        borderRadius: '999px',
        border: '2px solid #211857',
        backgroundColor: '#73D9D1',
        color: '#211857',
        fontSize: '0.9rem',
        outline: 'none',
    },
    button: {
        fontFamily: "'Space Mono', monospace",
        fontWeight: '700',
        padding: '0.8rem',
        borderRadius: '999px',
        border: 'none',
        backgroundColor: '#E44147',
        color: '#F0EDCE',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    error: {
        color: '#E44147',
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '0.85rem',
    },
    link: {
        textAlign: 'center',
        marginTop: '1rem',
        fontSize: '0.85rem',
        color: '#211857',
    },
};

export default Login;