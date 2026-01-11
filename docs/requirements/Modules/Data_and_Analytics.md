# 📈 Data and Analytics Modules

## 🔵 Major Module (2 points)

### Advanced Analytics Dashboard with Data Visualization

**Create a comprehensive dashboard for data analysis and visualization**

---

## 📊 What is an Analytics Dashboard?

An interactive interface that displays key metrics, trends, and insights through visual representations of data.

---

## ✅ Requirements

### 1. Interactive Charts and Graphs
- ✅ **Line charts** (trends over time)
- ✅ **Bar charts** (comparisons)
- ✅ **Pie charts** (proportions)
- ✅ Additional chart types (scatter, area, heatmaps, etc.)

### 2. Real-Time Data Updates
- ✅ Data refreshes automatically
- ✅ WebSocket or polling for live updates
- ✅ Smooth transitions between states

### 3. Export Functionality
- ✅ **PDF export** (save dashboard as PDF)
- ✅ **CSV export** (download data tables)
- ✅ **Excel export** (optional)
- ✅ Image export (chart screenshots)

### 4. Customizable Filters
- ✅ **Date range filters** (today, week, month, custom)
- ✅ **Category filters** (by user, type, status, etc.)
- ✅ **Search functionality**
- ✅ **Multiple filter combinations**

---

## 🎨 Recommended Charting Libraries

### Popular Options:

**Chart.js** - Simple and flexible
```javascript
import { Line } from 'react-chartjs-2';

<Line data={chartData} options={options} />
```

**Recharts** - React-native charts
```javascript
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart data={data}>
  <XAxis dataKey="name" />
  <YAxis />
  <Line type="monotone" dataKey="value" stroke="#8884d8" />
</LineChart>
```

**D3.js** - Highly customizable (more complex)
**Plotly** - Interactive and publication-quality
**Apache ECharts** - Feature-rich

---

## 💻 Implementation Example

### Dashboard Component:

```javascript
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';

function AnalyticsDashboard() {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all'
  });

  // Fetch data with filters
  useEffect(() => {
    fetchAnalytics(dateRange, filters);
  }, [dateRange, filters]);

  // Real-time updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/analytics');
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(prevData => [...prevData, newData]);
    };
    return () => ws.close();
  }, []);

  const exportToPDF = () => {
    // Use jsPDF or similar library
    const doc = new jsPDF();
    doc.text('Analytics Report', 10, 10);
    // Add charts and data
    doc.save('analytics-report.pdf');
  };

  const exportToCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-data.csv';
    a.click();
  };

  return (
    <div className="dashboard">
      <header>
        <h1>📊 Analytics Dashboard</h1>
        <div className="export-buttons">
          <button onClick={exportToPDF}>📄 Export PDF</button>
          <button onClick={exportToCSV}>📊 Export CSV</button>
        </div>
      </header>

      <section className="filters">
        <DatePicker
          selectsRange
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={(dates) => setDateRange({ start: dates[0], end: dates[1] })}
        />
        <select onChange={(e) => setFilters({...filters, category: e.target.value})}>
          <option value="all">All Categories</option>
          <option value="sales">Sales</option>
          <option value="users">Users</option>
        </select>
      </section>

      <section className="metrics">
        <MetricCard title="Total Users" value={data.totalUsers} trend="+12%" />
        <MetricCard title="Revenue" value={`$${data.revenue}`} trend="+8%" />
        <MetricCard title="Conversions" value={data.conversions} trend="-3%" />
      </section>

      <section className="charts">
        <div className="chart-container">
          <h3>User Growth</h3>
          <Line data={userGrowthData} />
        </div>
        <div className="chart-container">
          <h3>Revenue by Category</h3>
          <Bar data={revenueData} />
        </div>
        <div className="chart-container">
          <h3>Traffic Sources</h3>
          <Pie data={trafficData} />
        </div>
      </section>
    </div>
  );
}
```

---

## 📊 Chart Examples

### Line Chart (Trends over Time):
```javascript
const userGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Active Users',
    data: [1200, 1900, 3000, 5000, 6400, 7200],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};
```

### Bar Chart (Comparisons):
```javascript
const revenueData = {
  labels: ['Product A', 'Product B', 'Product C'],
  datasets: [{
    label: 'Revenue',
    data: [12000, 19000, 8000],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)'
    ]
  }]
};
```

### Pie Chart (Proportions):
```javascript
const trafficData = {
  labels: ['Direct', 'Social Media', 'Search', 'Referral'],
  datasets: [{
    data: [300, 150, 250, 100],
    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
  }]
};
```

---

## 🔄 Real-Time Updates

### WebSocket Implementation:

**Server (Node.js):**
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send updates every 5 seconds
  const interval = setInterval(() => {
    const analyticsData = getLatestAnalytics();
    ws.send(JSON.stringify(analyticsData));
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});
```

**Client:**
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateDashboard(data);
};
```

---

## 📄 Export Functionality

### PDF Export:
```javascript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function exportDashboardToPDF() {
  const dashboard = document.getElementById('dashboard');
  const canvas = await html2canvas(dashboard);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('analytics-dashboard.pdf');
}
```

### CSV Export:
```javascript
function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
}

// Usage
exportToCSV(analyticsData, 'analytics-report.csv');
```

---

## 📊 Key Metrics to Display

