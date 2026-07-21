"use client"

import React, { useEffect, useState } from "react"
import { AustraliaLocationSelector, PreciseLocationData } from "@/components/shared/australia-location-selector"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function LocationSettings({
    token,
    userID,
    userInfo
}: Readonly<{
    token: string
    userID: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userInfo: any
}>) {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    const getProfileData = (userData: any) => {
        if (userData?.data?.user) return userData.data.user;
        if (userData?.user) return userData.user;
        if (userData?.data) return userData.data;
        return userData;
    };

    const extractLocation = (userData: any): PreciseLocationData => {
        const profile = getProfileData(userData);
        const l = profile?.location || profile?.businessLocation || profile?.business_location || {};
        
        // Helper to find a value at any nesting level with multiple key variations
        const findField = (keys: string[]) => {
            for (const key of keys) {
                if (l[key] !== undefined && l[key] !== null && l[key] !== "") return l[key];
                if (profile[key] !== undefined && profile[key] !== null && profile[key] !== "") return profile[key];
            }
            return "";
        };

        return {
            address: findField(["address", "Address", "formatted_address"]),
            placeName: findField(["placeName", "place_name", "PlaceName", "text", "address", "Address"]),
            city: findField(["city", "City", "city_name", "town"]),
            state: findField(["state", "State", "region", "province"]),
            suburb: findField(["suburb", "Suburb", "locality", "neighborhood"]),
            postcode: findField(["postcode", "post_code", "Postcode", "PostCode", "zip", "zip_code"]),
            country: findField(["country", "Country", "country_name"]) || "Australia",
            latitude: Number(findField(["latitude", "lat", "Latitude"])) || 0,
            longitude: Number(findField(["longitude", "lng", "Longitude"])) || 0,
            precision: (findField(["precision", "Precision"]) as "exact" | "approximate" | "interpolated") || "approximate",
        }
    };

    const [location, setLocation] = useState<PreciseLocationData>(extractLocation(userInfo))

    // Only sync from userInfo if we don't have a valid address yet or if data arrives from the server
    useEffect(() => {
        const extracted = extractLocation(userInfo);
        if (extracted.address || extracted.placeName) {
            setLocation(extracted);
        }
    }, [userInfo])

    const { mutate, isPending } = useMutation({
        mutationKey: ["update-location", userID],
        mutationFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/lender/account/${userID}/location`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(location),
                }
            )

            if (!res.ok) {
                throw new Error("Failed to update business location")
            }

            return res.json()
        },
        onSuccess: (data) => {
            toast.success(data.message || "Location updated successfully!")
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            toast.error(error.message || "An error occurred while saving the location.")
        },
    })

    const handleSubmit = () => {
        if (!location.address) {
            toast.error("Please search and select a valid location first.")
            return
        }
        mutate()
    }

    // Check if location has actually changed from what's in userInfo
    const savedLocation = extractLocation(userInfo);
    const isChanged =
        location.address !== (savedLocation.address || "") ||
        location.latitude !== (savedLocation.latitude || 0) ||
        location.longitude !== (savedLocation.longitude || 0);

    return (
        <div className="p-4 md:p-6 bg-white shadow-[0px_4px_10px_0px_#0000001A] rounded-lg">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-[#891D33]" />
                <h1 className="text-lg md:text-xl font-medium">Business Location</h1>
            </div>

            <div className="space-y-6">
                {/* Search Input using Mapbox */}
                <div className="w-full">
                    <label htmlFor="address-search" className="block text-sm font-medium text-gray-700 mb-2">
                        Search Address
                    </label>
                    <AustraliaLocationSelector
                        accessToken={mapboxToken}
                        onLocationSelect={(data) => setLocation(data)}
                        defaultValue={location.address}
                        placeholder="Start typing your business address..."
                    />
                </div>

                {/* Read-only Information Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-[#f7f2ee]/50 p-4 md:p-5 rounded-[8px] border border-[#999999]/20">
                    <div>
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Selected Address
                        </span>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.placeName || "Not selected"}
                        </div>
                    </div>

                    <div>
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            City / Suburb
                        </span>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.city || location.suburb || "Not selected"}
                        </div>
                    </div>

                    <div>
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            State
                        </span>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.state || "Not selected"}
                        </div>
                    </div>

                    <div>
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                            Postcode & Country
                        </span>
                        <div className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">
                            {location.postcode ? `${location.postcode}, ` : ""}{location.country || "Not selected"}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !location.address || !isChanged}
                        className="disabled:cursor-not-allowed bg-[#891D33] hover:bg-[#a0243d] text-white shadow-md transition-all duration-300"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <LoaderCircle className="animate-spin h-5 w-5" />
                                Saving Changes...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
