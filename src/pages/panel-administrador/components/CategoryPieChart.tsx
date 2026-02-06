import React, { useMemo } from 'react'
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CategoryCount } from '../../../types'

interface CategoryPieChartProps {
  data: CategoryCount[]
}

const COLORS = [
  '#0ea5e9', // Sky Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316' // Orange
]

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Calculate total for percentages
  const total = useMemo(
    () => data.reduce((acc, curr) => acc + curr.count, 0),
    [data]
  )

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={isMobile ? 1 : 2}
      >
        <Typography variant='h6' fontWeight='bold' color='#1e293b'>
          Distribución
        </Typography>
        <Typography
          variant='caption'
          sx={{
            bgcolor: '#f1f5f9',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            color: '#64748b',
            fontWeight: 700,
            border: '1px solid #e2e8f0'
          }}
        >
          Total: {total}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          gap: 2,
          flexDirection: isMobile ? 'column' : 'row'
        }}
      >
        {/* Chart (Donut) */}
        <Box
          sx={{
            flex: isMobile ? '0 0 200px' : '0 0 55%',
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                innerRadius={isMobile ? 50 : 60}
                outerRadius={isMobile ? 70 : 85}
                paddingAngle={4}
                dataKey='count'
                nameKey='category'
                stroke='none'
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ zIndex: 1000 }} // FIX: Ensure tooltip is on top
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: '#1e293b'
                }}
                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Label - Z-index fix */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 0 // FIX: Send behind tooltip
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight='900'
              color='#1e293b'
              sx={{ lineHeight: 1 }}
            >
              {data.length}
            </Typography>
            <Typography
              variant='caption'
              color='#64748b'
              fontWeight={600}
              sx={{ fontSize: isMobile ? '0.6rem' : '0.7rem' }}
            >
              Tipos
            </Typography>
          </Box>
        </Box>

        {/* Divider - Hidden on mobile if preferred, or horizontal */}
        {!isMobile && <Box sx={{ width: '1px', bgcolor: '#f1f5f9', my: 2 }} />}
        {isMobile && (
          <Box
            sx={{ height: '1px', width: '100%', bgcolor: '#f1f5f9', my: 1 }}
          />
        )}

        {/* Legend - Scrollable */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            pr: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: isMobile ? '150px' : 'none', // Limit height on mobile
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: '#cbd5e1',
              borderRadius: '4px',
              '&:hover': { background: '#94a3b8' }
            }
          }}
        >
          {data.map((entry, index) => {
            const percentage =
              total > 0 ? ((entry.count / total) * 100).toFixed(1) : '0'
            const color = COLORS[index % COLORS.length]

            return (
              <Box
                key={entry.category}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: isMobile ? 0.75 : 1,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#ffffff',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 2px 4px -1px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box display='flex' alignItems='center' width='60%'>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: color,
                      mr: 1.5,
                      flexShrink: 0
                    }}
                  />
                  <Typography
                    variant='caption'
                    fontWeight={600}
                    color='#334155'
                    noWrap
                    title={entry.category}
                    fontSize={isMobile ? '0.7rem' : '0.75rem'}
                  >
                    {entry.category}
                  </Typography>
                </Box>

                <Box textAlign='right'>
                  <Typography
                    variant='caption'
                    fontWeight={700}
                    color='#0f172a'
                    display='block'
                  >
                    {percentage}%
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Paper>
  )
}
