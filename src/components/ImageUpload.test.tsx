import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageUpload } from './ImageUpload'
import '@testing-library/jest-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the API service
vi.mock('../services/apiService', () => ({
  uploadImage: vi.fn()
}))

import { uploadImage } from '../services/apiService'

describe('ImageUpload Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows uploading a valid image', async () => {
    const onUpload = vi.fn()
    ;(uploadImage as any).mockResolvedValue('https://example.com/image.png')

    const { container } = render(
      <ImageUpload
        onUpload={onUpload}
        label="Test Upload"
        altText="Test Image"
      />
    )

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' })
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    expect(input).toBeInTheDocument()

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(uploadImage).toHaveBeenCalledWith(file, 'avatar')
      expect(onUpload).toHaveBeenCalledWith('https://example.com/image.png')
    })

    const errorMsg = screen.queryByText(/La imagen es demasiado grande/i)
    expect(errorMsg).not.toBeInTheDocument()
  })

  it('prevents uploading large files (>5MB)', async () => {
    const onUpload = vi.fn()
    const { container } = render(
      <ImageUpload
        onUpload={onUpload}
        label="Test Upload"
        altText="Test Image"
      />
    )

    // Create a large file (5MB + 1 byte)
    const largeFile = {
      size: 5 * 1024 * 1024 + 1,
      type: 'image/png',
      name: 'large.png'
    } as File

    // We have to mock the file object somewhat because jsdom environment limits
    // but usually FireEvent works with basic objects mimicking files.
    // However, `size` is read-only on File. We can use Object.defineProperty or just pass a mock object if the component accepts it (it expects File which is Blob).
    // The component checks `file.size`.

    // Better way to mock a large file without allocating 5MB memory:
    const file = new File([''], 'large.png', { type: 'image/png' })
    Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 + 1 })

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/La imagen es demasiado grande/i)).toBeInTheDocument()
    })

    expect(uploadImage).not.toHaveBeenCalled()
    expect(onUpload).not.toHaveBeenCalled()
  })

  it('prevents uploading non-image files', async () => {
    const onUpload = vi.fn()
    const { container } = render(
      <ImageUpload
        onUpload={onUpload}
        label="Test Upload"
        altText="Test Image"
      />
    )

    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' })

    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Solo se permiten imágenes/i)).toBeInTheDocument()
    })

    expect(uploadImage).not.toHaveBeenCalled()
    expect(onUpload).not.toHaveBeenCalled()
  })
})
