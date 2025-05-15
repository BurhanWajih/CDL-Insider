"use client"

import { useState, useEffect } from "react"
import type { ApiResponse, PaginatedResponse } from "@/lib/types"

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

interface UseApiOptions<T> {
  initialData?: T
  fetchOnMount?: boolean
}

export function useApi<T>(url: string, options: UseApiOptions<T> = { fetchOnMount: true }) {
  const [data, setData] = useState<T | undefined>(options.initialData)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchData = async (fetchOptions?: FetchOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: fetchOptions?.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions?.headers,
        },
        body: fetchOptions?.body ? JSON.stringify(fetchOptions.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result: ApiResponse<T> = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Unknown API error")
      }

      setData(result.data)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      return undefined
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (options.fetchOnMount) {
      fetchData()
    }
  }, [url])

  return { data, error, isLoading, fetchData }
}

export function usePaginatedApi<T>(
  baseUrl: string,
  initialPage = 1,
  initialLimit = 10,
  options: UseApiOptions<PaginatedResponse<T>> = { fetchOnMount: true },
) {
  const [page, setPage] = useState<number>(initialPage)
  const [limit, setLimit] = useState<number>(initialLimit)
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const buildUrl = (p: number, l: number) => {
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.append("page", p.toString())
    url.searchParams.append("limit", l.toString())
    return url.toString()
  }

  const fetchData = async (p: number = page, l: number = limit) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = buildUrl(p, l)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result: ApiResponse<PaginatedResponse<T>> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || "Unknown API error")
      }

      setData(result.data.data)
      setTotal(result.data.total)
      setTotalPages(result.data.totalPages)
      setPage(result.data.page)
      setLimit(result.data.limit)

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      return undefined
    } finally {
      setIsLoading(false)
    }
  }

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    fetchData(p, limit)
  }

  const changeLimit = (l: number) => {
    setLimit(l)
    fetchData(1, l) // Reset to first page when changing limit
  }

  useEffect(() => {
    if (options.fetchOnMount) {
      fetchData(initialPage, initialLimit)
    }
  }, [])

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    error,
    isLoading,
    fetchData,
    goToPage,
    changeLimit,
  }
}
