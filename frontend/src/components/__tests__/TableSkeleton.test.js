import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TableSkeleton from '../TableSkeleton'

describe('TableSkeleton', () => {
  it('renderiza los encabezados de la tabla', () => {
    render(<TableSkeleton />)
    expect(screen.getByText('File Name')).toBeInTheDocument()
    expect(screen.getByText('Hex')).toBeInTheDocument()
  })

  it('renderiza el label de accesibilidad mientras carga', () => {
    render(<TableSkeleton />)
    expect(screen.getByLabelText('Cargando datos…')).toBeInTheDocument()
  })

  it('renderiza 8 filas placeholder', () => {
    const { container } = render(<TableSkeleton />)
    const rows = container.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(8)
  })
})
