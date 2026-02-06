import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { CategoryCount } from '../../../types'

interface CategoryPieChartProps {
  data: CategoryCount[]
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
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
        Distribución por Categorías
      </Typography>

      <Box height={300}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey='count'
              nameKey='category'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 25, 40, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8
              }}
            />
            <Legend verticalAlign='bottom' height={36} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
