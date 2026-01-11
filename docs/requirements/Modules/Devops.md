# 🚀 DevOps Modules

## 🔵 Major Modules (2 points each)

### 1. ELK Stack - Log Management Infrastructure

**ELK = Elasticsearch + Logstash + Kibana**

---

#### 📊 What is ELK?
A powerful stack for centralized logging, searching, and visualization.

#### Requirements:

**1. Elasticsearch**
- ✅ Store and index logs
- ✅ Fast search capabilities
- ✅ Scalable data storage

**2. Logstash**
- ✅ Collect logs from various sources
- ✅ Transform and parse log data
- ✅ Send processed logs to Elasticsearch

**3. Kibana**
- ✅ Visualization and dashboards
- ✅ Search interface
- ✅ Real-time monitoring

**Additional Requirements:**
- ✅ **Log retention policies** (how long to keep logs)
- ✅ **Archiving policies** (where to move old logs)
- ✅ **Secure access** to all components

---

#### 🏗️ Architecture:
```
[Application] → [Logstash] → [Elasticsearch] → [Kibana]
     ↓              ↓               ↓              ↓
  Logs         Process         Store          Visualize
              Transform       Index           Analyze
              Filter          Search          Dashboard
```

---

#### 💻 Implementation Example:

**Docker Compose:**
```yaml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data

  logstash:
    image: logstash:8.11.0
    ports:
      - "5000:5000"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  es-data:
```

**Logstash Configuration:**
```ruby
input {
  tcp {
    port => 5000
    codec => json
  }
}

filter {
  if [level] == "ERROR" {
    mutate {
      add_tag => ["error"]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
}
```

---

#### 📋 Features to Implement:

**Log Collection:**
- Application logs
- Error logs
- Access logs
- System logs

**Dashboards:**
- Error rate over time
- Request volume
- Response times
- User activity

**Alerts:**
- Error spikes
- System failures
- Performance degradation

**Value**: 2 points

---

### 2. Prometheus + Grafana - Monitoring System

**Complete monitoring and visualization solution**

---

#### 📊 What are Prometheus & Grafana?

**Prometheus**: Time-series database for metrics
**Grafana**: Visualization and dashboarding platform

#### Requirements:

**1. Prometheus**
- ✅ Collect metrics from services
- ✅ Store time-series data
- ✅ Alert on conditions

**2. Exporters**
- ✅ Configure exporters for your services
- ✅ Node exporter (system metrics)
- ✅ Custom application metrics

**3. Grafana**
- ✅ Create custom dashboards
- ✅ Visualize metrics
- ✅ Connect to Prometheus

**4. Alerting**
- ✅ Set up alerting rules
- ✅ Configure notification channels
- ✅ Define alert conditions

**5. Security**
- ✅ Secure access to Grafana
- ✅ Authentication and authorization

---

#### 🏗️ Architecture:
```
[Application] → [Prometheus] → [Grafana]
     ↓              ↓              ↓
  Metrics       Collect        Visualize
  Expose        Store          Dashboard
                Query          Alert
```

---

#### 💻 Implementation Example:

**Docker Compose:**
```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prom-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter
    ports:
      - "9100:9100"

volumes:
  prom-data:
  grafana-data:
```

**Prometheus Configuration:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'my-app'
    static_configs:
      - targets: ['app:8080']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - 'alerts.yml'
```

**Alert Rules:**
```yaml
groups:
  - name: example
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status="500"}[5m]) > 0.05
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
```

---

#### 📊 Metrics to Track:

**Application Metrics:**
- Request rate
- Response times
- Error rates
- Active users

**System Metrics:**
- CPU usage
- Memory usage
- Disk I/O
- Network traffic

**Business Metrics:**
- Sign-ups
- Conversions
- Active sessions
- Feature usage

**Value**: 2 points

---

### 3. Backend as Microservices

**Build a scalable, loosely-coupled architecture**

---

#### 🏗️ What are Microservices?

Breaking your backend into **small, independent services** that communicate with each other.

#### Requirements:

**1. Service Design**
- ✅ **Loosely-coupled services** with clear interfaces
- ✅ **Each service has a single responsibility**
- ✅ Services can be deployed independently

**2. Communication**
- ✅ Use **REST APIs** for synchronous communication
- ✅ OR use **message queues** for asynchronous communication

**3. Best Practices**
- Service discovery
- Load balancing
- Health checks
- Circuit breakers

---

#### 🎯 Example Architecture:

```
                    API Gateway
                         ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
   Auth Service   User Service   Game Service
        ↓               ↓               ↓
   Auth DB         User DB        Game DB

Communication via REST APIs or Message Queue
```

---

#### 💻 Service Examples:

**Auth Service:**
```javascript
// auth-service/server.js
app.post('/api/auth/login', async (req, res) => {
  // Handle authentication
  const token = generateToken(user);
  res.json({ token });
});

