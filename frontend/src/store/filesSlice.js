import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchFilesData, fetchFilesList } from '../api/filesApi'

export const loadFilesData = createAsyncThunk('files/loadData', (fileName) => fetchFilesData(fileName))
export const loadFilesList = createAsyncThunk('files/loadList', () => fetchFilesList())

const filesSlice = createSlice({
  name: 'files',
  initialState: { data: [], list: [], selectedFile: '', status: 'idle', error: null },
  reducers: {
    setSelectedFile (state, action) {
      state.selectedFile = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFilesData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadFilesData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(loadFilesData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(loadFilesList.fulfilled, (state, action) => {
        state.list = action.payload
      })
  }
})

export const { setSelectedFile } = filesSlice.actions
export default filesSlice.reducer
