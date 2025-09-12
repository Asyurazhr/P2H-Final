"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface AutocompleteOption {
  id: number
  name: string
  nik: string
}

interface AutocompleteInputProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSelect: (option: AutocompleteOption) => void
  apiEndpoint: string
  className?: string
}

export function AutocompleteInput({
  placeholder,
  value,
  onChange,
  onSelect,
  apiEndpoint,
  className = "",
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`${apiEndpoint}?search=${encodeURIComponent(value)}`)
        const data = await response.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [value, apiEndpoint])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option: AutocompleteOption) => {
    onChange(option.name)
    onSelect(option)
    setShowSuggestions(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
      />

      {showSuggestions && (
        <Card ref={suggestionsRef} className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Mencari...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((option) => (
              <div
                key={option.id}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelect(option)}
              >
                <div className="font-medium">{option.name}</div>
                <div className="text-sm text-gray-500">NIK: {option.nik}</div>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">Tidak ada hasil ditemukan</div>
          )}
        </Card>
      )}
    </div>
  )
}
