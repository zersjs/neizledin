const Spinner = ({ initial = false, label = "Yükleniyor…" }) => (
    <div className={`spinner ${initial ? "spinner--initial" : ""}`} role="status">
        <span className="spinnerRing" aria-hidden="true" />
        <span className="srOnly">{label}</span>
    </div>
);

export default Spinner;
