import { useRef, useState } from 'react'

const REQUIRED_FIELDS = ['id', 'title', 'side', 'year']

export default function ImportExport({ moves, dispatch }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState(null)

  function handleExport() {
    const blob = new Blob([JSON.stringify(moves, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'corridor_moves_export.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)

        if (!Array.isArray(parsed)) {
          throw new Error('File must contain a JSON array')
        }

        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i]
          if (typeof item !== 'object' || item === null) {
            throw new Error(`Item at index ${i} is not an object`)
          }
          for (const field of REQUIRED_FIELDS) {
            if (!(field in item)) {
              throw new Error(`Item at index ${i} is missing required field "${field}"`)
            }
          }
        }

        dispatch({ type: 'IMPORT_MOVES', moves: parsed })
      } catch (err) {
        setError(err.message)
        setTimeout(() => setError(null), 4000)
      }

      // Reset so the same file can be re-imported
      e.target.value = ''
    }

    reader.onerror = () => {
      setError('Failed to read file')
      setTimeout(() => setError(null), 4000)
    }

    reader.readAsText(file)
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleExport}
        className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
      >
        Export
      </button>
      <button
        onClick={handleImport}
        className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
      >
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <span className="text-xs text-red-400 max-w-48 truncate" title={error}>
          {error}
        </span>
      )}
    </div>
  )
}
