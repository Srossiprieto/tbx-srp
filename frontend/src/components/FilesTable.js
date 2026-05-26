import Table from 'react-bootstrap/Table'

export default function FilesTable ({ data }) {
  const rows = data.flatMap((file) =>
    file.lines.map((line, index) => ({ key: `${file.file}-${index}`, fileName: file.file, ...line }))
  )

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
