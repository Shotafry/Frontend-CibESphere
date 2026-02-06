import React from 'react'
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material'
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
      <Typography
        variant='h6'
        fontWeight='bold'
        mb={3}
        color='#1e293b'
        fontSize={isMobile ? '1rem' : '1.25rem'}
      >
        Nuevos Usuarios {isMobile ? '' : '(30 días)'}
      </Typography>

      <Box height={isMobile ? 250 : 300}>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: isMobile ? -25 : -20,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id='colorUsers' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#10b981' stopOpacity={0.3} />
                <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f1f5f9'
              vertical={false}
            />
            <XAxis
              dataKey='date'
              stroke='#64748b'
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
              dy={10}
              tickFormatter={(value) => value.split('-').slice(1).join('/')}
              interval={isMobile ? 'preserveStartEnd' : 0} // Show fewer ticks on mobile
            />
            <YAxis
              stroke='#64748b'
              fontSize={isMobile ? 10 : 12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: '#1e293b'
              }}
              labelStyle={{
                color: '#64748b',
                fontWeight: 600,
                marginBottom: '4px'
              }}
            />
            <Area
              type='monotone'
              dataKey='count'
              stroke='#10b981'
              fillOpacity={1}
              fill='url(#colorUsers)'
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
