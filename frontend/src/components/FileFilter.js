import Form from 'react-bootstrap/Form'

export default function FileFilter ({ files, value, onChange }) {
  return (
    <Form.Group className='mb-3 file-filter'>
      <Form.Label>Filtrar por archivo</Form.Label>
      <Form.Select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value=''>Todos los archivos</option>
        {files.map((file) => (
          <option key={file} value={file}>{file}</option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}
