import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Validation endpoint URL
  const VALIDATION_ENDPOINT = 'https://yhxzjyykdsfkdrmdxgho.supabase.co/functions/v1/application-task';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      // Construct validation URL
      const validationUrl = `${VALIDATION_ENDPOINT}?url=${encodeURIComponent(apiUrl)}&email=${encodeURIComponent(email)}`;
      
      // Call One Eleven's validation endpoint
      const result = await axios.get(validationUrl);
      setResponse(result.data);
    } catch (err) {
      setError({
        message: err.message,
        details: err.response?.data || 'Unable to connect to validation endpoint',
        status: err.response?.status || 'Network Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setError(null);
    setEmail('');
    setApiUrl('');
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="url(#gradient)" />
              <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="white" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>One Eleven API Validator</h1>
          <p className="subtitle">Test your webhook endpoint submission</p>
        </header>

        {/* Main Content */}
        <main className="main">
          {!response && !error ? (
            // Input Form
            <div className="card">
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="email">
                    <span className="label-text">Email Address</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    className="input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apiUrl">
                    <span className="label-text">API Endpoint URL</span>
                    <span className="label-required">*</span>
                  </label>
                  <input
                    type="url"
                    id="apiUrl"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://your-api.vercel.app/webhook"
                    required
                    disabled={loading}
                    className="input"
                  />
                  <p className="input-hint">
                    Enter your deployed webhook endpoint URL
                  </p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`button ${loading ? 'button-loading' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Validating...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      Validate Endpoint
                    </>
                  )}
                </button>
              </form>

              {/* Info Section */}
              <div className="info-box">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                  </svg>
                  How it works
                </h3>
                <ol className="info-list">
                  <li>Enter your email address</li>
                  <li>Provide your deployed webhook endpoint URL</li>
                  <li>Click "Validate Endpoint" to test</li>
                  <li>If successful, you'll receive the application form link</li>
                </ol>
              </div>
            </div>
          ) : response ? (
            // Success Response
            <div className="card result-card success">
              <div className="result-header">
                <div className="icon-circle success-icon">
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
                <h2>Validation Successful!</h2>
                <p>Your webhook endpoint passed all tests</p>
              </div>

              <div className="result-body">
                <div className="result-data">
                  <h3>Response Details</h3>
                  <pre className="code-block">{JSON.stringify(response, null, 2)}</pre>
                </div>

                {response.application_link && (
                  <a 
                    href={response.application_link} 
                    className="application-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Continue to Application Form
                  </a>
                )}

                <button onClick={handleReset} className="button button-secondary">
                  Test Another Endpoint
                </button>
              </div>
            </div>
          ) : error ? (
            // Error Response
            <div className="card result-card error">
              <div className="result-header">
                <div className="icon-circle error-icon">
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                  </svg>
                </div>
                <h2>Validation Failed</h2>
                <p className="error-message">{error.message}</p>
                {error.status && (
                  <p className="error-status">Status: {error.status}</p>
                )}
              </div>

              <div className="result-body">
                <div className="result-data">
                  <h3>Error Details</h3>
                  <pre className="code-block error-code">{JSON.stringify(error.details, null, 2)}</pre>
                </div>

                <div className="error-help">
                  <h4>Troubleshooting Tips:</h4>
                  <ul>
                    <li>Verify your endpoint URL is correct and publicly accessible</li>
                    <li>Ensure your API accepts POST requests</li>
                    <li>Check that your response format matches: <code>{`{ word: ["a","r","r","a","y"] }`}</code></li>
                    <li>Test your endpoint manually with curl or Postman</li>
                  </ul>
                </div>

                <button onClick={handleReset} className="button button-secondary">
                  Try Again
                </button>
              </div>
            </div>
          ) : null}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>
              Built by{' '}
              <a href="https://github.com/vtl-28" target="_blank" rel="noopener noreferrer">
                Vuyisile Lehola
              </a>
            </p>
            <p className="footer-links">
              <a href="https://github.com/vtl-28/oneeleven-challenge" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View Source
              </a>
              <a href="https://linkedin.com/in/vuyisile-lehola-99a597122" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
                LinkedIn
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;