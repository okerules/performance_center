"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // Default to false on the server
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Only run on the client
    const media = window.matchMedia(query)

    // Set the initial value
    setMatches(media.matches)

    // Set up the listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the listener
    media.addEventListener("change", listener)

    // Clean up
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}
