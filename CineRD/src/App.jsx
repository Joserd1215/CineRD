import { useMemo, useState } from 'react'
import './App.css'
import {
  dominicanFilms,
  foreignFilmsInDominicanRepublic,
} from './filmCatalog'

const filterOptions = [
  'Todas',
  'Pioneras',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
  '2020s',
]

const firstFilm = dominicanFilms[0]
const featuredFilm = dominicanFilms.find((film) => film.title === 'Carpinteros')
const pioneerFilms = dominicanFilms.slice(0, 2)

function getInitials(title) {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
}

function hideFailedImage(event) {
  event.currentTarget.hidden = true
}

function App() {
  const [activeFilter, setActiveFilter] = useState('Todas')

  const visibleFilms = useMemo(() => {
    if (activeFilter === 'Todas') {
      return dominicanFilms
    }

    return dominicanFilms.filter((film) => film.decade === activeFilter)
  }, [activeFilter])

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="Navegación principal">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          CineRD
        </a>
        <nav className="nav-links" aria-label="Secciones">
          <a href="#album">Álbum</a>
          <a href="#pioneras">Pioneras</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#externas">Aparte</a>
        </nav>
      </header>

      <section className="intro" id="album" aria-labelledby="intro-title">
        <div className="intro-copy">
          <p className="eyebrow">Archivo dominicano</p>
          <h1 id="intro-title">Películas hechas en RD por dominicanos.</h1>
          <p className="intro-text">
            El álbum principal reúne producciones hechas en República Dominicana
            por cineastas dominicanos. Las rodadas aquí por personas no
            dominicanas quedan en una sección aparte.
          </p>
          <div className="intro-actions">
            <a className="primary-action" href="#catalogo">
              Ver álbum
            </a>
            <a className="secondary-action" href="#pioneras">
              Ver pioneras
            </a>
          </div>
        </div>

        <div className="spotlight" aria-label="Resumen de CineRD">
          <div className={`spotlight-poster album-cover-${featuredFilm.accent}`}>
            {featuredFilm.photo ? (
              <img src={featuredFilm.photo} alt="" onError={hideFailedImage} />
            ) : null}
            <div className="spotlight-caption">
              <span>En el álbum</span>
              <strong>{featuredFilm.title}</strong>
              <p>{featuredFilm.year} / {featuredFilm.director}</p>
            </div>
          </div>
          <div className="metric-row">
            <div>
              <span>{dominicanFilms.length}</span>
              <p>hechas en RD</p>
            </div>
            <div>
              <span>{firstFilm.year}</span>
              <p>primer título</p>
            </div>
            <div>
              <span>{foreignFilmsInDominicanRepublic.length}</span>
              <p>aparte</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-heading" id="pioneras">
        <p className="eyebrow">Punto de partida</p>
        <h2>Las primeras páginas del álbum</h2>
      </section>

      <section className="pioneer-grid" aria-label="Películas pioneras">
        {pioneerFilms.map((film) => (
          <article className="pioneer-card" key={film.id}>
            <div className={`pioneer-photo album-cover-${film.accent}`}>
              {film.photo ? (
                <img
                  src={film.photo}
                  alt={`Imagen de ${film.title}`}
                  loading="lazy"
                  onError={hideFailedImage}
                />
              ) : (
                <strong>{getInitials(film.title)}</strong>
              )}
            </div>
            <div>
              <span>{film.year}</span>
              <h3>{film.title}</h3>
              <p>{film.note}</p>
              <strong>{film.director}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="catalog-head" id="catalogo">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h2>{activeFilter === 'Todas' ? 'Todas las décadas' : activeFilter}</h2>
        </div>
        <p>{visibleFilms.length} títulos en pantalla</p>
      </section>

      <div className="filter-bar" aria-label="Filtrar por década">
        {filterOptions.map((option) => (
          <button
            className={activeFilter === option ? 'filter-active' : ''}
            key={option}
            type="button"
            onClick={() => setActiveFilter(option)}
            aria-pressed={activeFilter === option}
          >
            {option}
          </button>
        ))}
      </div>

      <section className="album-grid" aria-label="Álbum de películas dominicanas">
        {visibleFilms.map((film) => (
          <article className="album-card" key={film.id}>
            <figure className={`album-cover album-cover-${film.accent}`}>
              <div className="cover-fallback" aria-hidden="true">
                <span>{film.year}</span>
                <strong>{getInitials(film.title)}</strong>
              </div>
              {film.photo ? (
                <img
                  src={film.photo}
                  alt={`Imagen de ${film.title}`}
                  loading="lazy"
                  onError={hideFailedImage}
                />
              ) : null}
              <figcaption>
                <span>{film.type}</span>
                <strong>{film.year}</strong>
              </figcaption>
            </figure>
            <div className="album-content">
              <p className="movie-meta">{film.director}</p>
              <h3>{film.title}</h3>
              <span className="origin-pill">{film.originLabel}</span>
              <p>{film.note}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="foreign-section" id="externas">
        <div className="catalog-head">
          <div>
            <p className="eyebrow">Aparte</p>
            <h2>Hechas en RD por no dominicanos</h2>
          </div>
          <p>{foreignFilmsInDominicanRepublic.length} títulos separados</p>
        </div>
        <p className="section-note">
          Estas no están en el álbum principal porque la dirección no es
          dominicana, aunque fueron hechas, rodadas o producidas en República
          Dominicana.
        </p>

        <section
          className="album-grid"
          aria-label="Películas hechas en República Dominicana por no dominicanos"
        >
          {foreignFilmsInDominicanRepublic.map((film) => (
            <article className="album-card" key={film.id}>
              <figure className={`album-cover album-cover-${film.accent}`}>
                <div className="cover-fallback" aria-hidden="true">
                  <span>{film.year}</span>
                  <strong>{getInitials(film.title)}</strong>
                </div>
                {film.photo ? (
                  <img
                    src={film.photo}
                    alt={`Imagen de ${film.title}`}
                    loading="lazy"
                    onError={hideFailedImage}
                  />
                ) : null}
                <figcaption>
                  <span>{film.type}</span>
                  <strong>{film.year}</strong>
                </figcaption>
              </figure>
              <div className="album-content">
                <p className="movie-meta">{film.director}</p>
                <h3>{film.title}</h3>
                <span className="origin-pill origin-pill-secondary">
                  {film.originLabel}
                </span>
                <p>{film.note}</p>
              </div>
            </article>
          ))}
        </section>
      </section>

    </main>
  )
}

export default App
