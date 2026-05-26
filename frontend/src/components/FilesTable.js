import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'

export default function FilesTable ({ data }) {
  const rows = data.flatMap((file) =>
    file.lines.map((line, index) => ({ key: `${file.file}-${index}`, fileName: file.file, ...line }))
  )

  if (rows.length === 0) {
    return (
      <Alert variant='warning' className='mt-2'>
        No hay líneas válidas para mostrar. El archivo puede estar vacío o contener datos con formato incorrecto.
      </Alert>
    )
  }

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>{row.fileName}</td>
            <td>{row.text}</td>
            <td>{row.number}</td>
            <td>{row.hex}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