app.get('/api/auth/verify', async (req, res) => {
  // Verify token
  const valid = verifyToken(req.headers.authorization);
  res.json({ valid });
});
```

**User Service:**
```javascript
// user-service/server.js
app.get('/api/users/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
  await updateUser(req.params.id, req.body);
  res.json({ success: true });
});
```

**Game Service:**
```javascript
// game-service/server.js
app.post('/api/games', async (req, res) => {
  // Verify user with Auth Service
  const authResult = await fetch('http://auth-service/api/auth/verify', {
    headers: { authorization: req.headers.authorization }
  });

  if (authResult.valid) {
    const game = await createGame(req.body);
    res.json(game);
  }
});
```

---

#### 🔗 Inter-Service Communication:

**REST API:**
```javascript
// Service A calls Service B
const response = await fetch('http://service-b/api/endpoint');
const data = await response.json();
```

**Message Queue (RabbitMQ):**
```javascript
// Service A publishes message
channel.sendToQueue('user-created', Buffer.from(JSON.stringify(userData)));

// Service B consumes message
channel.consume('user-created', (msg) => {
  const userData = JSON.parse(msg.content.toString());
  handleNewUser(userData);
});
```

---

#### 📦 Docker Compose Example:

```yaml
version: '3.8'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"

  auth-service:
    build: ./auth-service
    environment:
      DB_HOST: auth-db

  user-service:
    build: ./user-service
    environment:
      DB_HOST: user-db

  game-service:
    build: ./game-service
    environment:
      DB_HOST: game-db

  auth-db:
    image: postgres:15

  user-db:
    image: postgres:15

  game-db:
    image: postgres:15
```

---

#### ✅ Benefits:
- Independent scaling
- Technology flexibility
- Isolated failures
- Easier testing
- Team independence

#### ⚠️ Challenges:
- Network latency
- Data consistency
- Monitoring complexity
- Deployment coordination

**Value**: 2 points

---

## 🟣 Minor Module (1 point)

### Health Check and Status Page System

**Monitor service health with automated backups and disaster recovery**

---

#### Requirements:

**1. Health Checks**
- ✅ Endpoint to check service health (`/health`)
- ✅ Check database connectivity
- ✅ Check external dependencies
- ✅ Return detailed status

**2. Status Page**
- ✅ Public-facing status page
- ✅ Show service status (operational, degraded, down)
- ✅ Historical uptime data
- ✅ Incident history

**3. Automated Backups**
- ✅ Regular database backups
- ✅ Backup verification
- ✅ Backup rotation

**4. Disaster Recovery**
- ✅ Recovery procedures documented
- ✅ Automated recovery scripts
- ✅ Test recovery process

---

#### 💻 Health Check Implementation:

```javascript
app.get('/health', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    externalAPI: false
  };

  try {
    await db.query('SELECT 1');
    checks.database = true;
  } catch (error) {
    console.error('Database check failed:', error);
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis check failed:', error);
  }

  const allHealthy = Object.values(checks).every(v => v);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  });
});
```

---

#### 📊 Status Page Example:

```html
<!DOCTYPE html>
<html>
<head>
  <title>System Status</title>
</head>
<body>
  <h1>🟢 All Systems Operational</h1>

  <div class="service">
    <h2>API Server</h2>
    <span class="status operational">Operational</span>
    <p>Uptime: 99.9%</p>
  </div>

  <div class="service">
    <h2>Database</h2>
    <span class="status operational">Operational</span>
    <p>Response Time: 12ms</p>
  </div>

  <h2>Incident History</h2>
  <ul>
    <li>2024-01-05: Database maintenance - Resolved</li>
  </ul>
</body>
</html>
```

---

#### 💾 Backup Script:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup database
pg_dump mydb > "$BACKUP_DIR/db_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_$DATE.sql"

# Upload to cloud storage (optional)
aws s3 cp "$BACKUP_DIR/db_$DATE.sql.gz" s3://my-backups/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

---

#### 🔄 Automated Backup with Cron:

```cron
# Run backup daily at 2 AM
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

---

#### 🚨 Recovery Procedure:

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore.sh <backup_file>"
  exit 1
fi

# Stop application
docker-compose down

# Restore database
gunzip -c "$BACKUP_FILE" | psql mydb

# Start application
docker-compose up -d

echo "Recovery completed from: $BACKUP_FILE"
```

**Value**: 1 point

---

## 💡 General DevOps Tips

### Best Practices:
- **Automate everything** possible
- **Monitor continuously**
- **Document procedures**
- **Test recovery plans**
- **Use infrastructure as code**

### Tools Ecosystem:
- **Container Orchestration**: Kubernetes, Docker Swarm
- **CI/CD**: GitHub Actions, GitLab CI, Jenkins
- **Infrastructure**: Terraform, Ansible
- **Monitoring**: Datadog, New Relic (alternatives)

---

## 🧪 Testing Checklist

### ELK Stack:
- [ ] Logs are being collected
- [ ] Logs are searchable in Elasticsearch
- [ ] Kibana dashboards display data
- [ ] Retention policies work
- [ ] Access is secured

### Prometheus/Grafana:
- [ ] Metrics are being collected
- [ ] Dashboards show real-time data
- [ ] Alerts trigger correctly
- [ ] Notifications are sent
- [ ] Access is secured

### Microservices:
- [ ] Services are independent
- [ ] Communication works
- [ ] Services can be deployed separately
- [ ] Failures are isolated
- [ ] Health checks work

### Health Checks:
- [ ] Health endpoint returns correct status
- [ ] Status page is accessible
- [ ] Backups run automatically
- [ ] Backups can be restored
- [ ] Recovery procedures tested

---

