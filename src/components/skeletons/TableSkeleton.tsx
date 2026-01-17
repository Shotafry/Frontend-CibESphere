import React from 'react'
import {
  Box,
  Skeleton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'

export const TableSkeleton: React.FC = () => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Skeleton variant='text' width={200} height={32} />
        <Skeleton variant='rounded' width={100} height={24} />
      </Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {[1, 2, 3, 4].map((i) => (
                <TableCell key={i}>
                  <Skeleton variant='text' width='80%' />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Skeleton variant='circular' width={36} height={36} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant='text' width='60%' />
                      <Skeleton variant='text' width='40%' />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Skeleton variant='text' width='70%' />
                </TableCell>
                <TableCell>
                  <Skeleton variant='rounded' width={80} height={24} />
                </TableCell>
                <TableCell align='right'>
                  <Skeleton variant='circular' width={32} height={32} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
