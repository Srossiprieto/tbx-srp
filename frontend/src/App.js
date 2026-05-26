import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import FileFilter from './components/FileFilter'
import FilesTable from './components/FilesTable'
import ErrorBoundary from './components/ErrorBoundary'
import { loadFilesData, loadFilesList, setSelectedFile } from './store/filesSlice'

export default function App () {
  const dispatch = useDispatch()
  const { data, list, selectedFile, status, error } = useSelector((state) => state.files)

  useEffect(() => {
    dispatch(loadFilesList())
  }, [dispatch])

  useEffect(() => {
    dispatch(loadFilesData(selectedFile))
  }, [dispatch, selectedFile])

  return (
    <>
      <Header />
      <Container className='py-4'>
        <FileFilter
          files={list}
          value={selectedFile}
          onChange={(value) => dispatch(setSelectedFile(value))}
        />
        {status === 'loading' && <p>Cargando…</p>}
        {error && <p className='text-danger'>{error}</p>}
        <ErrorBoundary>
          <FilesTable data={data} />
        </ErrorBoundary>
      </Container>
    </>
  )
}