### User Analytics:
- Active users (daily/weekly/monthly)
- New registrations
- User retention rate
- Session duration
- Bounce rate

### Business Metrics:
- Revenue over time
- Conversion rate
- Average order value
- Customer lifetime value
- Churn rate

### Engagement Metrics:
- Page views
- Feature usage
- Click-through rates
- Time on site
- Popular content

### Performance Metrics:
- Page load times
- Error rates
- API response times
- Server uptime

---

## 🎨 Dashboard Design Tips

### Layout Best Practices:
```
┌─────────────────────────────────────┐
│ 📊 Analytics Dashboard       [Export]│
├─────────────────────────────────────┤
│ 🔍 Filters: [Date] [Category] [...]  │
├─────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │Metric│ │Metric│ │Metric│ │Metric││ Key metrics at top
│ └──────┘ └──────┘ └──────┘ └──────┘│
├─────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐  │
│ │   Chart 1    │ │   Chart 2    │  │ Main charts
│ └──────────────┘ └──────────────┘  │
│ ┌──────────────┐ ┌──────────────┐  │
│ │   Chart 3    │ │   Chart 4    │  │
│ └──────────────┘ └──────────────┘  │
├─────────────────────────────────────┤
│ 📋 Detailed Data Table              │ Detailed data
└─────────────────────────────────────┘
```

### Color Scheme:
- **Success/Positive**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error/Negative**: Red (#EF4444)
- **Info**: Blue (#3B82F6)
- **Neutral**: Gray (#6B7280)

---

## 🗄️ Backend Requirements

### API Endpoints:
```javascript
// GET /api/analytics?start=2024-01-01&end=2024-01-31&category=sales
router.get('/analytics', async (req, res) => {
  const { start, end, category } = req.query;
  const data = await getAnalyticsData({ start, end, category });
  res.json(data);
});

// GET /api/analytics/export/csv
router.get('/analytics/export/csv', async (req, res) => {
  const data = await getAnalyticsData(req.query);
  const csv = convertToCSV(data);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
  res.send(csv);
});
```

---

## 🧪 Testing Checklist

- [ ] All chart types render correctly
- [ ] Filters update data in real-time
- [ ] Date range picker works
- [ ] Real-time updates function properly
- [ ] PDF export generates correct file
- [ ] CSV export downloads correct data
- [ ] Dashboard is responsive on mobile
- [ ] Loading states are shown
- [ ] Error handling works
- [ ] Performance is acceptable with large datasets

---

**Value**: 2 points

---

## 🟣 Minor Modules (1 point each)

### 1. Data Export and Import Functionality

**Requirements:**

**Export:**
- ✅ Multiple formats: JSON, CSV, XML
- ✅ User-friendly download process
- ✅ Include metadata (export date, filters used)

**Import:**
- ✅ Data validation before import
- ✅ Error handling for malformed data
- ✅ Progress indicators for large imports

**Bulk Operations:**
- ✅ Support for large datasets
- ✅ Batch processing
- ✅ Transaction support (all or nothing)

**Example:**
```javascript
// Export
app.get('/api/export/:format', (req, res) => {
  const data = getData();
  switch(req.params.format) {
    case 'json':
      res.json(data);
      break;
    case 'csv':
      res.send(convertToCSV(data));
      break;
    case 'xml':
      res.send(convertToXML(data));
      break;
  }
});

// Import
app.post('/api/import', upload.single('file'), async (req, res) => {
  const data = parseFile(req.file);
  const errors = validateData(data);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  await importData(data);
  res.json({ success: true, imported: data.length });
});
```

**Value**: 1 point

---

### 2. GDPR Compliance Features

**Requirements:**

**Data Access:**
- ✅ Users can **request their data**
- ✅ Generate complete data export
- ✅ Include all user information

**Data Deletion:**
- ✅ **Data deletion** with confirmation
- ✅ Permanent removal from all systems
- ✅ Cascade delete related data

**Data Export:**
- ✅ Export user data in **readable format** (JSON, PDF)
- ✅ Include all stored information
- ✅ Machine-readable format

**Communication:**
- ✅ **Confirmation emails** for all data operations
- ✅ Clear notification of actions taken
- ✅ Audit log of data operations

**Example:**
```javascript
// Request user data
app.post('/api/gdpr/request-data', async (req, res) => {
  const userId = req.user.id;
  const userData = await getAllUserData(userId);

  // Send email with data
  await sendEmail(req.user.email, 'Your Data Request', {
    data: userData,
    format: 'json'
  });

  res.json({ message: 'Data request sent to your email' });
});

// Delete user data
app.post('/api/gdpr/delete-account', async (req, res) => {
  const userId = req.user.id;

  // Confirmation required
  if (!req.body.confirmed) {
    return res.status(400).json({
      message: 'Confirmation required'
    });
  }

  await deleteAllUserData(userId);
  await sendConfirmationEmail(req.user.email, 'Account Deleted');

  res.json({ message: 'Account deleted successfully' });
});
```

**Features to Include:**
- Right to access
- Right to rectification
- Right to erasure ("right to be forgotten")
- Right to data portability
- Audit trail of all operations

**Value**: 1 point

---

## 🎯 Key Takeaways

**Data & Analytics modules show you can:**
- Handle complex data visualization
- Implement real-time updates
- Provide useful insights
- Respect user privacy
- Export/import data effectively

