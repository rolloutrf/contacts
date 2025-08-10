import React, { useMemo, useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import ContactCard from "./components/ContactCard.jsx"
import ContactModal from "./components/ContactModal.jsx"
import Logo from "./components/Logo.jsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun } from "lucide-react"

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001"

async function fetchContacts() {
  const res = await fetch(`${API_BASE}/contacts`)
  if (!res.ok) throw new Error("Failed to load contacts")
  return res.json()
}

const industries = ["Все", "Банки"]
const functions = ["Все", "Design", "Development", "Product", "Marketing"]

export default function App() {
  const { data, isLoading, error } = useQuery({ queryKey: ["contacts"], queryFn: fetchContacts, staleTime: 1000 * 60 * 30 })
  const [query, setQuery] = useState("")
  const [ind, setInd] = useState("Все")
  const [fn, setFn] = useState("Все")
  const [sortBy, setSortBy] = useState("name")
  const [displayCount, setDisplayCount] = useState(12)
  const [isDark, setIsDark] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const onOpen = (c) => { setSelected(c); setOpen(true) }
  const onClose = () => setOpen(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const filteredAndSortedList = useMemo(() => {
    if (!data) return []
    let filtered = data.filter((c) => {
      const s = `${c.employee_first_name_ru} ${c.employee_last_name_ru} ${c.company_name_ru}`.toLowerCase()
      const passText = s.includes(query.toLowerCase())
      const passInd = ind === "Все" || c.industry === ind
      const passFn = fn === "Все" || c.function === fn
      return passText && passInd && passFn
    })

    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.employee_first_name_ru} ${a.employee_last_name_ru}`.localeCompare(`${b.employee_first_name_ru} ${b.employee_last_name_ru}`)
        case "company":
          return a.company_name_ru.localeCompare(b.company_name_ru)
        case "industry":
          return a.industry.localeCompare(b.industry)
        case "function":
          return a.function.localeCompare(b.function)
        default:
          return 0
      }
    })

    return sorted
  }, [data, query, ind, fn, sortBy])

  const displayedList = filteredAndSortedList.slice(0, displayCount)
  const hasMore = filteredAndSortedList.length > displayCount

  useEffect(() => {
    setDisplayCount(12)
    setIsLoadingMore(false)
  }, [query, ind, fn, sortBy])

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    setTimeout(() => {
      setDisplayCount(prev => prev + 12)
      setIsLoadingMore(false)
    }, 300) // Небольшая задержка для плавности
  }, [isLoadingMore, hasMore])

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
      loadMore()
    }
  }, [loadMore])

  // Добавляем обработчик скролла
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="min-h-dvh px-6 py-6 max-w-7xl mx-auto bg-zinc-100 dark:bg-zinc-900">
      <header className="flex items-center justify-between mb-6">
        <Logo />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          aria-label="Переключить тему"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>

      <div className="flex flex-wrap gap-3 mb-6">
        <Input 
          className="max-w-xs" 
          placeholder="Поиск по имени или компании" 
          value={query} 
          onChange={(e)=>setQuery(e.target.value)} 
        />
        <Select value={ind} onValueChange={setInd}>
          <SelectTrigger className="max-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {industries.map((x)=> <SelectItem key={x} value={x}>{x}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={fn} onValueChange={setFn}>
          <SelectTrigger className="max-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {functions.map((x)=> <SelectItem key={x} value={x}>{x}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="max-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">По имени</SelectItem>
            <SelectItem value="company">По компании</SelectItem>
            <SelectItem value="industry">По индустрии</SelectItem>
            <SelectItem value="function">По функции</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={()=>{ setQuery(""); setInd("Все"); setFn("Все"); setSortBy("name") }}>
          Сбросить
        </Button>
      </div>

      {isLoading && <p className="text-zinc-500 dark:text-zinc-400">Загрузка…</p>}
      {error && <p className="text-red-600">Ошибка: {String(error.message)}</p>}
      {!isLoading && !error && displayedList.length === 0 && <p className="text-zinc-500 dark:text-zinc-400">Ничего не найдено</p>}
      
      {!isLoading && !error && filteredAndSortedList.length > 0 && (
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Показано {displayedList.length} из {filteredAndSortedList.length} контактов
        </p>
      )}

      <section className="grid-cards">
        {displayedList.map((c) => (
          <ContactCard key={c.id} contact={c} onOpen={onOpen} />
        ))}
      </section>

      {hasMore && (
        <div className="flex flex-col items-center mt-8 gap-4">
          <Button onClick={loadMore} size="lg" disabled={isLoadingMore}>
            {isLoadingMore ? "Загрузка..." : "Показать еще"}
          </Button>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Или просто прокрутите страницу вниз
          </p>
        </div>
      )}

      {isLoadingMore && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin h-8 w-8 border-4 border-zinc-300 dark:border-zinc-600 border-t-zinc-600 dark:border-t-zinc-300 rounded-full"></div>
        </div>
      )}

      <ContactModal contact={selected} onClose={onClose} open={open} />
    </div>
  )
}
