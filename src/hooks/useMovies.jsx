import { useState, useRef, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'
export const useMovies = ({ search, sort }) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previousSearch = useRef(search)
  // useCallback es lo mismo q useMemo, pero esta pensado para funciones, para todo lo demas, puede usarse useMemo.
  const getMovies = useCallback(async (search) => {
    if (search === previousSearch.current) return
    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const sortedMovies = useMemo(() => {
    return movies && sort
      ? movies.toSorted((a, b) => a.title.localeCompare(b.title))
      : movies
  }, [movies, sort])

  return { movies: sortedMovies, getMovies, loading, errorMovie: error }
}
