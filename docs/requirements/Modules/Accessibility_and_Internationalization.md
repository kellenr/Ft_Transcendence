# ♿ Accessibility and Internationalization Modules

## 🔵 Major Module (2 points)

### Complete Accessibility Compliance (WCAG 2.1 AA)

**Make your application accessible to everyone, including people with disabilities**

---

## 🎯 What is WCAG 2.1 AA?

**WCAG** = Web Content Accessibility Guidelines
**AA** = Level AA compliance (industry standard for most websites)

Ensures your site is usable by people with:
- Visual impairments
- Hearing impairments
- Motor disabilities
- Cognitive disabilities

---

## ✅ Requirements

### 1. Screen Reader Support
- ✅ All content readable by screen readers
- ✅ Proper HTML semantic elements
- ✅ ARIA labels where needed
- ✅ Alternative text for images
- ✅ Descriptive link text

### 2. Keyboard Navigation
- ✅ **All functionality available via keyboard**
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ Skip navigation links
- ✅ No keyboard traps

### 3. Assistive Technologies
- ✅ Compatible with screen readers (NVDA, JAWS, VoiceOver)
- ✅ Works with keyboard-only navigation
- ✅ Supports browser zoom (up to 200%)
- ✅ High contrast mode support

---

## 📋 WCAG 2.1 AA Requirements

### Perceivable
**Users must be able to perceive information**

✅ **Text Alternatives:**
```html
<!-- Good -->
<img src="dog.jpg" alt="Golden retriever playing fetch in a park">

<!-- Bad -->
<img src="dog.jpg" alt="image">
```

✅ **Color Contrast:**
- Normal text: 4.5:1 ratio
- Large text: 3:1 ratio
- Use tools like WebAIM Contrast Checker

✅ **Adaptable Content:**
```html
<!-- Use semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>Footer content</p>
</footer>
```

---

### Operable
**Users must be able to operate the interface**

✅ **Keyboard Accessible:**
```javascript
// Make custom components keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom Button
</div>
```

✅ **Focus Indicators:**
```css
/* Visible focus styles */
button:focus,
a:focus,
input:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Never remove focus outline without replacement! */
/* BAD: button:focus { outline: none; } */
```

✅ **Skip Links:**
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<main id="main-content">
  <!-- Content -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

### Understandable
**Information must be understandable**

✅ **Form Labels:**
```html
<!-- Good -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email" required>
<span id="email-error" role="alert"></span>

<!-- With ARIA -->
<input
  type="email"
  id="email"
  name="email"
  aria-describedby="email-help"
  aria-invalid="false"
  required
>
<small id="email-help">We'll never share your email</small>
```

✅ **Error Messages:**
```html
<form aria-label="Login form">
  <div class="form-group" role="group" aria-labelledby="username-label">
    <label id="username-label" for="username">Username:</label>
    <input
      type="text"
      id="username"
      aria-required="true"
      aria-invalid="true"
      aria-describedby="username-error"
    >
    <span id="username-error" role="alert">
      Username is required
    </span>
  </div>
</form>
```

---

### Robust
**Content must work with assistive technologies**

✅ **ARIA Roles:**
```html
<!-- Modal dialog -->
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
  aria-modal="true"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">Are you sure you want to delete?</p>
  <button>Confirm</button>
  <button>Cancel</button>
</div>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-atomic="true">
  Loading...
</div>
```

---

## 🛠️ Implementation Examples

### Accessible Form Component:

```jsx
import React, { useState } from 'react';

function AccessibleForm() {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(e.target);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      // Announce success to screen readers
      const alert = document.getElementById('form-success');
      alert.textContent = 'Form submitted successfully!';
    } else {
      setErrors(newErrors);
      // Move focus to first error
      const firstError = document.querySelector('[aria-invalid="true"]');
      firstError?.focus();
    }
  };

  return (
    <>
      <div
        id="form-success"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <form
        onSubmit={handleSubmit}
        aria-label="Contact form"
        noValidate
      >
        <div className="form-group">
          <label htmlFor="name" id="name-label">
            Name <span aria-label="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : "name-help"}
          />
          <small id="name-help">Enter your full name</small>
          {errors.name && (
            <span id="name-error" role="alert" className="error">
              {errors.name}
            </span>
          )}
        </div>

        <button type="submit" aria-label="Submit contact form">
          Submit
        </button>
      </form>
    </>
  );
}
```

---

### Accessible Navigation:

```jsx
function AccessibleNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Main navigation">
      <button
        aria-expanded={isOpen}
        aria-controls="nav-menu"
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>

      <ul
        id="nav-menu"
        role="menu"
        hidden={!isOpen}
      >
        <li role="none">
          <a href="/" role="menuitem">Home</a>
        </li>
        <li role="none">
          <a href="/about" role="menuitem">About</a>
        </li>
        <li role="none">
          <a href="/contact" role="menuitem">Contact</a>
        </li>
      </ul>
    </nav>
  );
}
```

---

### Accessible Modal:

```jsx
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Trap focus inside modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement?.focus();

      const handleTab = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Tools

### Automated Testing:
- **axe DevTools** (browser extension)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools)
- **Pa11y** (command line tool)

### Manual Testing:
- **Keyboard Navigation**: Try using only Tab, Enter, Space, Arrow keys
- **Screen Readers**:
  - NVDA (Windows, free)
  - JAWS (Windows)
  - VoiceOver (Mac, built-in)
  - TalkBack (Android)

### Testing Checklist:
- [ ] Can navigate entire site with keyboard only
- [ ] All images have alt text
- [ ] Color contrast meets AA standards
- [ ] Forms have proper labels
- [ ] Error messages are clear
- [ ] Focus indicators are visible
- [ ] Screen reader announces all content
- [ ] Page has proper heading structure (h1, h2, h3...)
- [ ] Links have descriptive text
- [ ] Videos have captions

---

## 💡 Best Practices

### Semantic HTML:
```html
<!-- Good -->
<button onClick={handleClick}>Click me</button>

