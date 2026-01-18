import React from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: 'blur(5px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] as const // Cubic bezier para suavidad "premium"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(5px)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] as const
    }
  }
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className
}) => {
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageVariants}
      className={className}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
