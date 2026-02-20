import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import { ParticlesBackground } from './ParticlesBackground'

describe('ParticlesBackground', () => {
  it('renders without crashing', () => {
    // Basic smoke test to ensure the component mounts and useEffect runs without errors
    render(<ParticlesBackground />)
  })
})
