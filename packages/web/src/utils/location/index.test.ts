import { getLocationLink } from '.'

describe('Given the getLocationLink function', () => {
  describe('when the location is plain text', () => {
    it('should return the text as label and a Google Maps search link as href', () => {
      const result = getLocationLink('Heathrow T5')

      expect(result).toEqual({
        label: 'Heathrow T5',
        href: 'https://www.google.com/maps/search/?api=1&query=Heathrow%20T5',
      })
    })
  })

  describe('when the location is a Google Maps place URL', () => {
    it('should extract the place name as label and use the URL as href', () => {
      const url = 'https://www.google.com/maps/place/O2+Arena/@51.5030,-0.0029,17z'

      const result = getLocationLink(url)

      expect(result).toEqual({
        label: 'O2 Arena',
        href: url,
      })
    })

    it('should handle percent-encoded place names', () => {
      const url = 'https://www.google.com/maps/place/Heathrow%20Terminal%205/@51.4775,-0.4614,15z'

      const result = getLocationLink(url)

      expect(result).toEqual({
        label: 'Heathrow Terminal 5',
        href: url,
      })
    })
  })

  describe('when the location is a Google Maps search URL with a query param', () => {
    it('should use the query value as label', () => {
      const url = 'https://www.google.com/maps/search/?api=1&query=Eiffel+Tower'

      const result = getLocationLink(url)

      expect(result).toEqual({
        label: 'Eiffel Tower',
        href: url,
      })
    })
  })

  describe('when the location is a maps.google.com URL without a recognisable label', () => {
    it('should fall back to "Google Maps" as label', () => {
      const url = 'https://maps.google.com/?ll=51.5,-0.1'

      const result = getLocationLink(url)

      expect(result).toEqual({
        label: 'Google Maps',
        href: url,
      })
    })
  })

  describe('when the location is a goo.gl short URL', () => {
    it('should fall back to "Google Maps" as label', () => {
      const url = 'https://goo.gl/maps/abc123'

      const result = getLocationLink(url)

      expect(result).toEqual({
        label: 'Google Maps',
        href: url,
      })
    })
  })

  describe('when the location is a maps.app.goo.gl short URL', () => {
    it('should fall back to "Google Maps" as label', () => {
      const url = 'https://maps.app.goo.gl/xyz789'

      const result = getLocationLink(url)

      expect(result).toEqual({
        label: 'Google Maps',
        href: url,
      })
    })
  })
})
