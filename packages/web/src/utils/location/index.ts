const isGoogleMapsUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return (
      (url.hostname === 'www.google.com' && url.pathname.startsWith('/maps')) ||
      url.hostname === 'maps.google.com' ||
      (url.hostname === 'goo.gl' && url.pathname.startsWith('/maps')) ||
      url.hostname === 'maps.app.goo.gl'
    )
  } catch {
    return false
  }
}

const extractGoogleMapsLabel = (value: string): string => {
  try {
    const url = new URL(value)

    const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/)
    if (placeMatch) {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
    }

    const query = url.searchParams.get('q') ?? url.searchParams.get('query')
    if (query) return query

    return 'Google Maps'
  } catch {
    return 'Google Maps'
  }
}

export const getLocationLink = (location: string): { label: string; href: string } => {
  if (isGoogleMapsUrl(location)) {
    return {
      label: extractGoogleMapsLabel(location),
      href: location,
    }
  }
  return {
    label: location,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
  }
}
