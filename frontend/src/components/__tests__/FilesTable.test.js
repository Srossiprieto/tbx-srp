import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilesTable from '../FilesTable'

describe('FilesTable', () => {
  const data = [
    {
      file: 'file1.csv',
      lines: [
        { text: 'RgTya', number: 64075909, hex: '70ad29aacf0b690b0467fe2b2767f765' },
        { text: 'AtjW', number: 6, hex: 'd33a8ca5d36d3106219f66f939774cf5' }
      ]
    },
    {
      file: 'file2.csv',
      lines: [{ text: 'Hi', number: 7, hex: 'f9e1bcdb9e3784acc448af34f4727252' }]
    }
  ]

  it('renderiza una fila por cada línea de cada archivo', () => {
    render(<FilesTable data={data} />)
    expect(screen.getAllByText('file1.csv')).toHaveLength(2)
    expect(screen.getByText('RgTya')).toBeInTheDocument()
    expect(screen.getByText('64075909')).toBeInTheDocument()
  })

  it('muestra los encabezados del wireframe', () => {
    render(<FilesTable data={[]} />)
    expect(screen.getByText('File Name')).toBeInTheDocument()
    expect(screen.getByText('Hex')).toBeInTheDocument()
  })
})
