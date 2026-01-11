# 👾 Ft_Transcendence

*This project has been created as part of the 42 curriculum by [kbolon](https://profile.intra.42.fr/users/kbolon), [jadyar](https://profile.intra.42.fr/users/jadyar), [fdunkel](https://profile.intra.42.fr/users/fdunkel) and [keramos-](https://profile.intra.42.fr/users/keramos-)*

---

## 📋 Table of Contents

- [Description](#-description)
- [Team Information](#-team-information)
- [Project Management](#-project-management)
- [Technical Stack](#-technical-stack)
- [Database Schema](#-database-schema)
- [Features List](#-features-list)
- [Modules](#-modules)
- [Individual Contributions](#-individual-contributions)
- [Instructions](#-instructions)
- [Resources](#-resources)
- [Screenshots](#-screenshots)
- [Known Limitations](#-known-limitations)
- [License](#-license)

---

## 🎯 Description

### Project Name: **[Your Project Name]**

<!-- Brief overview of what your project is about -->
ft_transcendence is a modern, multiplayer Pong game built as the final project of the 42 Common Core curriculum.

The project demonstrates proficiency in web development, real-time communication, database management, and DevOps practices.

### Key Features
- 🎮 **Classic Pong Gameplay** - Authentic recreation of the classic 1972 game
- 👥 **Multiplayer Support** - Play against friends online in real-time
- 🏆 **Tournament System** - Organize and participate in brackets
- 📊 **Statistics Dashboard** - Track your wins, losses, and progress
- 🔐 **Secure Authentication** - Password hashing and JWT token system
- 🌐 **Multiple Languages** - Full internationalization support
- 🎨 **Customization** - Personalize your gaming experience
- 💬 **Live Chat** - Communicate with other players

### Project Goals
The primary goals of this project are to:
1. Implement secure user authentication and authorization
2. Handle real-time multiplayer game state synchronization
3. Design and implement a scalable database schema
4. Deploy containerized applications using Docker
5. Collaborate effectively as a development team

---

## 🚀 Instructions

### Prerequisites

Before running this project, ensure you have the following installed:

#### Required Software
- **Docker** (version 20.10+)
  - Download: https://docs.docker.com/get-docker/
  - Verify: `docker --version`
- **Docker Compose** (version 2.0+)
  - Usually included with Docker Desktop
  - Verify: `docker-compose --version`
- **Git** (version 2.0+)
  - Download: https://git-scm.com/downloads
  - Verify: `git --version`

#### Optional Tools
- **Node.js** (version 20+) - For local development
- **PostgreSQL Client** - For database inspection
- **Postman** - For API testing

1. **Clone the repository:**
```bash
   git clone https://github.com/kellenr/Ft_Transcendence.git
   cd Ft_Transcendence
```

2. **Set up environment variables:**
```bash
   # example environment file:
```

3. **Build and start the application:**
```bash
   make start
   # Or using docker-compose directly:
   docker-compose up --build -d
```

4. **Access the application:**
   - Open your browser and navigate to: `https://localhost`
   - Create an account or log in with 42 OAuth

### Common Commands

```bash
      # examples...
```

### Troubleshooting

```bash
      # examples...
```

---

## 👥 Team Information

### Team Members:

#### 👤 Karen Bolon - [@kbolon](https://profile.intra.42.fr/users/kbolon)
- **Role(s)**: Developer
- **Responsibilities**:
  - [Responsibility]


#### 👤  James Dyar - [@jadyar](https://profile.intra.42.fr/users/jadyar)
- **Role(s)**: Developer
- **Responsibilities**:
  - [Responsibility]

#### 👤 Finn Dunkel - [@fdunkel](https://profile.intra.42.fr/users/fdunkel)
- **Role(s)**: Developer
- **Responsibilities**:
  - [Responsibility]

#### 👤 Kellen Ramos - [@keramos-](https://profile.intra.42.fr/users/keramos-)
- **Role(s)**: Developer
- **Responsibilities**:
  - [Responsibility]

---

## 🗂️ Project Management

### Work Organization

#### Team Structure
We organized as a cross-functional Agile team with:
- **Product Owner (PO):** Defines features and priorities
- **Project Manager (PM):** Coordinates work and removes blockers
- **Technical Lead:** Guides technical decisions
- **Developers:** All team members contribute to implementation

**Meeting Schedule:**
- [e.g., Weekly meetings every Monday at 10:00 AM]
- [Daily stand-ups at 9:00 AM]
- [Code review sessions every Wednesday]

#### Development Process
1. **Sprint Planning (Weekly):** Plan the week's work
2. **Daily Standups (15 min):** Share progress and blockers
3. **Code Reviews (2-3x/week):** Review and merge PRs
4. **Sprint Retrospective (Weekly):** Reflect and improve

#### Task Distribution
- Tasks assigned based on expertise and interest
- Pair programming for complex features
- All members participate in code reviews
- Rotating responsibility for code review leadership

### Tools Used

**Project Management:**
- 📊 **GitHub Projects** - https://github.com/your-team/ft_transcendence/projects
  - Kanban board for task visualization
  - Issue tracking for bugs and features
  - Milestone tracking for sprints
  - Integrated with repository

**Communication:**
- 💬 **Discord Server** - [Link if applicable]
  - Daily standups channel
  - General discussion
  - Code help and pair programming
  - Celebration of achievements 🎉

**Version Control:**
- 🔄 **Git/GitHub**
  - Feature branch workflow
  - Pull request reviews required
  - Automated testing via GitHub Actions
  - Protected main branch

### Workflow

```
[Describe your typical workflow, e.g.:]

1. Task assignment in [Project Management Tool]
2. Create feature branch
3. Development and testing
4. Pull request + code review
5. Merge to main
6. Deployment
```

---

## 🔧 Technical Stack

### Frontend Technologies

**Framework:**
- 🎨 **Core Framework**
  - **React 18** - Component-based UI library
    - Version: [x.x.x]
    - **Why React:**
      - Component reusability
      - Strong ecosystem and community
      - Excellent TypeScript support
      - Virtual DOM for performance
      - Team familiarity
  - **TypeScript** - Type-safe JavaScript
    - Version: [x.x.x]
    - Reason: [Why did you choose this?]
  - **Vite** - Fast build tool and dev server
    - Version: [x.x.x]
    - Reason: [Why did you choose this?]

**Styling & UI:**
- 💅 **Tailwind CSS** - Utility-first CSS framework
  - **Why Tailwind:**
    - Rapid development
    - Consistent design system
    - No CSS file management
    - Responsive design utilities
- 🎨 **Custom Components** - Reusable UI components
  - Reason: [Why this choice?]

**State Management & Routing:**
- 🔄 **[Library]** (e.g., Redux, Zustand, Context API)

**Other Libraries:**
- [Library 1]: [Purpose]
- [Library 2]: [Purpose]
- [Library 3]: [Purpose]

### Backend Technologies

**Core Framework:**
- ⚙️ **Fastify** - Fast and low-overhead web framework for Node.js
  - Version: [x.x.x]
  - **Why Fastify:**
    - Extremely fast (one of the fastest Node.js frameworks)
    - Excellent TypeScript support
    - Plugin architecture
    - Built-in validation and serialization
    - Low overhead
- **Node.js 20** - JavaScript runtime
- **TypeScript** - Type-safe backend code

**API Type:**
- 🔌 **[REST/GraphQL/WebSocket]**

**Authentication:**
- 🔐 **[Method]** (e.g., JWT, OAuth 2.0, Passport.js)

**Other Libraries:**
- [Library 1]: [Purpose]
- [Library 2]: [Purpose]
- [Library 3]: [Purpose]

### Database

**Database System:**
- 🗄️ **PostgreSQL 16** - Relational database
  - Version: [x.x.x]
  - **Why PostgreSQL:**
    - ACID compliance (data integrity)
    - Excellent for relational data (users, games, tournaments)
    - JSON support for flexibility
    - Robust and battle-tested
    - Great performance with proper indexing
- **pg** - PostgreSQL client for Node.js

**ORM/ODM:**
- **[Tool Name]** (e.g., Prisma, Sequelize, Mongoose)
  - Reason: [Type safety, migrations, etc.]

### Other Significant Technologies
<!--
**Real-Time Communication:**
- 🔴 **Socket.io** - WebSocket library for multiplayer game sync
  **Why Socket.io:**
    - Automatic reconnection
    - Room support for game lobbies
    - Fallback to polling if WebSocket unavailable
    - Event-based architecture
    - Excellent documentation

**Containerization:**
- 🐳 **Docker** + **Docker Compose**
  - All services containerized
  - Single-command deployment

**Testing:**
- 🧪 **[Framework]** (e.g., Jest, Pytest, Vitest)

**Additional Tools:**
- [Tool 1]: [Purpose]
- [Tool 2]: [Purpose]

### Justification for Major Technical Choices

**Why [Framework Choice]?**
- [Reason 1: e.g., team familiarity]
- [Reason 2: e.g., ecosystem and community]
- [Reason 3: e.g., performance considerations]

**Why [Database Choice]?**
- [Reason 1: e.g., relational data requirements]
- [Reason 2: e.g., scalability]
- [Reason 3: e.g., ACID compliance needs]

**Why [Architecture Pattern]?**
- [Explain your architecture decisions]
-->
---

## 🗄️ Database Schema

### Visual Representation

```
[Add a database diagram here - you can use tools like:]
- dbdiagram.io
- drawSQL
- Mermaid ERD
- Or a screenshot from your database tool
```

### Tables/Collections

#### Users Table
```sql
--   example.
```
<!--
```sql
users (
  id: UUID PRIMARY KEY,
  username: VARCHAR(50) UNIQUE NOT NULL,
  email: VARCHAR(255) UNIQUE NOT NULL,
  password_hash: VARCHAR(255) NOT NULL,
  avatar_url: VARCHAR(255),
  created_at: TIMESTAMP DEFAULT NOW(),
  updated_at: TIMESTAMP DEFAULT NOW()
)
``` -->

#### [Other Table Name]
```sql
--   example.
```
<!--
```sql
[table_name] (
  id: UUID PRIMARY KEY,
  [field_name]: [TYPE] [CONSTRAINTS],
  [field_name]: [TYPE] [CONSTRAINTS],
  ...
)
``` -->

<!-- ### Relationships

- **Users ↔ [Table]**: [Describe relationship]
- **[Table] ↔ [Table]**: [Describe relationship]
- **[Table] ↔ [Table]**: [Describe relationship]

### Key Fields Explanation

**Security Fields:**
- `password_hash`: [e.g., Hashed using bcrypt with salt rounds of 12]
- `refresh_token`: [Purpose and security measures]

**Timestamp Fields:**
- `created_at`: [When the record was created]
- `updated_at`: [Automatically updated on modification] -->

---

## ⚡ Features List

<!-- ### Feature 1: [Feature Name]

**Description:** [What does this feature do?]

**Implemented by:** [@login1, @login2]

**Functionality:**
- [Sub-feature 1]
- [Sub-feature 2]
- [Sub-feature 3]

**Technical Details:**
- [Technology used]
- [Challenges faced]
- [How it works]

---

### Feature 2: [Feature Name]

**Description:** [What does this feature do?]

**Implemented by:** [@login2]

**Functionality:**
- [Sub-feature 1]
- [Sub-feature 2]

**Technical Details:**
- [Technology used]
- [Implementation details]

---

### Feature 3: [Feature Name]

**Description:** [What does this feature do?]

**Implemented by:** [@login3, @login1]

**Functionality:**
- [Sub-feature 1]
- [Sub-feature 2]
- [Sub-feature 3]

---

### [Add more features as needed...] -->

---

## 🎮 Modules

### Module Selection Summary

**Total Points: [X] / 14**

| Category | Module | Type | Points | Status |
|----------|--------|------|--------|--------|
| Web | [Module Name] | Major | 2 | ✅ Complete |
| User Management | [Module Name] | Major | 2 | ✅ Complete |
| Gaming | [Module Name] | Minor | 1 | ✅ Complete |
| AI | [Module Name] | Major | 2 | ✅ Complete |
| ... | ... | ... | ... | ... |

### Detailed Module Information

---

#### 🔵 Major Module: [Module Name] (2 points)

**Category:** [Web / User Management / Gaming / etc.]

**Implemented by:** [@login1, @login2]

**Description:**
[What does this module add to your project?]

**Requirements Met:**
- ✅ [Requirement 1]
- ✅ [Requirement 2]
- ✅ [Requirement 3]

**Implementation Details:**
[How did you implement this? What technologies? What challenges?]

**Code Location:**
- Frontend: `[path/to/code]`
- Backend: `[path/to/code]`

---

#### 🟣 Minor Module: [Module Name] (1 point)

**Category:** [Category]

**Implemented by:** [@login3]

**Description:**
[Brief description]

**Requirements Met:**
- ✅ [Requirement 1]
- ✅ [Requirement 2]

**Implementation Details:**
[Implementation details]

---

#### ⭐ Custom Module: [Module Name] (Major - 2 points)

**Category:** Modules of Choice

**Implemented by:** [@login1, @login3]

**Why We Chose This Module:**
[Explain the problem this solves and why it's important]

**Technical Challenges:**
1. [Challenge 1]: [Description]
2. [Challenge 2]: [Description]
3. [Challenge 3]: [Description]

**Value Added:**
[How does this enhance your project?]

**Major Status Justification:**
- **Complexity**: [Why it's complex]
- **Time Investment**: [~XX hours of work]
- **Technical Skills**: [What skills were required]
- **Uniqueness**: [Why it stands out]

**Implementation:**
[How you built it]

**Technologies Used:**
- [Technology 1]
- [Technology 2]

---

### [Add all your modules following the same pattern...]

---

## 💡 Individual Contributions

### [@login1] - [Member Name]

**Roles:** Product Owner, Frontend Developer

**Features Implemented:**
- ✅ [Feature 1] - [Brief description]
- ✅ [Feature 2] - [Brief description]
- ✅ [Feature 3] - [Brief description]

**Modules Worked On:**
- [Module 1] (Major - 2pts)
- [Module 2] (Minor - 1pt)

**Components/Files:**
- `[path/to/component1]` - [Purpose]
- `[path/to/component2]` - [Purpose]
- `[path/to/file]` - [Purpose]

**Challenges Faced:**
1. **[Challenge 1]**
   - Problem: [Description]
   - Solution: [How you solved it]

2. **[Challenge 2]**
   - Problem: [Description]
   - Solution: [How you solved it]

**Key Learnings:**
- [What you learned from this project]

---

<!-- ### [@login2] - [Member Name]

**Roles:** Project Manager, Backend Developer

**Features Implemented:**
- ✅ [Feature 1] - [Brief description]
- ✅ [Feature 2] - [Brief description]

**Modules Worked On:**
- [Module 1] (Major - 2pts)
- [Module 2] (Minor - 1pt)

**Components/Files:**
- `[path/to/file1]` - [Purpose]
- `[path/to/file2]` - [Purpose]

**Challenges Faced:**
1. **[Challenge 1]**
   - Problem: [Description]
   - Solution: [How you solved it]

**Key Learnings:**
- [What you learned]

---

### [@login3] - [Member Name]

**Roles:** Technical Lead, Full-Stack Developer

**Features Implemented:**
- ✅ [Feature 1] - [Brief description]
- ✅ [Feature 2] - [Brief description]

**Modules Worked On:**
- [Module 1] (Major - 2pts)
- [Module 2] (Major - 2pts)

**Components/Files:**
- `[path/to/file1]` - [Purpose]
- `[path/to/file2]` - [Purpose]

**Challenges Faced:**
1. **[Challenge 1]**
   - Problem: [Description]
   - Solution: [How you solved it]

**Key Learnings:**
- [What you learned]

---

## 📚 Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **[Software 1]** (Version X.X or higher)
  - Download: [link]
  - Purpose: [what it's for]

- ✅ **[Software 2]** (Version X.X or higher)
  - Download: [link]
  - Purpose: [what it's for]

- ✅ **Docker** and **Docker Compose**
  - Docker: [version]
  - Docker Compose: [version]

- ✅ **[Other requirements]**

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[username]/ft_transcendence.git
   cd ft_transcendence
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file:**
   ```env
   # Database
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=transcendence
   DB_USER=your_user
   DB_PASSWORD=your_password

   # JWT
   JWT_SECRET=your_jwt_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here

   # OAuth (if applicable)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret

   # Other configurations
   [Add your other environment variables]
   ```

### Installation & Running

**Option 1: Using Docker (Recommended)**

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

The application will be available at:
- Frontend: `http://localhost:[PORT]`
- Backend API: `http://localhost:[PORT]`
- [Other services]

**Option 2: Manual Setup**

If you prefer to run without Docker:

1. **Install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

2. **Set up the database:**
   ```bash
   # Run migrations
   [command to run migrations]

   # Seed the database (optional)
   [command to seed]
   ```

3. **Start the development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Stopping the Application

```bash
# If using Docker
docker-compose down

# To remove volumes as well
docker-compose down -v
```

### Running Tests

```bash
# Run all tests
[command to run tests]

# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

### Troubleshooting

**Issue: [Common Problem 1]**
- Solution: [How to fix it]

**Issue: [Common Problem 2]**
- Solution: [How to fix it]
-->
---

## 📖 Resources

### Documentation

**Official Documentation:**
- [Framework Documentation]: [link]
- [Database Documentation]: [link]
- [Library Documentation]: [link]

**Tutorials Used:**
- [Tutorial 1 Title]: [link] - [What you learned from it]
- [Tutorial 2 Title]: [link] - [What you learned from it]

**Articles & References:**
- [Article 1]: [link] - [Key takeaways]
- [Article 2]: [link] - [Key takeaways]

### AI Usage

**AI Tools Used:**
- **[AI Tool Name]** (e.g., ChatGPT, Claude, GitHub Copilot)

**Tasks AI Was Used For:**

1. **[Task 1]** - [e.g., Code suggestions for complex algorithms]
   - Parts affected: [Specific files or features]
   - How: [How AI helped]

2. **[Task 2]** - [e.g., Debugging assistance]
   - Parts affected: [Specific issues]
   - How: [How AI helped]

3. **[Task 3]** - [e.g., Documentation writing]
   - Parts affected: [What parts]
   - How: [How AI helped]

**Important Note:**
[Explain how you used AI responsibly, verified outputs, and learned from the process]

---

## 📸 Screenshots

<!-- ### Home Page
![Home Page](./screenshots/home.png)
*[Brief description of what's shown]*

### [Feature Name]
![Feature Screenshot](./screenshots/feature1.png)
*[Brief description]*

### [Feature Name]
![Feature Screenshot](./screenshots/feature2.png)
*[Brief description]*

### Game/Main Feature
![Game Screenshot](./screenshots/game.png)
*[Brief description]*

### [Add more screenshots as needed]

---

## ⚠️ Known Limitations

- ⚠️ [Limitation 1]: [Description and potential workaround]
- ⚠️ [Limitation 2]: [Description]
- ⚠️ [Limitation 3]: [Description]

### Future Improvements

If we had more time, we would:
- 🔮 [Improvement 1]
- 🔮 [Improvement 2]
- 🔮 [Improvement 3]
-->
---

## 📄 License

[Choose a license or state "Educational project for 42 School"]

---

## 🙏 Acknowledgments

Special thanks to:
- **42 School** for the project specifications
- **[Mentor/Helper Name]** for guidance on [topic]
- **[Resource Name]** for [what it provided]
- Our evaluators for their feedback

---

## 📞 Contact

For questions or feedback, reach out to:

| Name | ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) | ![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) | ![42](https://img.shields.io/badge/-42-black?style=for-the-badge&logo=42&logoColor=white) |
|------|--------|----------|-------|
| 🌷 @karen | [KarenBolon](https://github.com/karenbolon) | [Karen Bolon](https://www.linkedin.com/in/karen-linkedin/) | |

<!--
**or this**
- @kbolon:
  * [![GitHub](https://img.shields.io/badge/GitHub-karen-black?style=for-the-badge&logo=github)](https://github.com/karenbolon)
  * [![LinkedIn](https://img.shields.io/badge/LinkedIn-karen-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/your-linkedin/)

- @jadyar:
  * [![GitHub](https://img.shields.io/badge/GitHub-james-black?style=for-the-badge&logo=github)](https://github.com/)
  * [![LinkedIn](https://img.shields.io/badge/LinkedIn-James-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/your-linkedin/)
- @fdunkel:
  * [![GitHub](https://img.shields.io/badge/GitHub-fin-black?style=for-the-badge&logo=github)](https://github.com/)
  * [![LinkedIn](https://img.shields.io/badge/LinkedIn-fin-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/your-linkedin/)

Project Link: [https://github.com/[username]/ft_transcendence](https://github.com/[username]/ft_transcendence)

---
-->

---

<div align="center">

**Made with 💜 by [Team Name]**

*42 School - ft_transcendence Project*

</div>