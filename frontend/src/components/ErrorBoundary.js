import { Component } from 'react'
import Alert from 'react-bootstrap/Alert'

export default class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError (error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch (error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render () {
    if (this.state.hasError) {
      return (
        <Alert variant='danger' className='mt-3'>
          <Alert.Heading>Algo salió mal</Alert.Heading>
          <p className='mb-0'>{this.state.message || 'Error inesperado al renderizar los datos.'}</p>
        </Alert>
      )
    }
    return this.props.children
  }
}
