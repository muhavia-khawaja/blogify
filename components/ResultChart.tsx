'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartSubject {
  name: string
  total: number
  isFail: boolean
}

export default function ResultChart({
  subjects,
}: {
  subjects: ChartSubject[]
}) {
  return (
    <div className='h-64 sm:h-72 bg-slate-50 p-2 sm:p-4 rounded-xl border border-slate-100'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={subjects}
          margin={{
            top: 10,
            right: 10,
            left: -25,
            bottom: 35,
          }}
        >
          <XAxis
            dataKey='name'
            tick={{ fontSize: 9 }}
            interval={0}
            angle={-35}
            textAnchor='end'
          />

          <YAxis domain={[0, 150]} tick={{ fontSize: 10 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            itemStyle={{
              color: '#818cf8',
            }}
          />

          <Bar dataKey='total' radius={[4, 4, 0, 0]}>
            {subjects.map((subject, index) => (
              <Cell
                key={`cell-${index}`}
                fill={subject.isFail ? '#f43f5e' : '#6366f1'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
