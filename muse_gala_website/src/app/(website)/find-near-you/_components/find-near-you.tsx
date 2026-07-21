/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import AustraliaLocationSelector from '@/components/ui/australia-location-selector'
import { DualRangeSlider } from '@/components/ui/DualRangeSlider'
import ProductList from './product-list'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useFindNearYouStore } from '@/zustand/useFindNearYouStore'
import { useEffect, useState, useRef, useCallback } from 'react'
import type { ApiProduct } from '@/app/(website)/find-near-you/utility/normalizeProducts'
import ViewToggle from './view-toggle'

export default function FindNearYou() {
  const pathname = usePathname()
  const isMapPage = pathname === '/find-near-you/map'

  // Zustand store
  const {
    selectedLocation,
    radius,
    size,
    category,
    minPrice,
    maxPrice,
    page,
    allProducts,
    searchTerm,
    pagination,
    setState,
    resetPage,
    nextPage,
    setAllProducts,
    setPagination,
  } = useFindNearYouStore()

  // UI
  const [showFilters, setShowFilters] = useState(false)
  const [isAutoLocating, setIsAutoLocating] = useState(false)
  const mapboxtoken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  // Fetcher
  const fetchProducts = async (): Promise<ApiProduct[]> => {
    const queryParams = new URLSearchParams()

    // Only add location/radius if we have a location AND we are not searching by dress name
    // (Dress name search is always global per user requirements)
    if (selectedLocation && !searchTerm) {
      queryParams.append('latitude', String(selectedLocation.latitude))
      queryParams.append('longitude', String(selectedLocation.longitude))
      queryParams.append('radius', String(radius * 1000))
    }

    queryParams.append('page', String(page))
    if (size) queryParams.append('size', size)
    if (category) queryParams.append('category', category)
    if (minPrice) queryParams.append('minPrice', minPrice)
    if (maxPrice) queryParams.append('maxPrice', maxPrice)
    if (searchTerm) queryParams.append('search', searchTerm)

    const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
    const apiUrl = `${baseUrl}/api/v1/admin/?${queryParams.toString()}`

    console.log('Fetching Products with URL:', apiUrl)

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Failed to fetch products')

    const data = await res.json()
    setPagination(data?.pagination || null)

    return data?.data || []
  }

  const { data, isFetching, isError, error, refetch, isLoading } = useQuery({
    queryKey: [
      'products',
      selectedLocation,
      radius,
      size,
      category,
      minPrice,
      maxPrice,
      searchTerm,
      page,
    ],
    queryFn: fetchProducts,
    enabled: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })

  // 🌍 Map Markers Query (Un-paginated)
  const mapMarkersQuery = useQuery({
    queryKey: [
      'map-markers',
      selectedLocation,
      radius,
      size,
      category,
      minPrice,
      maxPrice,
      searchTerm,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      if (selectedLocation && !searchTerm) {
        queryParams.append('latitude', String(selectedLocation.latitude))
        queryParams.append('longitude', String(selectedLocation.longitude))
        queryParams.append('radius', String(radius * 1000))
      }
      if (size) queryParams.append('size', size)
      if (category) queryParams.append('category', category)
      if (minPrice) queryParams.append('minPrice', minPrice)
      if (maxPrice) queryParams.append('maxPrice', maxPrice)
      if (searchTerm) queryParams.append('search', searchTerm)

      const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
      const apiUrl = `${baseUrl}/api/v1/admin/map-markers?${queryParams.toString()}`

      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error('Failed to fetch map markers')
      const data = await res.json()
      return data?.data || []
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  })

  // Sync fetching status to store for MapPage
  useEffect(() => {
    setState({ isLoading: isFetching || isLoading || mapMarkersQuery.isFetching || mapMarkersQuery.isLoading })
  }, [isFetching, isLoading, mapMarkersQuery.isFetching, mapMarkersQuery.isLoading, setState])

  // Merge map markers into Zustand
  useEffect(() => {
    if (mapMarkersQuery.data) {
      setState({ mapMarkers: mapMarkersQuery.data })
    }
  }, [mapMarkersQuery.data, setState])

  // Merge fetched products into Zustand
  useEffect(() => {
    if (!data) return

    if (data.length === 0 && selectedLocation && !isFetching) {
      toast.error('No dress found near your radius', {
        description: 'Please increase your radius to see more results.',
        position: 'bottom-right',
      })
    }

    if (page === 1) {
      setAllProducts(data) // reset list
    } else {
      setAllProducts((prev) => {
        const ids = new Set(prev.map((p) => p._id))
        const newOnes = data.filter((p) => !ids.has(p._id))
        return [...prev, ...newOnes]
      })
    }
  }, [data, page, setAllProducts, isFetching, selectedLocation])

  // Infinite Scroll Observer for List View
  const listObserver = useRef<IntersectionObserver | null>(null)
  const lastListElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching || isMapPage) return
      if (listObserver.current) listObserver.current.disconnect()

      listObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination && page < pagination.totalPages) {
          nextPage()
        }
      })

      if (node) listObserver.current.observe(node)
    },
    [isFetching, isMapPage, pagination, page, nextPage]
  )

  // Auto-location on mount
  useEffect(() => {
    // Only auto-locate if no location is selected and we haven't already started
    if (selectedLocation || isAutoLocating) return

    if (!navigator.geolocation) return

    setIsAutoLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords

        // Check if location is within Australia bounds (rough check)
        const isOutsideAustralia =
          latitude < -44 ||
          latitude > -10 ||
          longitude < 113 ||
          longitude > 154

        if (isOutsideAustralia) {
          setIsAutoLocating(false)
          return
        }

        try {
          toast.loading('Locating and searching for dresses...', { id: 'search-toast' })
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxtoken}&types=address,poi,place&country=AU&limit=1&language=en`
          )
          const geoData = await res.json()
          const placeName = geoData.features?.[0]?.place_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

          setState({
            selectedLocation: {
              latitude,
              longitude,
              placeName,
            },
          })
          // Let React Query handle the cache naturally, just force page 1
          resetPage()
          setTimeout(() => {
            refetch()
            mapMarkersQuery.refetch()
            toast.dismiss('search-toast')
          }, 0)
        } catch (err) {
          console.error('Auto-location geocoding error:', err)
          toast.error('Could not determine your address.', { id: 'search-toast' })
        } finally {
          setIsAutoLocating(false)
        }
      },
      (err) => {
        console.error('Auto-location error:', err)
        setIsAutoLocating(false)
      },
      { timeout: 10000 }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount

  // Manual trigger functions
  const handleSearchNearYou = () => {
    if (!selectedLocation) return
    resetPage()
    refetch()
    mapMarkersQuery.refetch()
  }


  const handleClearFilters = () => {
    setState({
      size: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    })
    resetPage()
    setTimeout(() => {
      refetch()
      mapMarkersQuery.refetch()
    }, 0)
    setShowFilters(false)
  }


  // Prevent resetting results on initial mount (when switching views)
  const isFirstMount = useRef(true)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    // Only reset pagination, let TanStack overwrite the products via cache naturally
    resetPage()
  }, [selectedLocation, radius, size, category, minPrice, maxPrice, searchTerm, resetPage])

  return (
    <section className="container mx-auto pt-0.5 pb-2">
      <h1 className="brand-header mb-1">
        Find Near You
      </h1>


      {/* Search Bar / Location Selector */}
      <div className="mb-4">
        <AustraliaLocationSelector
          accessToken={mapboxtoken || ''}
          initialLocation={
            selectedLocation
              ? {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                placeName: selectedLocation.placeName,
                address: selectedLocation.placeName,
                country: 'Australia', //required field fix
                precision: 'exact',
              }
              : undefined
          }
          onLocationSelect={(data) => {
            setState({
              selectedLocation: {
                latitude: data.latitude,
                longitude: data.longitude,
                placeName: data.placeName,
              },
            })
          }}
          onSearch={handleSearchNearYou}
          placeholder="Search for your location"
          mapHeight="300px"
          secondaryAction={
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search by dress name"
                value={searchTerm}
                onChange={(e) => setState({ searchTerm: e.target.value })}
                className="pl-10 h-9 md:h-10 border-black/20 focus:border-black transition-all rounded-none shadow-none text-[11px] md:text-[13px] placeholder:text-[10px] md:placeholder:text-[13px]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          }
        />
      </div>

      {/* Controls Row: Filters, View Toggle, and Radius */}
      <div className="flex flex-nowrap items-center justify-start md:justify-center gap-1 md:gap-8 mb-4 px-4 md:px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 md:gap-4 shrink-0">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 brand-button px-2 md:px-4 text-xs md:text-sm tracking-tighter md:tracking-normal h-8 md:h-10 shrink-0 uppercase"
          >
            <Filter size={12} className="md:size-4" />
            FILTERS{' '}
            {showFilters ? <ChevronUp size={12} className="md:size-4" /> : <ChevronDown size={12} className="md:size-4" />}
          </Button>
          <ViewToggle />
        </div>

        <div className="flex items-center gap-1 md:gap-4 flex-1 md:flex-none min-w-[120px] max-w-[140px] md:min-w-[300px] md:max-w-none">
          <span className="brand-body whitespace-nowrap text-[10px] md:text-sm uppercase shrink-0">
            <span className="hidden md:inline">Radius: </span><span className="font-medium">{radius}km</span>
          </span>
          <Slider
            value={[radius]}
            max={100}
            step={2}
            className="flex-1"
            onValueChange={(val) => setState({ radius: val[0] })}
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
          <p className="brand-subheader mb-4">
            Filter Options
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] md:gap-[45px] lg:gap-[60px]">
            {/* Size */}
            <div>
              <Label className="brand-body text-black">Size</Label>
              <Select
                value={size || 'CLEAR'}
                onValueChange={(val) =>
                  setState({ size: val === 'CLEAR' ? '' : val })
                }
              >
                <SelectTrigger className="w-full border-b shadow-none rounded-none pt-5 pb-3 h-auto">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLEAR">All Sizes</SelectItem>
                  <SelectItem value="XXS">XXS</SelectItem>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Label className="brand-body text-black">Category</Label>
              <Select
                value={category}
                onValueChange={(val) =>
                  setState({ category: val === 'CLEAR' ? '' : val })
                }
              >
                <SelectTrigger className="w-full border-b shadow-none rounded-none pt-5 pb-3 h-auto">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLEAR">All Categories</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Cocktail">Cocktail</SelectItem>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Party">Party</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label className="brand-body text-black">Price Range</Label>
              <div className="pt-8 pb-10 px-2 min-h-[80px]">
                <DualRangeSlider
                  label={(value) => `$${value}`}
                  value={[
                    minPrice ? parseInt(minPrice) : 0,
                    maxPrice ? parseInt(maxPrice) : 500,
                  ]}
                  onValueChange={(vals) => {
                    setState({
                      minPrice: vals[0].toString(),
                      maxPrice: vals[1].toString(),
                    })
                  }}
                  min={0}
                  max={500}
                  step={10}
                />
              </div>
              <div className="flex items-center gap-2 border-b border-black pb-4">
                <Input
                  type="number"
                  placeholder="Min"
                  className="border-none shadow-none p-0 focus-visible:ring-0 h-8 font-avenir"
                  value={minPrice}
                  onChange={(e) => setState({ minPrice: e.target.value })}
                />
                <span className="text-xl text-black px-1">—</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="border-none shadow-none p-0 focus-visible:ring-0 h-8 font-avenir text-right"
                  value={maxPrice}
                  onChange={(e) => setState({ maxPrice: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 brand-button border border-black hover:bg-black hover:text-white uppercase text-xs md:text-sm"
              onClick={() => setShowFilters(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 brand-button border border-gray-300 text-gray-500 hover:bg-gray-100 uppercase text-xs md:text-sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}


      {!isMapPage && (
        <div className="mt-0">
          {allProducts.length > 0 && <ProductList products={allProducts} />}

          {/* Infinite Scroll Sentinel for List View */}
          <div ref={lastListElementRef} className="h-20 flex flex-col items-center justify-center py-4">
            {isFetching && page > 1 ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              pagination && page >= pagination.totalPages && allProducts.length > 0 && (
                <span className="text-[10px] tracking-[4px] text-gray-400 uppercase">
                  No more dresses
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {!isMapPage && (isLoading || isFetching) && allProducts.length === 0 && (
        <div className="mt-0 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full h-40 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-6 flex items-center gap-2 text-red-600">
          <AlertCircle className="size-5" />
          <span>{(error as Error)?.message || 'Something went wrong'}</span>
        </div>
      )}

      {/* Initial state while auto-locating - only if list is empty */}
      {!isMapPage && !isFetching && !isError && allProducts.length === 0 && isAutoLocating && (
        <div className="mt-16 text-center space-y-5">
          <AlertCircle className="mx-auto mb-3 text-gray-400 size-24" />
          <h3 className="brand-subheader text-gray-700">
            Detecting your location
          </h3>
          <p className="brand-body text-gray-500 mt-1">
            Please allow location access to find dresses near you automatically.
          </p>
        </div>
      )}

      {/* No Results State (when database is empty or filters are too restrictive) */}
      {!isMapPage &&
        !isFetching &&
        allProducts.length === 0 &&
        !isError &&
        !isAutoLocating && (
          <div className="mt-16 text-center space-y-5">
            <AlertCircle className="mx-auto mb-3 text-gray-400 size-24" />
            <h3 className="brand-subheader text-gray-700">
              No results found
            </h3>
            <p className="brand-body text-gray-500 mt-1">
              {selectedLocation && !searchTerm
                ? 'Try increasing your search radius or choosing a different location.'
                : 'Try adjusting your filters or search term to see more results.'}
            </p>
          </div>
        )}
    </section>
  )
}
