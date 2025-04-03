import "./HelpButton.css";

export default function HelpButton({ onClick }) {
    return (
        <button className="help-button" onClick={onClick}>
            Ask me anything!
        </button>
    );
}