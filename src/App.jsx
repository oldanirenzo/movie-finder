import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }
    if (search === '') {
      setError('No se puede buscar una pelicula vacia.')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula con solo numeros')
      return
    }
    if (search.length < 3) {
      setError('La busqueda debe tener al menos 3 caracteres')
      return
    }
    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies, errorMovie } = useMovies({ search, sort })

  const debouncedGetMovies = useCallback(
    debounce((search) => {
      getMovies(search)
    }, 500),
    []
  )
  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies(search)
    // const { query } = Object.fromEntries(new FormData(event.target))
    // console.log(query)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }
  const handleSort = () => {
    setSort(!sort)
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input
            placeholder='Avengers, Star Wars ...'
            name='query'
            onChange={handleChange}
            value={search}
            style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent'
            }}
          />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {errorMovie && <p style={{ color: 'red' }}>{errorMovie}</p>}
      </header>
      <main>
        {loading ? <p>Cargando ...</p> : <Movies movies={movies} sort={sort} />}
      </main>
    </div>
  )
}

export default App
