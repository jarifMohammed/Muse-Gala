// 'use client'

// import { useEffect, useRef } from 'react'
// import mapboxgl from 'mapbox-gl'
// import ReactDOMServer from 'react-dom/server'
// import { MapPin } from 'lucide-react'
// import { useLocationStore } from '@/zustand/useLocationStore'

// const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

// const MarkerBig = ({ label }: { label: string }) => (
//   <div className="flex flex-col items-center">
//     <MapPin size={45} className="text-red-700 fill-white" />
//     <div className="bg-white px-2 py-1 rounded text-xs font-medium text-red-700 shadow mt-1">
//       {label}
//     </div>
//   </div>
// )

// const MarkerSmall = ({ label }: { label: string }) => (
//   <div className="flex flex-col items-center">
//     <MapPin size={30} className="text-red-700 fill-white" />
//     <div className="bg-white px-1 py-0.5 rounded text-[10px] font-medium text-red-700 shadow mt-1">
//       {label}
//     </div>
//   </div>
// )

// const ShoppinghMap = () => {
//   const mapContainer = useRef<HTMLDivElement>(null)
//   const map = useRef<mapboxgl.Map | null>(null)

//   const { latitude, longitude, lenders } = useLocationStore()

//   useEffect(() => {
//     if (!mapContainer.current) return

//     if (!map.current) {
//       mapboxgl.accessToken = MAPBOX_TOKEN

//       map.current = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: 'mapbox://styles/mapbox/light-v10',
//         center: [longitude || 90.4036, latitude || 23.7797],
//         zoom: 12,
//       })
//     }

//     document.querySelectorAll('.mapboxgl-marker').forEach((e) => e.remove())

//     lenders.forEach((lender, index) => {
//       const [lng, lat] = lender.location.coordinates

//       const MarkerComp =
//         index === 0 ? (
//           <MarkerBig label={'Nearest Lender'} />
//         ) : (
//           <MarkerSmall label={'Nearby Lender'} />
//         )

//       const el = document.createElement('div')
//       el.innerHTML = ReactDOMServer.renderToString(MarkerComp)

//       new mapboxgl.Marker({ element: el })
//         .setLngLat([lng, lat])
//         .addTo(map.current!)
//     })

//     if (lenders[0]) {
//       map.current.setCenter(lenders[0].location.coordinates)
//       map.current.setZoom(13)
//     }
//   }, [latitude, longitude, lenders])

//   return (
//     <div className="w-full h-[350px] rounded overflow-hidden shadow bg-gray-200">
//       <div ref={mapContainer} className="w-full h-full" />
//     </div>
//   )
// }

// export default ShoppinghMap

'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css' // ✅ Required for Mapbox styles, markers, popups, controls
import ReactDOMServer from 'react-dom/server'
import { MapPin } from 'lucide-react'
import { useLocationStore } from '@/zustand/useLocationStore'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const MarkerBig = () => (
  <div className="flex flex-col items-center">
    <MapPin size={45} className="text-red-700 fill-white" />
  </div>
)

const MarkerSmall = () => (
  <div className="flex flex-col items-center">
    <MapPin size={30} className="text-red-700 fill-white" />
  </div>
)

const ShoppinghMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  const { latitude, longitude, lenders, loading } = useLocationStore()

  const [mapReady, setMapReady] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // ✅ Validate token exists
    if (!MAPBOX_TOKEN) {
      console.error('⚠️ Mapbox token not found. Check NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env')
      setTokenError(true)
      return
    }

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [longitude || 144.9631, latitude || -37.8136],
        zoom: 14,
        maxZoom: 15,
      })

      map.current.on('load', () => {
        setMapReady(true)

        setTimeout(() => {
          map.current?.resize()
        }, 10)
      })

      map.current.on('error', (error) => {
        console.error('❌ Mapbox error:', error)
      })
    } catch (error) {
      console.error('❌ Failed to initialize Mapbox:', error)
      setTokenError(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ ADD MARKERS
  useEffect(() => {
    if (!map.current || !mapReady) return

    // Remove old markers
    document.querySelectorAll('.mapboxgl-marker').forEach((e) => e.remove())

    setTimeout(() => {
      map.current!.resize()
    }, 20)

    const timer = setTimeout(() => {
      lenders.forEach((lender, index) => {
        const [lng, lat] = lender.location.coordinates

        const MarkerComp =
          index === 0 ? (
            <MarkerBig />
          ) : (
            <MarkerSmall />
          )

        const el = document.createElement('div')
        el.innerHTML = ReactDOMServer.renderToString(MarkerComp)

        new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map.current!)
      })

      if (lenders[0]) {
        map.current!.flyTo({
          center: lenders[0].location.coordinates,
          zoom: 13,
          speed: 1.2,
        })
      }
    }, 80)

    return () => clearTimeout(timer)
  }, [lenders, mapReady])

  return (
    <div className="relative w-full h-[350px] rounded overflow-hidden shadow bg-gray-200">
      {/* ✅ Token Error */}
      {tokenError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm z-20 flex-col gap-2">
          <span className="text-red-600 text-sm font-medium">⚠️ Map Error</span>
          <span className="text-red-500 text-xs">Mapbox token not configured</span>
        </div>
      )}

      {/* ✅ Loading State */}
      {!tokenError && loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-20">
          <span className="text-gray-600 animate-pulse text-sm">
            Loading nearby lenders...
          </span>
        </div>
      )}

      {/* ✅ No Lenders Found */}
      {!tokenError && !loading && lenders.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-20">
          <span className="text-gray-600 text-sm">
            No nearby lenders found for this dress.
          </span>
        </div>
      )}

      {/* ✅ Map Container */}
      {!tokenError && <div ref={mapContainer} className="w-full h-full" />}
    </div>
  )
}

export default ShoppinghMap
