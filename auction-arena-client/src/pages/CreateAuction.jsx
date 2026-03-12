import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuction } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateAuction = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        description: '',
        startingBid: '',
        startDate: '',
        endDate: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        try {
            const res = await createAuction({
                ...form,
                startingBid: parseFloat(form.startingBid),
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
            });
            navigate(`/auction/${res.data.id}`);
        } catch {
            setError('Failed to create auction.');
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>New Auction</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        style={styles.textarea}
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        required
                    />
                    <input
                        style={styles.input}
                        name="startingBid"
                        type="number"
                        step="0.01"
                        placeholder="Starting Bid ($)"
                        value={form.startingBid}
                        onChange={handleChange}
                        required
                    />
                    <label style={styles.label}>Start Date & Time</label>
                    <input
                        style={styles.input}
                        name="startDate"
                        type="datetime-local"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />
                    <label style={styles.label}>End Date & Time</label>
                    <input
                        style={styles.input}
                        name="endDate"
                        type="datetime-local"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                    />
                    <button style={styles.button} type="submit">
                        Launch Auction
                    </button>
                </form>
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
        maxWidth: '520px',
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
    textarea: {
        fontFamily: "'Space Mono', monospace",
        padding: '0.8rem 1rem',
        borderRadius: '16px',
        border: '2px solid #211857',
        backgroundColor: '#73D9D1',
        color: '#211857',
        fontSize: '0.9rem',
        outline: 'none',
        resize: 'vertical',
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: '#211857',
        paddingLeft: '1rem',
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
};

export default CreateAuction;