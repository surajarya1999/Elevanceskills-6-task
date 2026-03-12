export default function Footer() {
  return (
    <footer className="ps-footer">
      <div className="ps-footer-inner">
        <p className="ps-footer-logo">🌐 PublicSpace</p>
        <p className="ps-footer-copy">© {new Date().getFullYear()} Public Space. All rights reserved.</p>
        <div className="ps-footer-links">
          <span>📋 Rules</span>
          <span>🔐 Secure</span>
          <span>👥 Community</span>
        </div>
      </div>
    </footer>
  );
}
