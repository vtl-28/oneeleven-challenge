# One Eleven Developer Challenge - Production-Grade Webhook API

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://oneeleven-challenge.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-58%20Passing-success?style=for-the-badge&logo=jest)](https://github.com/vtl-28/oneeleven-challenge)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://github.com/vtl-28/oneeleven-challenge)

> A production-ready webhook API built for the One Eleven Junior Developer Challenge, demonstrating enterprise-grade architecture, comprehensive testing, and professional development practices.

---

## 🎯 Challenge Overview

**Objective:** Create a server-side API endpoint that receives a webhook containing a string, converts it to an array of characters, sorts them alphabetically, and returns the sorted array.

**Requirements:**
- POST endpoint accepting JSON: `{ data: "string" }`
- Convert string to character array
- Sort alphabetically
- Return as: `{ word: ["s","o","r","t","e","d"] }`
- Deploy publicly and pass validation endpoint

**Bonus:** Create a frontend interface for testing the API.

---

## 🚀 Live Demo

| Service | URL | Description |
|---------|-----|-------------|
| **Backend API** | [oneeleven-challenge.vercel.app](https://oneeleven-challenge.vercel.app) | Production webhook API |
| **Webhook Endpoint** | [/webhook](https://oneeleven-challenge.vercel.app/webhook) | Core functionality |
| **Health Check** | [/health](https://oneeleven-challenge.vercel.app/health) | API status monitoring |
| **API Documentation** | [/](https://oneeleven-challenge.vercel.app/) | Interactive API docs |
| **Frontend Validator** | [oneeleven-frontend.vercel.app](https://oneeleven-frontend.vercel.app) | Testing interface (Bonus) |

---

## 📁 Project Structure
```
oneeleven-challenge/
├── api/                          # Backend serverless functions
│   ├── webhook.js               # Main webhook endpoint (~140 lines)
│   ├── health.js                # Health monitoring endpoint
│   └── index.js                 # API documentation endpoint
│
├── utils/                        # Utility modules
│   ├── logger.js                # Winston logging configuration
│   ├── security.js              # Security headers implementation
│   └── rateLimit.js             # Rate limiting logic
│
├── tests/                        # Comprehensive test suite
│   ├── webhook.test.js          # 58 automated tests
│   └── testHelper.js            # Test utilities (mock request/response)
│
├── frontend/                     # Bonus: React validation UI
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   └── App.css              # Styling
│   └── package.json
│
├── vercel.json                   # Vercel deployment configuration
├── package.json                  # Dependencies and scripts
└── README.md                     
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Node.js 18+** | Runtime | Modern JavaScript features, excellent async support |
| **Vercel Serverless** | Deployment | Auto-scaling, zero config, global edge network |
| **Winston** | Logging | Structured JSON logs, multiple transport support |
| **Express Validator** | Validation | Comprehensive input sanitization |

### Frontend (Bonus)
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18** | UI Framework | Component-based, excellent developer experience |
| **Vite** | Build Tool | Fast dev server, optimized production builds |
| **Axios** | HTTP Client | Promise-based, clean API |

### Testing & Quality
| Technology | Purpose | Coverage |
|------------|---------|----------|
| **Jest** | Test Framework | 58 tests |
| **Supertest** | HTTP Testing | API endpoint testing |
| **ESLint** | Code Quality | Consistent code style |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn
- Vercel CLI (optional, for deployment)

### Installation
```bash
# Clone the repository
git clone https://github.com/vtl-28/oneeleven-challenge.git
cd oneeleven-challenge

# Install dependencies
npm install

# Run tests
npm test

# Start development server
vercel dev
```

### Test the API Locally
```bash
# Test the specification example
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"data":"example"}'

# Expected response:
# {"word":["a","e","e","l","m","p","x"]}
```

---

## 📖 API Documentation

### **POST /webhook**

Processes string data and returns alphabetically sorted characters.

**Request:**
```json
{
  "data": "example"
}
```

**Response (200 OK):**
```json
{
  "word": ["a", "e", "e", "l", "m", "p", "x"]
}
```

**Headers (Included in Response):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 2026-02-28T15:30:00.000Z
```

**Error Responses:**

| Status | Scenario | Response |
|--------|----------|----------|
| `400` | Missing `data` field | `{ "error": "Bad Request", "message": "Missing required field: 'data'" }` |
| `400` | Invalid data type | `{ "error": "Bad Request", "message": "Expected 'data' to be a string, received number" }` |
| `400` | String too long | `{ "error": "Bad Request", "message": "Data length cannot exceed 100000 characters" }` |
| `405` | Wrong HTTP method | `{ "error": "Method not allowed", "message": "This endpoint only accepts POST requests" }` |
| `429` | Rate limit exceeded | `{ "error": "Too Many Requests", "message": "Rate limit exceeded...", "retryAfter": "..." }` |
| `500` | Server error | `{ "error": "Internal Server Error", "message": "An unexpected error occurred" }` |

---

### **GET /health**

Health check endpoint for monitoring API status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-28T10:30:00.000Z",
  "service": "oneeleven-webhook-api",
  "version": "1.0.0",
  "uptime": 86400.5
}
```

---

### **GET /**

API documentation endpoint with complete endpoint information.

**Response (200 OK):**
```json
{
  "message": "One Eleven Developer Challenge - Webhook API",
  "version": "1.0.0",
  "author": "Vuyisile Lehola",
  "endpoints": { ... },
  "documentation": "https://github.com/vtl-28/oneeleven-challenge"
}
```

---

## 🧪 Testing

### Run Test Suite
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |   97.5  |    96.2  |   100   |   97.8  |                   
 api                |   98.1  |    97.5  |   100   |   98.3  |                   
  webhook.js        |   98.1  |    97.5  |   100   |   98.3  |                   
 utils              |   94.2  |    90.1  |   100   |   94.8  |                   
  logger.js         |   100   |    100   |   100   |   100   |                   
  rateLimit.js      |   92.5  |    87.5  |   100   |   93.1  |                   
  security.js       |   100   |    100   |   100   |   100   |                   
--------------------|---------|----------|---------|---------|-------------------
```

### Test Categories

| Category | Tests | Coverage |
|----------|-------|----------|
| **Core Functionality** | 12 | String processing, sorting, edge cases |
| **Input Validation** | 8 | Type checking, required fields, boundaries |
| **HTTP Methods** | 5 | POST, GET, PUT, DELETE, OPTIONS |
| **Response Format** | 4 | Field names, data types, headers |
| **Security Headers** | 5 | XSS, clickjacking, MIME protection |
| **Rate Limiting** | 9 | Enforcement, headers, IP tracking |
| **Edge Cases** | 5 | Unicode, special chars, whitespace |
| **Performance** | 2 | Response times, large strings |
| **Input Length** | 3 | Max length validation, boundaries |
| **Enhancement** | 5 | Logging, error handling, metrics |

**Total:** 58 automated tests + 8 manual tests = **66 verified scenarios**

---

## 🔒 Security Features

### Security Headers
```javascript
X-Content-Type-Options: nosniff        // Prevents MIME sniffing
X-Frame-Options: DENY                  // Prevents clickjacking
X-XSS-Protection: 1; mode=block       // XSS protection
Strict-Transport-Security: ...         // Enforces HTTPS
```

### Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- **Response:** 429 Too Many Requests with retry-after information
- **Storage:** In-memory with automatic cleanup (Redis-ready for production scaling)

### Input Validation
- **Type checking:** Ensures data is a string
- **Length limits:** Maximum 100,000 characters
- **Sanitization:** Prevents injection attacks
- **Error messages:** Helpful without exposing system details

---

## 🏗️ Architecture Decisions

### Why Modular Design?
- **Separation of Concerns:** Each utility has a single responsibility
- **Reusability:** Logger, security, and rate limiter can be used across endpoints
- **Testability:** Each module can be tested independently
- **Maintainability:** Changes to one module don't affect others

### Why Winston for Logging?
- **Structured Logs:** JSON format for easy parsing
- **Multiple Transports:** Console, file, external services
- **Log Levels:** Info, warn, error for different severity
- **Production-Ready:** Industry standard logging solution

### Why In-Memory Rate Limiting?
- **Simplicity:** No external dependencies for demo
- **Fast:** O(1) lookup time
- **Scalable:** Easy to swap with Redis for production
- **Sufficient:** Handles demo/small-scale traffic

### Why Serverless (Vercel)?
- **Auto-Scaling:** Handles traffic spikes automatically
- **Zero Config:** No server management
- **Global CDN:** Low latency worldwide
- **Cost-Effective:** Pay per request, not idle time

---

## 📝 Development Workflow

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Make changes, test
npm test

# Commit with descriptive message
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Deployment Workflow
```bash
# Test locally
vercel dev

# Run tests
npm test

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Code Quality Checks
```bash
# Run linter
npm run lint

# Run tests with coverage
npm run test:coverage

# Check for security vulnerabilities
npm audit
```

---

## 🎯 Key Features Implemented

### ✅ Core Requirements
- [x] POST endpoint accepting JSON
- [x] String to character array conversion
- [x] Alphabetical sorting
- [x] Correct response format
- [x] Public deployment
- [x] Validation endpoint passed

### ✅ Production Features
- [x] Comprehensive error handling
- [x] Input validation and sanitization
- [x] Security headers (4 types)
- [x] Rate limiting (100/15min)
- [x] Structured logging (Winston)
- [x] Health check endpoint
- [x] API documentation endpoint
- [x] CORS configuration

### ✅ Quality Assurance
- [x] 58 automated tests
- [x] 97%+ code coverage
- [x] Manual testing documented
- [x] Edge case handling

### ✅ Architecture
- [x] Modular utility design
- [x] Clean code structure
- [x] Professional organization
- [x] Scalable patterns

### ✅ Bonus Task
- [x] React frontend built
- [x] Professional UI/UX
- [x] Error handling
- [x] Loading states
- [x] Deployed to production

---

## 🚢 Deployment

### Backend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

**Environment Variables:**
- `NODE_ENV`: production
- `LOG_LEVEL`: info

### Frontend Deployment (Vercel)
```bash
# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
vercel --prod
```

---

## 📈 Monitoring & Logs

### Viewing Logs

**Local Development:**
```bash
vercel dev
# Logs appear in console with Winston formatting
```

**Production:**
- View in Vercel Dashboard: https://vercel.com/dashboard
- Filter by function: `/api/webhook`
- Search by request ID for detailed traces

### Log Format
```json
{
  "level": "info",
  "message": "Request processed successfully",
  "timestamp": "2026-02-28T10:30:00.000Z",
  "requestId": "abc123xyz",
  "inputLength": 7,
  "outputLength": 7,
  "duration": "45ms"
}
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Tests fail with timeout
```bash
# Solution: Increase Jest timeout
npm test -- --testTimeout=10000
```

**Issue:** Vercel deployment fails
```bash
# Solution: Check Node version
node --version  # Should be 18+

# Update if needed
nvm install 18
nvm use 18
```

**Issue:** Rate limit not working
```bash
# Solution: Check IP header configuration
# Vercel uses x-forwarded-for or x-real-ip
```

---

## 🤝 Contributing

This is a personal challenge submission, but feedback is welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this code for learning purposes.

---

## 👤 Author

**Vuyisile Lehola**

- 📧 Email: vtlehola23@gmail.com
- 💼 LinkedIn: [Vuyisile Lehola](https://linkedin.com/in/vuyisile-lehola-99a597122)
- 🐙 GitHub: [@vtl-28](https://github.com/vtl-28)
- 🌐 Portfolio: [Coming Soon]

---

## 🙏 Acknowledgments

- **One Eleven** - For the excellent technical challenge
- **Vercel** - For the amazing serverless platform
- **Open Source Community** - For the fantastic tools and libraries

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Jest Testing Documentation](https://jestjs.io/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Express Validator](https://express-validator.github.io/)
- [React Documentation](https://react.dev/)

---

## 🎯 Challenge Completion Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| POST Endpoint | ✅ Complete | Fully functional |
| String Processing | ✅ Complete | Handles all edge cases |
| Alphabetical Sort | ✅ Complete | Correct ASCII ordering |
| Response Format | ✅ Complete | Exact specification match |
| Public Deployment | ✅ Complete | Live on Vercel |
| Validation Passed | ✅ Complete | ✅ Verified |
| **Bonus: Frontend** | ✅ Complete | Professional UI |
| **Extra: Security** | ✅ Complete | Production-grade |
| **Extra: Testing** | ✅ Complete | 58 tests, 97% coverage |
| **Extra: Logging** | ✅ Complete | Winston structured logs |

---

<div align="center">

## ⭐ Star this repository if you found it helpful!

**Built with ❤️ by Vuyisile Lehola for the One Eleven Developer Challenge**

[Live Demo](https://oneeleven-challenge.vercel.app) • [Frontend](https://oneeleven-frontend.vercel.app) • [Report Issue](https://github.com/vtl-28/oneeleven-challenge/issues)

</div>