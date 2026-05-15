import { useMemo, useState } from 'react'
import './App.css'

const movies = [
  {
    id: 'carpinteros',
    title: 'Carpinteros',
    year: 2017,
    director: 'Jose Maria Cabral',
    genre: 'Drama',
    criticScore: 86,
    audienceScore: 82,
    reviews: 148,
    accent: 'red',
    logline: 'Un romance tenso dentro del sistema penitenciario dominicano.',
  },
  {
    id: 'la-gunguna',
    title: 'La Gunguna',
    year: 2015,
    director: 'Ernesto Alemany',
    genre: 'Suspenso',
    criticScore: 78,
    audienceScore: 88,
    reviews: 231,
    accent: 'blue',
    logline: 'Una pistola legendaria enlaza crimen, humor negro y destino.',
  },
  {
    id: 'perico-ripiao',
    title: 'Perico Ripiao',
    year: 2003,
    director: 'Angel Muniz',
    genre: 'Comedia',
    criticScore: 74,
    audienceScore: 91,
    reviews: 306,
    accent: 'gold',
    logline: 'Tres fugitivos cruzan el Cibao con musica, picardia y caos.',
  },
]

const initialOpinions = [
  {
    id: 1,
    movie: 'La Gunguna',
    author: 'Mariel',
    rating: 4.5,
    text: 'Tiene una energia muy dominicana sin perder el pulso de thriller.',
  },
  {
    id: 2,
    movie: 'Carpinteros',
    author: 'Rafa',
    rating: 4,
    text: 'Dura, bien actuada y con una mirada social que se queda contigo.',
  },
]

function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(movies[0].id)
  const [rating, setRating] = useState(4)
  const [opinion, setOpinion] = useState('')
  const [opinions, setOpinions] = useState(initialOpinions)

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.id === selectedMovieId),
    [selectedMovieId],
  )

  const averageAudience = Math.round(
    movies.reduce((total, movie) => total + movie.audienceScore, 0) /
      movies.length,
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!opinion.trim()) {
      return
    }

    setOpinions((currentOpinions) => [
      {
        id: Date.now(),
        movie: selectedMovie.title,
        author: 'Tu opinion',
        rating,
        text: opinion.trim(),
      },
      ...currentOpinions,
    ])
    setOpinion('')
  }

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="Navegacion principal">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          CineRD
        </a>
        <nav className="nav-links" aria-label="Secciones">
          <a href="#peliculas">Peliculas</a>
          <a href="#opinar">Opinar</a>
          <a href="#ranking">Ranking</a>
        </nav>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="eyebrow">Cine dominicano, valorado por su publico</p>
          <h1 id="intro-title">La cartelera critica de RD empieza aqui.</h1>
          <p className="intro-text">
            Un espacio para reunir peliculas dominicanas, comparar puntuaciones
            y dejar opiniones con contexto local.
          </p>
          <div className="intro-actions">
            <a className="primary-action" href="#opinar">
              Opinar ahora
            </a>
            <a className="secondary-action" href="#peliculas">
              Ver destacadas
            </a>
          </div>
        </div>

        <div className="spotlight" aria-label="Resumen de CineRD">
          <div className="spotlight-poster">
            <span>Cine</span>
            <strong>RD</strong>
          </div>
          <div className="metric-row">
            <div>
              <span>{movies.length}</span>
              <p>peliculas base</p>
            </div>
            <div>
              <span>{averageAudience}</span>
              <p>promedio publico</p>
            </div>
            <div>
              <span>{opinions.length}</span>
              <p>opiniones</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-heading" id="peliculas">
        <p className="eyebrow">Primer catalogo</p>
        <h2>Peliculas destacadas</h2>
      </section>

      <section
        className="movie-grid"
        id="ranking"
        aria-label="Peliculas dominicanas"
      >
        {movies.map((movie) => (
          <article className="movie-card" key={movie.id}>
            <div className={`poster poster-${movie.accent}`} aria-hidden="true">
              <span>{movie.genre}</span>
              <strong>{movie.title}</strong>
            </div>
            <div className="movie-content">
              <div>
                <p className="movie-meta">
                  {movie.year} / {movie.director}
                </p>
                <h3>{movie.title}</h3>
              </div>
              <p>{movie.logline}</p>
              <div className="score-strip">
                <span>
                  Critica <strong>{movie.criticScore}</strong>
                </span>
                <span>
                  Publico <strong>{movie.audienceScore}</strong>
                </span>
                <span>
                  Votos <strong>{movie.reviews}</strong>
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="review-panel" id="opinar" aria-labelledby="opinar-title">
        <form className="review-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Tu turno</p>
          <h2 id="opinar-title">Valora una pelicula</h2>

          <label htmlFor="movie">Pelicula</label>
          <select
            id="movie"
            value={selectedMovieId}
            onChange={(event) => setSelectedMovieId(event.target.value)}
          >
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>

          <fieldset>
            <legend>Valoracion</legend>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  className={rating === value ? 'rating-active' : ''}
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-pressed={rating === value}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="opinion">Opinion</label>
          <textarea
            id="opinion"
            rows="4"
            placeholder={`Que te dejo ${selectedMovie.title}?`}
            value={opinion}
            onChange={(event) => setOpinion(event.target.value)}
          />

          <button className="submit-action" type="submit">
            Publicar opinion
          </button>
        </form>

        <aside className="opinion-feed" aria-label="Opiniones recientes">
          <p className="eyebrow">Actividad reciente</p>
          <h2>Opiniones</h2>
          <div className="feed-list">
            {opinions.map((item) => (
              <article className="opinion-card" key={item.id}>
                <div>
                  <strong>{item.movie}</strong>
                  <span>
                    {item.author} / {item.rating.toFixed(1)}
                  </span>
                </div>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
