# 📋 General Requirements

## 🌐 Core Project Structure

Your project **must** be a web application consisting of:
- 🎨 **Frontend**
- ⚙️ **Backend**
- 🗄️ **Database**

---

## 🔄 Git Requirements

### Version Control Best Practices

✅ **Required Git Practices:**
- Clear and meaningful commit messages
- Commits from **all team members**
- Proper work distribution visible in commit history

**What evaluators will check:**
- Commit quality and clarity
- Fair contribution from all members
- Professional version control practices

---

## 🐳 Deployment

### Containerization (Required)

- Use **Docker**, **Podman**, or equivalent
- Deployment must run with a **single command**

**Example**: `docker-compose up`

---

## 🌐 Browser Compatibility

### Primary Support
- ✅ **Google Chrome** (latest stable version)

### Console Requirements
- ⚠️ **No warnings or errors** should appear in the browser console
- All functionality must work without console errors

---

## 📄 Legal Pages (Mandatory)

### Required Pages:
1. 🔒 **Privacy Policy**
2. 📜 **Terms of Service**

### Requirements:
- ✅ Easily accessible (e.g., footer links)
- ✅ Contain relevant and appropriate content for your project
- ✅ **Not placeholder or empty pages**

> **⚠️ Critical**: Missing or inadequate Privacy Policy/Terms of Service pages will result in **project rejection**.

---

## 👥 Multi-User Support (Mandatory)

### Core Requirement

Your website **must** support **multiple users simultaneously**.

### What This Means:

✅ **Multiple users can:**
- Log in and be active at the same time
- Interact with the application concurrently

✅ **System must handle:**
- Concurrent actions by different users properly
- Real-time updates reflected across all connected users (when applicable)
- No data corruption or race conditions
- No performance issues with simultaneous user actions

### Testing Considerations:
- Test with multiple browser sessions
- Verify data consistency
- Check for race conditions
- Monitor performance under load

---

## 📌 Summary Checklist

Before submission, verify:

- [ ] Frontend, Backend, and Database implemented
- [ ] Git history shows proper team contributions
- [ ] Single-command deployment works
- [ ] Chrome compatibility verified
- [ ] No console errors
- [ ] Privacy Policy page complete and accessible
- [ ] Terms of Service page complete and accessible
- [ ] Multi-user functionality tested and working
- [ ] Concurrent user actions handled properly
- [ ] Real-time updates working correctly

---

## 🎯 Note

These are **non-negotiable** requirements. Failing to meet any of them will result in project failure, regardless of how good our modules are.
