import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FileFilter from '../FileFilter'

const FILES = ['file1.csv', 'file2.csv', 'file3.csv']

describe('FileFilter', () => {
  it('renderiza la opción por defecto "Todos los archivos"', () => {
    render(<FileFilter files={FILES} value='' onChange={() => {}} />)
    expect(screen.getByText('Todos los archivos')).toBeInTheDocument()
  })

  it('renderiza una opción por cada archivo recibido', () => {
    render(<FileFilter files={FILES} value='' onChange={() => {}} />)
    FILES.forEach((f) => expect(screen.getByText(f)).toBeInTheDocument())
  })

  it('llama a onChange con el valor seleccionado', () => {
    const handleChange = jest.fn()
    render(<FileFilter files={FILES} value='' onChange={handleChange} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'file2.csv' } })
    expect(handleChange).toHaveBeenCalledWith('file2.csv')
  })

  it('refleja el valor controlado en el select', () => {
    render(<FileFilter files={FILES} value='file1.csv' onChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveValue('file1.csv')
  })
})
