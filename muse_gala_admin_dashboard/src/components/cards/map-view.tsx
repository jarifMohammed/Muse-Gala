'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MABBOX_TOKEN!

// console.log('mapbox token: ', mapboxgl.accessToken)

interface MapboxMapProps {
  latitude: number
  longitude: number
  zoom?: number
  className?: string
}

export default function MapBoxView({
  latitude,
  longitude,
  zoom = 12,
  className = 'w-full h-96',
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Validate coordinates
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      console.error('Invalid latitude or longitude:', latitude, longitude)
      return
    }

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    })

    // Add default marker
    marker.current = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current)

    // Add navigation controls
    // map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.scrollZoom.disable()
    map.current.addControl(new mapboxgl.NavigationControl())

    return () => {
      marker.current?.remove()
      map.current?.remove()
    }
  }, [latitude, longitude, zoom])

  useEffect(() => {
    if (map.current && marker.current) {
      const newCenter: [number, number] = [longitude, latitude]
      map.current.flyTo({ center: newCenter, zoom, duration: 1000 })
      marker.current.setLngLat(newCenter)
    }
  }, [latitude, longitude, zoom])

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  )
}
