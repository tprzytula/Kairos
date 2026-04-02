import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ConfettiBurst from '.'

describe('Given the ConfettiBurst component', () => {
  let mockRef: React.RefObject<HTMLDivElement | null>

  beforeEach(() => {
    const div = document.createElement('div')
    div.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      left: 100,
      width: 50,
      height: 50,
      right: 150,
      bottom: 150,
      x: 100,
      y: 100,
      toJSON: vi.fn(),
    }))
    document.body.appendChild(div)
    mockRef = { current: div }
  })

  afterEach(() => {
    document.querySelectorAll('canvas').forEach(c => c.remove())
  })

  it('should not create a canvas when trigger is false', () => {
    render(<ConfettiBurst trigger={false} anchorRef={mockRef} />)
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('should create a canvas when trigger becomes true', () => {
    render(<ConfettiBurst trigger={true} anchorRef={mockRef} />)
    expect(document.querySelector('canvas')).not.toBeNull()
  })

  it('should remove canvas on unmount', () => {
    const { unmount } = render(<ConfettiBurst trigger={true} anchorRef={mockRef} />)
    expect(document.querySelector('canvas')).not.toBeNull()
    unmount()
    expect(document.querySelector('canvas')).toBeNull()
  })
})
