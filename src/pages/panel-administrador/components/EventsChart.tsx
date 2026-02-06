import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { MonthlyCount } from '../../../types'

interface EventsChartProps {
  data: MonthlyCount[]
}

export const EventsChart: React.FC<EventsChartProps> = ({ data }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}
    >
      <Typography variant='h6' fontWeight='bold' mb={3} color='#1e293b'>
        Eventos Creados por Mes
      </Typography>

      <Box height={300}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f1f5f9'
              vertical={false}
            />
            <XAxis
              dataKey='month'
              stroke='#64748b'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke='#64748b'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: '#1e293b',
                padding: '12px'
              }}
              labelStyle={{
                color: '#64748b',
                fontWeight: 600,
                marginBottom: '4px'
              }}
            />
            <Bar
              dataKey='count'
              fill='#3b82f6'
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
