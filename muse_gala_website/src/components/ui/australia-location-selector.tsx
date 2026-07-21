'use client'

// import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MapPin, Navigation, Search, X } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'

// Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css'
import { toast } from 'sonner'

export interface PreciseLocationData {
  longitude: number
  latitude: number
  address: string
  placeName: string
  city?: string
  state?: string
  country: string
  postcode?: string
  suburb?: string
  precision: 'exact' | 'approximate' | 'interpolated'
}

interface AustraliaLocationSelectorProps {
  accessToken: string
  onLocationSelect: (location: PreciseLocationData) => void
  initialLocation?: PreciseLocationData
  placeholder?: string
  className?: string
  mapHeight?: string
  showCurrentLocation?: boolean
  onSearch?: () => void
  secondaryAction?: React.ReactNode
}

export default function AustraliaLocationSelector({
  accessToken,
  onLocationSelect,
  initialLocation,
  placeholder = 'Search for exact locations in Australia',
  className = '',
  // mapHeight = '500px',
  showCurrentLocation = true,
  onSearch,
  secondaryAction,
}: AustraliaLocationSelectorProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] =
    useState<PreciseLocationData | null>(initialLocation || null)
  const [showResults, setShowResults] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const parseAustralianLocation = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (feature: any, lng?: number, lat?: number): PreciseLocationData => {
      const coordinates = lng && lat ? [lng, lat] : feature.geometry.coordinates
      const context = feature.context || []
      let precision: 'exact' | 'approximate' | 'interpolated' = 'approximate'
      if (
        feature.properties?.accuracy === 'rooftop' ||
        feature.place_type?.includes('address')
      ) {
        precision = 'exact'
      } else if (feature.properties?.accuracy === 'interpolated') {
        precision = 'interpolated'
      }

      const state =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context.find((c: any) => c.id.includes('region'))?.text ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context.find((c: any) => c.id.includes('district'))?.text

      const suburb =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context.find((c: any) => c.id.includes('locality'))?.text ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        context.find((c: any) => c.id.includes('neighborhood'))?.text

      return {
        longitude: Number(coordinates[0].toFixed(8)),
        latitude: Number(coordinates[1].toFixed(8)),
        address: feature.place_name,
        placeName: feature.text || feature.place_name,
        city:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context.find((c: any) => c.id.includes('place'))?.text || undefined,
        suburb: suburb,
        state: state,
        country:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context.find((c: any) => c.id.includes('country'))?.text || '',
        postcode:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          context.find((c: any) => c.id.includes('postcode'))?.text ||
          undefined,
        precision: precision,
      }
    },
    []
  ) // no external deps → safe to memoize

  const reverseGeocodeAustralia = useCallback(
    async (lng: number, lat: number) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&types=address,poi,place&country=AU&limit=1&language=en`
        )
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          const feature = data.features[0]
          const location = parseAustralianLocation(feature, lng, lat)
          setSelectedLocation(location)
          onLocationSelect(location)
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error)
      }
    },
    [accessToken, onLocationSelect, parseAustralianLocation]
  )

  const addPreciseMarker = useCallback(
    (lng: number, lat: number) => {
      if (!map.current) return
      // Remove existing marker
      if (marker.current) {
        marker.current.remove()
      }
      // Add new precise marker with custom styling
      const markerElement = document.createElement('div')
      markerElement.className = 'precise-marker'
      markerElement.style.cssText = `
      width: 20px;
      height: 20px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    `
      marker.current = new mapboxgl.Marker({
        element: markerElement,
        draggable: true,
      })
        .setLngLat([lng, lat])
        .addTo(map.current)

      // Handle marker drag for precise positioning
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat()
          reverseGeocodeAustralia(lngLat.lng, lngLat.lat)
        }
      })
    },
    [reverseGeocodeAustralia] // Now safe to include
  )

  const handleMapClick = useCallback(
    (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat
      addPreciseMarker(lng, lat)
      reverseGeocodeAustralia(lng, lat)
    },
    [addPreciseMarker, reverseGeocodeAustralia]
  )

  // Initialize map with Australia focus
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = accessToken

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: initialLocation
        ? [initialLocation.longitude, initialLocation.latitude]
        : [151.2093, -33.8688], // Sydney fallback
      zoom: initialLocation ? 16 : 14,
      pitch: 0,
      bearing: 0,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }),
      'bottom-left'
    )

    // add click listener
    map.current.on('click', handleMapClick)

    return () => {
      map.current?.remove()
      map.current = null
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // Whenever initialLocation or selectedLocation changes, update marker
  useEffect(() => {
    if (!map.current) return

    const lng = selectedLocation?.longitude ?? initialLocation?.longitude
    const lat = selectedLocation?.latitude ?? initialLocation?.latitude

    if (lng && lat) {
      addPreciseMarker(lng, lat)
      map.current.flyTo({ center: [lng, lat], zoom: 16 })
    }
  }, [initialLocation, selectedLocation, addPreciseMarker])

  const searchAustralianLocations = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        setShowResults(false)
        return
      }
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${accessToken}&types=address,poi,place&country=AU&proximity=133.7751,-25.2744&limit=10&language=en`
        )
        const data = await response.json()
        setSearchResults(data.features || [])
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      }
    },
    [accessToken]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectSearchResult = (feature: any) => {
    const location = parseAustralianLocation(feature)
    const [lng, lat] = feature.geometry.coordinates

    setSelectedLocation(location)
    setSearchQuery(feature.place_name)
    setShowResults(false)
    onLocationSelect(location)

    // Fly to location with high zoom for precision
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        pitch: 0,
        bearing: 0,
      })
    }
    addPreciseMarker(lng, lat)
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Could not get your current location.')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords

        // Check if location is within Australia bounds (rough check)
        if (
          latitude >= -44 &&
          latitude <= -10 &&
          longitude >= 113 &&
          longitude <= 154
        ) {
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 16,
            })
          }
          addPreciseMarker(longitude, latitude)
          reverseGeocodeAustralia(longitude, latitude)
        } else {
          toast.error('Your current location appears to be outside Australia.')
        }
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        toast.error('Your current location appears to be outside Australia.')
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery !== selectedLocation?.address) {
        searchAustralianLocations(searchQuery)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedLocation?.address, searchAustralianLocations])

  return (
    <div className={`w-full relative space-y-4 ${className}`}>
      <div ref={searchContainerRef} className="relative">
        <div className="flex flex-row gap-1 relative">
          <div className="relative flex-1 min-w-0">
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onSearch?.()
                }
              }}
              className="pl-8 pr-10 text-[11px] md:text-[13px] h-9 md:h-10 border-black/20 focus:border-black transition-all rounded-none shadow-none placeholder:text-[10px] md:placeholder:text-[13px]"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onSearch?.()
              }}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-black transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>


            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setShowResults(false)
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {secondaryAction && (
            <div className="flex-1 min-w-0">
              {secondaryAction}
            </div>
          )}

          {showCurrentLocation && (
            <Button
              variant="outline"
              size="default"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center justify-center gap-2 bg-transparent brand-button whitespace-nowrap h-9 md:h-10 px-3 border-black/20 hover:border-black rounded-none transition-all text-[13px]"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{isGettingLocation ? 'Locating' : 'My Location'}</span>
            </Button>
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <Card className="absolute top-10 left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
            <CardContent className="p-0">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left p-3 hover:bg-muted transition-colors border-b last:border-b-0 flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {result.text}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {result.place_name}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Map Container */}
      {/* <div
        ref={mapContainer}
        className="w-full border overflow-hidden"
        style={{ height: mapHeight }}
      />

      <Alert className="flex items-center">
        <MapPin className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Click anywhere on the map for precise coordinates (±1.1mm accuracy).
          Drag the marker to fine-tune position. Red marker shows exact selected
          location.
        </AlertDescription>
      </Alert> */}
    </div>
  )
}
