import './Button.css';

export const Button = ({ text, disabled, loading }) => {
    return (
        <button
            disabled={disabled}
            className={ `button ${loading ? 'loading' : ''}` }
        >
            {!loading && text}
            {loading && <div className="button_loader"></div>}
        </button>
    );
};
