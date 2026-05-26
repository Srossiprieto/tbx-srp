import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import filesReducer from '../store/filesSlice'
import App from '../App'

// Mock del módulo de API — todos los tests arrancan desde aquí
jest.mock('../api/filesApi')
import { fetchFilesData, fetchFilesList } from '../api/filesApi'

const HEX = 'd33a8ca5d36d3106219f66f939774cf5'
const MOCK_LIST = ['file1.csv', 'file2.csv']
const MOCK_DATA = [{ file: 'file1.csv', lines: [{ text: 'RgTya', number: 64075909, hex: HEX }] }]

function renderApp () {
  const store = configureStore({ reducer: { files: filesReducer } })
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

beforeEach(() => {
  fetchFilesList.mockResolvedValue(MOCK_LIST)
  fetchFilesData.mockResolvedValue(MOCK_DATA)
})

afterEach(() => jest.clearAllMocks())

describe('App', () => {
  it('muestra el skeleton mientras carga', () => {
    renderApp()
    expect(screen.getByLabelText('Cargando datos…')).toBeInTheDocument()
  })

  it('carga la lista de archivos y la muestra en el filtro', async () => {
    renderApp()
    expect(await screen.findByRole('option', { name: 'file1.csv' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'file2.csv' })).toBeInTheDocument()
  })

  it('muestra los datos en la tabla tras la carga', async () => {
    renderApp()
    expect(await screen.findByText('RgTya')).toBeInTheDocument()
    expect(screen.getByText('64075909')).toBeInTheDocument()
  })

  it('llama a fetchFilesData con el archivo seleccionado al filtrar', async () => {
    renderApp()
    await waitFor(() => screen.getByText('file2.csv'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'file2.csv' } })
    await waitFor(() => {
      expect(fetchFilesData).toHaveBeenCalledWith('file2.csv')
    })
  })

  it('muestra el error si fetchFilesData falla', async () => {
    fetchFilesData.mockRejectedValueOnce(new Error('Sin conexión'))
    renderApp()
    await waitFor(() => {
      expect(screen.getByText('Sin conexión')).toBeInTheDocument()
    })
  })
})
