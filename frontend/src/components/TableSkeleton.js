const ROWS = 8
const COLS = [
  { width: 'w-50' },
  { width: 'w-25' },
  { width: 'w-25' },
  { width: 'w-75' }
]

export default function TableSkeleton () {
  return (
    <div className='table-responsive mt-1'>
      <table className='table table-striped'>
        <thead>
          <tr>
            {['File Name', 'Text', 'Number', 'Hex'].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody aria-label='Cargando datos…'>
          {Array.from({ length: ROWS }, (_, row) => (
            <tr key={row}>
              {COLS.map((col, col_i) => (
                <td key={col_i}>
                  <span
                    className={`placeholder-glow d-block ${col.width}`}
                    aria-hidden='true'
                  >
                    <span className='placeholder rounded w-100' />
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
