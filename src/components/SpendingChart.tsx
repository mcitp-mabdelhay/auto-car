import React, { useEffect, useState } from 'react';
import { MaintenanceRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { t, Language } from '../locales';

interface Props {
  records: MaintenanceRecord[];
  lang: Language;
}

export function SpendingChart({ records, lang }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains('dark'));

    // Create an observer to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Process records to group costs by service
  // Alternatively, if dates were strictly parseable, we could do month-by-month.
  // Since dates like "15-08-2026" might be non-standard, we'll plot cost per service type for this chart.
  
  const chartData = records
    .filter(r => r.cost && r.cost > 0)
    .map(r => ({
      name: r.name,
      cost: r.cost
    }))
    .sort((a, b) => (b.cost || 0) - (a.cost || 0))
    .slice(0, 5); // top 5 most expensive

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl transition-colors">
        {t[lang].noCostData}
      </div>
    );
  }

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: lang === 'ar' ? 10 : -20, bottom: 0 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? "#334155" : "#f5f5f5"} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500}} width={100} />
          <Tooltip 
            cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}}
            contentStyle={{ 
              borderRadius: '12px', 
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
              fontWeight: 'bold',
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
            formatter={(value: number) => [`${value.toLocaleString()} ${t[lang].currency}`, t[lang].cost]}
          />
          <Bar dataKey="cost" fill={isDark ? "#10b981" : "#059669"} radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
