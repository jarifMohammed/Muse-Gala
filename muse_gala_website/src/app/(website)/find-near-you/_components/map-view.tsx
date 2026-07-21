'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import {
  ApiProduct,
  ProductCardData,
  normalizeProducts,
} from '../utility/normalizeProducts'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

interface MapViewProps {
  products?: ApiProduct[]
}

export default function MapView({ products }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const normalizedProducts: ProductCardData[] = normalizeProducts(products)

  useEffect(() => {
    if (!mapContainer.current) return

    const defaultCenter: [number, number] = [151.2093, -33.8731] // Sydney Thai Town

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: normalizedProducts.length
        ? [normalizedProducts[0].longitude!, normalizedProducts[0].latitude!]
        : defaultCenter,
      zoom: normalizedProducts.length ? 14 : 12,
    })

    // Add markers
    if (normalizedProducts.length > 0) {
      normalizedProducts.forEach((p) => {
        if (!p.latitude || !p.longitude) return

        const popupNode = document.createElement('div')
        popupNode.style.maxWidth = '250px'
        popupNode.style.maxHeight = '300px'
        popupNode.style.overflowY = 'auto'
        popupNode.innerHTML = `
          <div style="padding:6px;font-family:sans-serif">
            <h3 style="font-weight:bold;margin-bottom:8px">${p.name}</h3>
            <p style="margin-bottom:6px;color:#444">Price: $${p.price}</p>
            <img src="${p.image}" alt="${p.name}" 
              style="width:100%;border-radius:8px;object-fit:cover;margin-bottom:8px"/>
          </div>
        `
        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupNode
        )
        new mapboxgl.Marker({ color: '#d33' })
          .setLngLat([p.longitude, p.latitude])
          .setPopup(popup)
          .addTo(map.current!)
      })
    } else {
      // Demo Marker
      new mapboxgl.Marker({ color: '#007AFF' })
        .setLngLat(defaultCenter)
        .setPopup(new mapboxgl.Popup().setHTML('<b>Thai Town, Sydney</b>'))
        .addTo(map.current!)
    }

    return () => map.current?.remove()
  }, [normalizedProducts])

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0" />
      <p className="absolute top-4 left-4 bg-white p-2 shadow rounded text-sm">
        {normalizedProducts.length > 0
          ? `Showing ${normalizedProducts.length} dresses on the map`
          : 'Showing demo marker: Thai Town, Sydney'}
      </p>
    </div>
  )
}
