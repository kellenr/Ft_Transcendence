# 🔒 Cybersecurity Modules

## 🔵 Major Module (2 points)

### WAF/ModSecurity + HashiCorp Vault

**This is an advanced security implementation combining two powerful tools.**

---

## 🛡️ Part 1: WAF/ModSecurity (Hardened)

### What is a WAF?
**Web Application Firewall** - protects your application from common web attacks.

### Requirements:
- ✅ Configure **strict ModSecurity** rules
- ✅ Protect against common attacks:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - Remote File Inclusion (RFI)
  - Local File Inclusion (LFI)

### ModSecurity Rule Sets:
- **OWASP Core Rule Set (CRS)**
- Custom rules for your application
- Tuning to reduce false positives

### Configuration Example:
```apache
SecRuleEngine On
SecRequestBodyAccess On
SecRule REQUEST_HEADERS:Content-Type "text/xml" \
  "id:'200000',phase:1,t:none,t:lowercase,pass,nolog,ctl:requestBodyProcessor=XML"

# Block SQL Injection
SecRule ARGS "@detectSQLi" \
  "id:1000,phase:2,deny,status:403,msg:'SQL Injection detected'"
```

---

## 🔐 Part 2: HashiCorp Vault for Secrets

### What is Vault?
A tool to **securely store and access secrets** (API keys, passwords, certificates).

### Requirements:
- ✅ Manage secrets in Vault:
  - API keys
  - Database credentials
  - Environment variables
  - Certificates

- ✅ **Encrypted** storage
- ✅ **Isolated** from application code
- ✅ Access control policies

### Vault Features:
1. **Secret Engines**
   - Key/Value storage
   - Dynamic secrets
   - Database credentials

2. **Access Control**
   - Policies define who can access what
   - Token-based authentication
   - Role-based access

3. **Audit Logging**
   - Track all secret access
   - Compliance requirements
   - Security monitoring

### Implementation Example:
```bash
# Initialize Vault
vault server -dev

# Store a secret
vault kv put secret/myapp/config \
  db_password="super_secret" \
  api_key="xyz123"

# Retrieve a secret
vault kv get secret/myapp/config

# Define access policy
vault policy write myapp-policy myapp-policy.hcl
```

### Policy Example:
```hcl
# myapp-policy.hcl
path "secret/data/myapp/*" {
  capabilities = ["read"]
}

path "secret/metadata/myapp/*" {
  capabilities = ["list"]
}
```

---

## 🏗️ Architecture

### Typical Setup:
```
[User Request]
    ↓
[WAF/ModSecurity] ← Filters malicious requests
    ↓
[Your Application]
    ↓
[HashiCorp Vault] ← Fetches secrets securely
    ↓
[Database/APIs]
```

---

## 💡 Implementation Tips

### WAF Best Practices:
- **Start in detection mode** (log only)
- **Review logs** for false positives
- **Tune rules** gradually
- **Enable blocking** after tuning
- **Monitor continuously**

### Vault Best Practices:
- **Never hardcode secrets**
- **Use short-lived tokens**
- **Rotate secrets regularly**
- **Enable audit logging**
- **Backup Vault data**
- **Use production mode** (not dev mode)

### Security Layers:
```
✅ Layer 1: WAF blocks bad requests
✅ Layer 2: Application validates input
✅ Layer 3: Vault protects secrets
✅ Layer 4: Database permissions
✅ Layer 5: Network security
```

---

## 🗄️ Integration with Your Stack

### Docker Compose Example:
```yaml
version: '3.8'
services:
  vault:
    image: vault:latest
    ports:
      - "8200:8200"
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: 'dev-token'
    cap_add:
      - IPC_LOCK

  nginx-waf:
    image: owasp/modsecurity-crs:nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./modsecurity.conf:/etc/modsecurity/modsecurity.conf

  app:
    build: .
    environment:
      VAULT_ADDR: "http://vault:8200"
      VAULT_TOKEN: "dev-token"
```

### Application Integration:
```javascript
// Node.js example
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

async function getDbPassword() {
  const result = await vault.read('secret/data/myapp/config');
  return result.data.data.db_password;
}
```

---

## 🧪 Testing Checklist

### WAF Testing:
- [ ] Test SQL injection attempts (should be blocked)
- [ ] Test XSS attempts (should be blocked)
- [ ] Test CSRF attempts (should be blocked)
- [ ] Verify legitimate requests work
- [ ] Check logging is working
- [ ] Review false positives

### Vault Testing:
- [ ] Store and retrieve secrets
- [ ] Test access policies
- [ ] Verify encryption at rest
- [ ] Test token expiration
- [ ] Check audit logs
- [ ] Test secret rotation

---

## 📊 Monitoring

### What to Monitor:
- **WAF**:
  - Blocked requests
  - Request patterns
  - False positives
  - Performance impact

- **Vault**:
  - Secret access attempts
  - Failed authentication
  - Token usage
  - Audit log events

---


## 📚 Resources

### Documentation:
- **ModSecurity**: https://modsecurity.org/
- **OWASP CRS**: https://coreruleset.org/
- **HashiCorp Vault**: https://www.vaultproject.io/

### Learning:
- OWASP Top 10
- WAF concepts
- Secret management best practices
- Zero-trust architecture

---

## 🎯 Key Takeaway

This module demonstrates **enterprise-grade security**. It's not just about implementation, but understanding the **why** behind each security layer.


**Value**: 2 points
