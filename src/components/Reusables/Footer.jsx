import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-links">
            <p className="footer-text">Mental Health Resources:</p>
            <a href="https://cmha.ca/" className="footer-link" target="_blank">
              Canadian Mental Health Association (CMHA)
            </a>
            <a href="https://www.camh.ca/en/health-info/crisis-resources" className="footer-link" target="_blank">
              Center for Addiction and Mental Health (CAMH)
            </a>
            <a href="https://www.ontario.ca/page/find-mental-health-support" className="footer-link" target="_blank">
              Ontario Mental Health Resources
            </a>
        </div>
        <div className="disclaimer">
          <p className="footer-text">
            Disclaimer: This journal is not a substitute for professional mental health advice. Please seek appropriate help if needed.
          </p>
        </div>
        
        <div className="footer-copyright">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Oura Mind Journal
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
