"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { MapPin, Search, Loader2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    precision: "exact" | "approximate" | "interpolated"
}

interface AustraliaLocationSelectorProps {
    accessToken: string
    onLocationSelect: (data: PreciseLocationData) => void
    placeholder?: string
    defaultValue?: string
    mapHeight?: string
}

export function AustraliaLocationSelector({
    accessToken,
    onLocationSelect,
    placeholder = "Search for your business location",
    defaultValue = "",
}: AustraliaLocationSelectorProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState(defaultValue)
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any[]>([])
    const debounceRef = useRef<NodeJS.Timeout>()
    const prevDefaultValueRef = useRef(defaultValue)

    const parseAustralianLocation = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (feature: any, lng?: number, lat?: number): PreciseLocationData => {
            const coordinates = lng && lat ? [lng, lat] : feature.geometry.coordinates
            const context = feature.context || []

            // Determining address precision accuracy (exact vs approximate)
            let precision: "exact" | "approximate" | "interpolated" = "approximate"
            if (feature.properties?.accuracy === "rooftop" || feature.place_type?.includes("address")) {
                precision = "exact"
            } else if (feature.properties?.accuracy === "interpolated") {
                precision = "interpolated"
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const state = context.find((c: any) => c.id.includes("region"))?.text ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                context.find((c: any) => c.id.includes("district"))?.text

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const suburb = context.find((c: any) => c.id.includes("locality"))?.text ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                context.find((c: any) => c.id.includes("neighborhood"))?.text

            return {
                longitude: Number(coordinates[0].toFixed(8)),
                latitude: Number(coordinates[1].toFixed(8)),
                address: feature.place_name,
                placeName: feature.text || feature.place_name,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                city: context.find((c: any) => c.id.includes("place"))?.text || undefined,
                suburb: suburb,
                state: state,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                country: context.find((c: any) => c.id.includes("country"))?.text || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                postcode: context.find((c: any) => c.id.includes("postcode"))?.text || undefined,
                precision: precision,
            }
        },
        []
    )

    const searchLocations = useCallback(
        async (searchQuery: string) => {
            if (!searchQuery || searchQuery.length < 3) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                        searchQuery
                    )}.json?country=au&types=address,poi,place&access_token=${accessToken}`
                )
                const data = await response.json()
                setResults(data.features || [])
            } catch (error) {
                console.error("Error fetching locations from Mapbox:", error)
                setResults([])
            } finally {
                setLoading(false)
            }
        },
        [accessToken]
    )

    // Sync internal query with defaultValue prop when it changes or when it arrives after mount
    useEffect(() => {
        if (defaultValue && defaultValue !== query) {
            setQuery(defaultValue)
        }
        prevDefaultValueRef.current = defaultValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])

    // Debounced search effect
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        // Only search if query has changed and is not empty or equal to current selection
        if (query && query.length >= 3 && query !== defaultValue) {
            debounceRef.current = setTimeout(() => {
                searchLocations(query)
            }, 500)
        }

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [query, searchLocations, defaultValue])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelect = (feature: any) => {
        setQuery(feature.place_name)
        setOpen(false)
        const preciseData = parseAustralianLocation(feature)
        onLocationSelect(preciseData)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full cursor-pointer">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            if (!open && e.target.value.length >= 3) setOpen(true)
                        }}
                        onFocus={() => {
                            if (query && query.length >= 3) setOpen(true)
                        }}
                        placeholder={placeholder}
                        className="pl-10 pr-10 w-full h-[50px] bg-white border border-[#999999]/30 rounded-[8px] focus-visible:ring-1 focus-visible:border-[#891D33]"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setQuery("")
                                setResults([])
                                setOpen(false)
                                onLocationSelect({
                                    address: "",
                                    placeName: "",
                                    latitude: 0,
                                    longitude: 0,
                                    country: "Australia",
                                    precision: "approximate"
                                })
                            }}
                            className="absolute inset-y-0 right-10 px-2 flex items-center transition-colors hover:text-[#891D33] text-gray-500"
                        >
                            <XCircle className="h-5 w-5 fill-white" />
                        </button>
                    )}
                    {loading && (
                        <div className="absolute inset-y-0 right-4 flex items-center bg-white pl-2">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        </div>
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="w-[calc(100vw-48px)] sm:w-[500px] p-0 shadow-lg border-[#999999]/20"
            >
                <ScrollArea className="max-h-[300px] overflow-y-auto">
                    {results.length > 0 ? (
                        <div className="flex flex-col py-2">
                            {results.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="flex items-start px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                    onClick={() => handleSelect(feature)}
                                >
                                    <MapPin className="h-5 w-5 text-[#891D33] mt-0.5 mr-3 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            {feature.text}
                                        </span>
                                        <span className="text-xs text-gray-500 line-clamp-1">
                                            {feature.place_name.replace(`${feature.text}, `, "")}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query.length >= 3 && !loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No results found
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            Type at least 3 characters to search
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
