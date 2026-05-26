import filesReducer, {
  setSelectedFile,
  loadFilesData,
  loadFilesList
} from '../filesSlice'

const initialState = {
  data: [],
  list: [],
  selectedFile: '',
  status: 'idle',
  error: null
}

const HEX = 'd33a8ca5d36d3106219f66f939774cf5'
const MOCK_DATA = [{ file: 'file1.csv', lines: [{ text: 'Ok', number: 1, hex: HEX }] }]
const MOCK_LIST = ['file1.csv', 'file2.csv']

describe('filesSlice — reducers', () => {
  it('devuelve el estado inicial', () => {
    expect(filesReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('setSelectedFile actualiza selectedFile', () => {
    const state = filesReducer(initialState, setSelectedFile('file1.csv'))
    expect(state.selectedFile).toBe('file1.csv')
  })
})

describe('filesSlice — loadFilesData', () => {
  it('pending → status loading, error null', () => {
    const state = filesReducer(
      { ...initialState, error: 'prev error' },
      loadFilesData.pending()
    )
    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  it('fulfilled → status succeeded, data actualizada', () => {
    const state = filesReducer(
      initialState,
      loadFilesData.fulfilled(MOCK_DATA)
    )
    expect(state.status).toBe('succeeded')
    expect(state.data).toEqual(MOCK_DATA)
  })

  it('rejected → status failed, error seteado', () => {
    const state = filesReducer(
      initialState,
      loadFilesData.rejected(new Error('fetch error'), '', '', 'fetch error')
    )
    expect(state.status).toBe('failed')
    expect(state.error).toBe('fetch error')
  })
})

describe('filesSlice — loadFilesList', () => {
  it('fulfilled → list actualizada', () => {
    const state = filesReducer(
      initialState,
      loadFilesList.fulfilled(MOCK_LIST)
    )
    expect(state.list).toEqual(MOCK_LIST)
  })
})
