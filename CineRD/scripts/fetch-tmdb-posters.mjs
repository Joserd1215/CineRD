import { writeFile } from 'node:fs/promises'
import { filmCatalog } from '../src/filmCatalog.js'
import { posterOverrides as existingOverrides } from '../src/posterOverrides.generated.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function normalize(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ntilde;/g, 'n')
    .replace(/&aacute;/g, 'a')
    .replace(/&eacute;/g, 'e')
    .replace(/&iacute;/g, 'i')
    .replace(/&oacute;/g, 'o')
    .replace(/&uacute;/g, 'u')
}

function getYear(value) {
  const match = value.match(/\b(19|20)\d{2}\b/)
  return match ? Number(match[0]) : null
}

function extractCards(html) {
  return html
    .split('class="comp:media-card')
    .slice(1)
    .map((chunk) => {
      const posterMatch = chunk.match(
        /src="(https:\/\/media\.themoviedb\.org\/t\/p\/w94_and_h141_face\/[^"]+)"/,
      )
      const titleMatch = chunk.match(/<h2[^>]*><span>([\s\S]*?)<\/span><\/h2>/)
      const dateMatch = chunk.match(/<span class="release_date[^"]*">([\s\S]*?)<\/span>/)

      if (!posterMatch || !titleMatch) {
        return null
      }

      return {
        title: decodeHtml(titleMatch[1].replace(/<[^>]+>/g, '').trim()),
        year: dateMatch ? getYear(decodeHtml(dateMatch[1])) : null,
        poster: posterMatch[1].replace('w94_and_h141_face', 'w600_and_h900_face'),
      }
    })
    .filter(Boolean)
}

async function fetchPoster(film) {
  const query = encodeURIComponent(`${film.title} y:${film.year}`)
  const response = await fetch(`https://www.themoviedb.org/search/movie?query=${query}`, {
    headers: {
      'accept-language': 'es-DO,es;q=0.9,en;q=0.8',
      'user-agent': 'Mozilla/5.0 CineRD poster lookup',
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      await wait(3000)
      return fetchPoster(film)
    }

    throw new Error(`TMDb ${response.status}`)
  }

  const html = await response.text()
  const cards = extractCards(html)
  const exact = cards.find(
    (card) => normalize(card.title) === normalize(film.title) && card.year === film.year,
  )

  return exact?.poster ?? null
}

const overrides = { ...existingOverrides }

for (const film of filmCatalog) {
  if (overrides[film.id]) {
    continue
  }

  try {
    const poster = await fetchPoster(film)

    if (poster) {
      overrides[film.id] = poster
      console.log(`found ${film.year} ${film.title}`)
    } else {
      console.log(`missing ${film.year} ${film.title}`)
    }
  } catch (error) {
    console.log(`error ${film.year} ${film.title}: ${error.message}`)
  }

  await wait(650)
}

const content = `export const posterOverrides = ${JSON.stringify(overrides, null, 2)}\n`
await writeFile(new URL('../src/posterOverrides.generated.js', import.meta.url), content)
console.log(`\n${Object.keys(overrides).length} posters written`)
