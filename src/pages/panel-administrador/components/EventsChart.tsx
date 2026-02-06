import React from 'react'
import { Box, Typography, Paper, useTheme } from '@mui/material'
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
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(17, 25, 40, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4
      }}
    >
      <Typography variant='h6' fontWeight='bold' mb={3}>
        Eventos Creados por Mes
      </Typography>

      <Box height={300}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(255,255,255,0.05)'
              vertical={false}
            />
            <XAxis
              dataKey='month'
              stroke='rgba(255,255,255,0.5)'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='rgba(255,255,255,0.5)'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 25, 40, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            />
            <Bar
              dataKey='count'
              fill='#3b82f6'
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
