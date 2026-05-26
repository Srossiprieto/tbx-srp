import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary from '../ErrorBoundary'

// Componente que tira intencionalmente para testear el boundary
function Bomb () {
  throw new Error('Error de prueba')
}

// Silenciar console.error para no ensuciar la salida del test
beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}))
afterEach(() => console.error.mockRestore())

describe('ErrorBoundary', () => {
  it('renderiza los hijos si no hay error', () => {
    render(
      <ErrorBoundary>
        <p>Contenido ok</p>
      </ErrorBoundary>
    )
    expect(screen.getByText('Contenido ok')).toBeInTheDocument()
  })

  it('muestra el mensaje de error si un hijo tira', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
    expect(screen.getByText('Error de prueba')).toBeInTheDocument()
  })
})
