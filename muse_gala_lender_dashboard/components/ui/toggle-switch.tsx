"use client"

import { useState, useEffect } from "react"

interface ToggleSwitchProps {
  initialState?: boolean
  onChange?: (isActive: boolean) => void
  disabled?: boolean
}

export function ToggleSwitch({ initialState = false, onChange, disabled = false }: ToggleSwitchProps) {
  const [isActive, setIsActive] = useState(initialState)
  const [isAnimating, setIsAnimating] = useState(false)

  // Update internal state when initialState changes
  useEffect(() => {
    setIsActive(initialState)
  }, [initialState])

  const handleToggle = () => {
    if (disabled) return

    setIsAnimating(true)
    const newState = !isActive
    setIsActive(newState)

    // Call onChange after a slight delay to allow animation
    setTimeout(() => {
      if (onChange) onChange(newState)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div
      className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${
        isActive ? "bg-primary" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${isAnimating ? "animate-pulse" : ""}`}
      onClick={handleToggle}
      role="switch"
      aria-checked={isActive}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleToggle()
        }
      }}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          isActive ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  )
}