<!-- Bad -->
<div onClick={handleClick}>Click me</div>
```

### ARIA Usage:
```html
<!-- Only use ARIA when necessary -->
<!-- Native HTML is better when possible -->

<!-- Good: Native HTML -->
<button disabled>Submit</button>

<!-- Unnecessary ARIA: -->
<button aria-disabled="true" disabled>Submit</button>
```

### Alt Text Guidelines:
```html
<!-- Informative images -->
<img src="chart.jpg" alt="Bar chart showing 50% increase in sales">

<!-- Decorative images -->
<img src="decoration.jpg" alt="" role="presentation">

<!-- Functional images (icons in buttons) -->
<button aria-label="Close">
  <img src="close-icon.svg" alt="">
</button>
```

---

## 📚 Resources

- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **WebAIM**: https://webaim.org/
- **A11y Project**: https://www.a11yproject.com/

**Value**: 2 points

---

## 🟣 Minor Modules (1 point each)

### 1. Support for Multiple Languages (i18n)

**Make your application available in at least 3 languages**

---

#### Requirements:
- ✅ **i18n (internationalization) system** implemented
- ✅ **At least 3 complete language translations**
- ✅ **Language switcher** in the UI
- ✅ **All user-facing text must be translatable**

---

#### Implementation with react-i18next:

**Setup:**
```bash
npm install react-i18next i18next
```

**Configuration:**
```javascript
// i18n.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          login: "Login",
          signup: "Sign Up",
          email: "Email Address",
          password: "Password"
        }
      },
      es: {
        translation: {
          welcome: "Bienvenido",
          login: "Iniciar Sesión",
          signup: "Registrarse",
          email: "Correo Electrónico",
          password: "Contraseña"
        }
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          login: "Connexion",
          signup: "S'inscrire",
          email: "Adresse Email",
          password: "Mot de passe"
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
```

**Usage in Components:**
```jsx
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>{t('welcome')}</h1>

      <div className="language-switcher">
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('es')}>Español</button>
        <button onClick={() => changeLanguage('fr')}>Français</button>
      </div>

      <form>
        <label>{t('email')}</label>
        <input type="email" />

        <label>{t('password')}</label>
        <input type="password" />

        <button>{t('login')}</button>
      </form>
    </div>
  );
}
```

**With Variables:**
```javascript
// Translation file
{
  "greeting": "Hello, {{name}}!",
  "items_count": "You have {{count}} items"
}

// Usage
t('greeting', { name: 'John' }) // "Hello, John!"
t('items_count', { count: 5 }) // "You have 5 items"
```

**Value**: 1 point

---

### 2. Right-to-Left (RTL) Language Support

**Support languages that read from right to left**

---

#### Requirements:
- ✅ Support for **at least one RTL language** (Arabic, Hebrew, etc.)
- ✅ **Complete layout mirroring** (not just text direction)
- ✅ **RTL-specific UI adjustments** where needed
- ✅ **Seamless switching** between LTR and RTL

---

#### Implementation:

**CSS for RTL:**
```css
/* Use logical properties */
.card {
  /* Instead of margin-left */
  margin-inline-start: 20px;

  /* Instead of padding-right */
  padding-inline-end: 10px;

  /* Instead of text-align: left */
  text-align: start;
}

/* RTL-specific styles */
[dir="rtl"] .arrow-icon {
  transform: scaleX(-1); /* Flip horizontal */
}

[dir="rtl"] .back-button {
  /* Adjust positioning for RTL */
  right: auto;
  left: 10px;
}
```

**JavaScript Integration:**
```javascript
// Detect and set direction
function setDirection(language) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = language;
}

// With react-i18next
i18next.on('languageChanged', (lng) => {
  setDirection(lng);
});
```

**React Component:**
```jsx
function App() {
  const { i18n } = useTranslation();
  const isRTL = ['ar', 'he'].includes(i18n.language);

  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <div className={isRTL ? 'rtl-layout' : 'ltr-layout'}>
      {/* Content */}
    </div>
  );
}
```

**RTL Translations:**
```javascript
{
  ar: {
    translation: {
      welcome: "مرحباً",
      login: "تسجيل الدخول",
      signup: "التسجيل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور"
    }
  }
}
```

**Value**: 1 point

---

### 3. Support for Additional Browsers

**Ensure full compatibility beyond Chrome**

---

#### Requirements:
- ✅ Full compatibility with **at least 2 additional browsers**:
  - Firefox
  - Safari
  - Edge
  - Opera
- ✅ **Test and fix all features** in each browser
- ✅ **Document any browser-specific limitations**
- ✅ **Consistent UI/UX** across all supported browsers

---

#### Testing Strategy:

**Cross-Browser Testing Tools:**
- BrowserStack
- CrossBrowserTesting
- LambdaTest
- Manual testing on each browser

**Common Browser Differences:**

```javascript
// Feature detection instead of browser detection
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Fallback
}

// CSS with vendor prefixes
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

**Browser Compatibility Checklist:**
- [ ] All JavaScript features work
- [ ] CSS renders correctly
- [ ] Forms function properly
- [ ] Media (images, videos) load
- [ ] Animations run smoothly
- [ ] WebSockets/API calls work
- [ ] No console errors
- [ ] Performance is acceptable

**Value**: 1 point

---

