'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './unsubscribe.css'

// API configuration
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.musegala.com.au'

export default function Unsubscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email address' })
      return
    }

    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(`${API_URL}/api/v1/newsletterSubscription/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({ type: 'success', message: 'You have been successfully unsubscribed.' })
        setEmail('')
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Unable to connect. Please try again later.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="unsubscribe-container">
      {/* Header with Logo */}
      <header className="unsubscribe-header">
        <Link href="/" className="logo-link">
          <Image
            src="/logo-black.svg"
            alt="Muse Gala Logo"
            width={300}
            height={100}
            className="unsubscribe-logo"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="unsubscribe-content">
        {/* Title */}
        <h1 className="unsubscribe-title">Unsubscribe</h1>

        {/* Subtitle */}
        <p className="unsubscribe-subtitle">
          We&apos;re sorry to see you go. Enter your email below to unsubscribe from our mailing list.
        </p>

        {/* Unsubscribe form */}
        <form className="unsubscribe-form" onSubmit={handleSubmit}>
          <div className="email-input-wrapper">
            <input
              type="email"
              className="email-input"
              placeholder="Email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              aria-label="Email address"
            />
          </div>
          <button
            type="submit"
            className="unsubscribe-button"
            disabled={isLoading}
            aria-label="Unsubscribe"
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Unsubscribe'
            )}
          </button>
        </form>

        {/* Status message */}
        {status.message && (
          <p className={`message ${status.type}`}>
            {status.message}
          </p>
        )}

        {/* Back to Home Link */}
        <div className="back-link-container">
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
