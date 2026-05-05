import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { ArrowLeft, Download, Filter } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];

export default function Dashboard({ dataset, onReset }) {
  const { filename, columns, data } = dataset;
  
  // State for filters
  const [filters, setFilters] = useState({});
  const [xAxisCol, setXAxisCol] = useState(columns.find(c => c.type === 'categorical')?.name || columns[0]?.name);
  const [yAxisCol, setYAxisCol] = useState(columns.find(c => c.type === 'numerical')?.name || columns[1]?.name);
  const [aggregation, setAggregation] = useState('Sum'); // Sum, Average, Count

  // Get distinct values for categorical columns
  const categoricalCols = columns.filter(c => c.type === 'categorical');
  const numericalCols = columns.filter(c => c.type === 'numerical');

  const filterOptions = useMemo(() => {
    const options = {};
    categoricalCols.forEach(col => {
      const uniqueValues = [...new Set(data.map(item => item[col.name]).filter(v => v !== null && v !== ''))];
      options[col.name] = uniqueValues.sort();
    });
    return options;
  }, [data, categoricalCols]);

  const handleFilterChange = (colName, value) => {
    setFilters(prev => {
      if (value === '') {
        const newFilters = { ...prev };
        delete newFilters[colName];
        return newFilters;
      }
      return { ...prev, [colName]: value };
    });
  };

  // Filter and aggregate data
  const chartData = useMemo(() => {
    let filteredData = data;
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      filteredData = filteredData.filter(item => String(item[key]) === String(value));
    });

    if (!xAxisCol || !yAxisCol) return [];

    // Group and aggregate
    const grouped = {};
    filteredData.forEach(item => {
      let xValue = item[xAxisCol] || 'Unknown';
      let yValue = item[yAxisCol] ? Number(item[yAxisCol]) : 0;
      
      if (!grouped[xValue]) {
        grouped[xValue] = { category: xValue, value: 0, count: 0 };
      }
      
      grouped[xValue].value += yValue;
      grouped[xValue].count += 1;
    });

    return Object.values(grouped).map(group => {
      let finalValue = 0;
      if (aggregation === 'Sum') finalValue = group.value;
      else if (aggregation === 'Average') finalValue = group.value / group.count;
      else if (aggregation === 'Count') finalValue = group.count;
      
      return {
        name: group.category,
        value: Number(finalValue.toFixed(2))
      };
    }).sort((a, b) => b.value - a.value).slice(0, 15); // Top 15 to avoid clutter
  }, [data, filters, xAxisCol, yAxisCol, aggregation]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Category,Value\n" 
      + chartData.map(e => `${e.name},${e.value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} /> Filters
          </h2>
          <button 
            onClick={onReset}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            title="Back to Upload"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="filter-group">
          <span className="filter-label">X-Axis (Category)</span>
          <select 
            className="filter-select"
            value={xAxisCol} 
            onChange={(e) => setXAxisCol(e.target.value)}
          >
            {columns.map(c => (
              <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Y-Axis (Value)</span>
          <select 
            className="filter-select"
            value={yAxisCol} 
            onChange={(e) => setYAxisCol(e.target.value)}
          >
            {numericalCols.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Aggregation</span>
          <select 
            className="filter-select"
            value={aggregation} 
            onChange={(e) => setAggregation(e.target.value)}
          >
            <option value="Sum">Sum</option>
            <option value="Average">Average</option>
            <option value="Count">Count</option>
          </select>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />
        
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Data Filters</h3>
        {categoricalCols.map(col => (
          col.name !== xAxisCol && (
            <div key={col.name} className="filter-group">
              <span className="filter-label">{col.name}</span>
              <select 
                className="filter-select"
                value={filters[col.name] || ''} 
                onChange={(e) => handleFilterChange(col.name, e.target.value)}
              >
                <option value="">All</option>
                {filterOptions[col.name]?.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          )
        ))}

        <div style={{ flex: 1 }}></div>
        <button className="button" onClick={handleExport} style={{ width: '100%', justifyContent: 'center' }}>
          <Download size={18} /> Export CSV
        </button>
      </aside>

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Dashboard Overview</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Analyzing dataset: <strong>{filename}</strong> ({data.length} rows)
            </p>
          </div>
        </div>

        <div className="charts-grid">
          {/* Bar Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Distribution ({aggregation})</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}
                    itemStyle={{ color: '#f8fafc' }}
                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Trend Analysis</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card" style={{ gridColumn: 'span 1' }}>
            <div className="chart-header">
              <h3 className="chart-title">Composition</h3>
            </div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
