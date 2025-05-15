import type React from "react"
/**
 * Utility functions for handling images in the application
 */

// Base path for images
const IMAGE_BASE_PATH = "/images"

/**
 * Get the image URL for a player
 * @param playerName The name of the player
 * @returns The URL of the player's image or a placeholder
 */
export function getPlayerImageUrl(playerName: string): string {
  if (!playerName) return getPlaceholderImage(40, 40)

  // Convert player name to kebab case for file naming
  const fileName = playerName.toLowerCase().replace(/\s+/g, "-")

  // Return the URL (this would be checked at build time in a real app)
  return `/images/players/${fileName}.png`
}

/**
 * Get the image URL for a team
 * @param teamSlug The slug of the team
 * @returns The URL of the team's image or a placeholder
 */
export function getTeamImageUrl(teamSlug: string): string {
  if (!teamSlug) return getPlaceholderImage(40, 40)

  // Return the URL
  return `/images/teams/${teamSlug}.png`
}

/**
 * Get the logo URL
 * @returns The URL of the site logo
 */
export function getLogoUrl(): string {
  return "/images/logo.png"
}

/**
 * Get a placeholder image with specified dimensions
 * @param width The width of the placeholder
 * @param height The height of the placeholder
 * @returns The URL of the placeholder image
 */
export function getPlaceholderImage(width: number, height: number): string {
  return `/placeholder.svg?height=${height}&width=${width}`
}

/**
 * Handle image error by replacing with a placeholder
 * @param event The error event
 * @param width The width of the placeholder
 * @param height The height of the placeholder
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, width = 40, height = 40): void {
  const target = event.target as HTMLImageElement
  target.src = getPlaceholderImage(width, height)
  target.onerror = null // Prevent infinite loop
}
