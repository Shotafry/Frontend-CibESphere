import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { DailyCount } from '../../../types'

interface UserRegistrationsChartProps {
  data: DailyCount[]
}

export const UserRegistrationsChart: React.FC<UserRegistrationsChartProps> = ({
  data
}) => {
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
        Nuevos Usuarios (30 días)
      </Typography>

      <Box height={300}>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(255,255,255,0.05)'
              vertical={false}
            />
            <XAxis
              dataKey='date'
              stroke='rgba(255,255,255,0.5)'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.split('-').slice(1).join('/')}
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
                borderRadius: 8
              }}
            />
            <Area
              type='monotone'
              dataKey='count'
              stroke='#10b981'
              fillOpacity={1}
              fill='url(#colorUsers)'
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
