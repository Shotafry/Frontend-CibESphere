import { render, screen } from '@testing-library/react'
import { UserSocials } from './UserSocials'
import { PublicUserProfile } from '../../../types'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'

const mockUser: PublicUserProfile = {
  id: '123',
  full_name: 'Test User',
  joined_at: new Date().toISOString(),
  personal_website: "javascript:alert('XSS')",
  linkedin: "javascript:alert('XSS')",
  github: "javascript:alert('XSS')",
}

describe('UserSocials Security', () => {
  it('does NOT render malicious links', () => {
    render(<UserSocials user={mockUser} />)

    // Should verify that no social links are present
    const websiteLink = screen.queryByLabelText(/Website/i)
    const linkedinLink = screen.queryByLabelText(/LinkedIn/i)
    const githubLink = screen.queryByLabelText(/GitHub/i)

    expect(websiteLink).not.toBeInTheDocument()
    expect(linkedinLink).not.toBeInTheDocument()
    expect(githubLink).not.toBeInTheDocument()

    expect(screen.getByText(/No hay redes sociales públicas/i)).toBeInTheDocument()
  })

  it('renders valid links correctly with sanitization', () => {
    const validUser: PublicUserProfile = {
      ...mockUser,
      personal_website: 'example.com', // Should auto-prepend https
      linkedin: 'https://linkedin.com/in/test',
      github: 'http://github.com/test'
    }

    render(<UserSocials user={validUser} />)

    const websiteLink = screen.getByLabelText(/Website/i)
    expect(websiteLink).toHaveAttribute('href', 'https://example.com')
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer')

    const linkedinLink = screen.getByLabelText(/LinkedIn/i)
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/test')

    const githubLink = screen.getByLabelText(/GitHub/i)
    expect(githubLink).toHaveAttribute('href', 'http://github.com/test')
  })
})
