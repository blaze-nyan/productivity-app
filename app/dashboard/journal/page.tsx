"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Book, Calendar, Edit, Plus, Search, Tag, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  tags: string[]
  date: string
  createdAt: string
}

const moods = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "productive", label: "Productive", emoji: "💪" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "excited", label: "Excited", emoji: "🤩" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
]

const popularTags = [
  "work",
  "personal",
  "health",
  "learning",
  "family",
  "friends",
  "goals",
  "gratitude",
  "ideas",
  "reflection",
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Productive day at work",
      content:
        "Today I completed the project I've been working on for weeks. It feels great to finally ship it and get positive feedback from the team. I also had a good brainstorming session for the next feature we're planning to build.",
      mood: "productive",
      tags: ["work", "goals", "accomplishment"],
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: "2",
      title: "Morning reflection",
      content:
        "Woke up early today and had time for meditation and a good breakfast. I'm grateful for the quiet morning hours that allow me to center myself before the day begins. I want to make this a consistent habit.",
      mood: "calm",
      tags: ["morning", "meditation", "gratitude"],
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "3",
      title: "Family dinner",
      content:
        "Had dinner with my parents and siblings tonight. It's been a while since we all got together, and it was wonderful to catch up and share stories. Mom made her famous lasagna, which is always a highlight.",
      mood: "happy",
      tags: ["family", "food", "connection"],
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ])

  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    title: "",
    content: "",
    mood: "neutral",
    tags: [],
    date: new Date().toISOString(),
  })

  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [isEditingEntry, setIsEditingEntry] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.content) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title || "",
      content: newEntry.content || "",
      mood: newEntry.mood || "neutral",
      tags: newEntry.tags || [],
      date: newEntry.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    setEntries((prev) => [entry, ...prev])
    setNewEntry({
      title: "",
      content: "",
      mood: "neutral",
      tags: [],
      date: new Date().toISOString(),
    })
    setIsAddingEntry(false)
  }

  const handleEditEntry = () => {
    if (!editingEntryId || !newEntry.title || !newEntry.content) return

    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === editingEntryId) {
          return {
            ...entry,
            title: newEntry.title || entry.title,
            content: newEntry.content || entry.content,
            mood: newEntry.mood || entry.mood,
            tags: newEntry.tags || entry.tags,
            date: newEntry.date || entry.date,
          }
        }
        return entry
      }),
    )

    setNewEntry({
      title: "",
      content: "",
      mood: "neutral",
      tags: [],
      date: new Date().toISOString(),
    })
    setIsEditingEntry(false)
    setEditingEntryId(null)
  }

  const startEditEntry = (entry: JournalEntry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: [...entry.tags],
      date: entry.date,
    })
    setEditingEntryId(entry.id)
    setIsEditingEntry(true)
  }

  const deleteEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
  }

  const addTag = (tag: string) => {
    if (!tag.trim() || (newEntry.tags && newEntry.tags.includes(tag.trim()))) return

    setNewEntry((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tag.trim()],
    }))
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setNewEntry((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }))
  }

  const filteredEntries = entries.filter((entry) => {
    let matchesSearch = true
    let matchesDate = true
    let matchesTag = true
    let matchesMood = true

    if (searchQuery) {
      matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedDate) {
      matchesDate = format(parseISO(entry.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    }

    if (selectedTag) {
      matchesTag = entry.tags.includes(selectedTag)
    }

    if (selectedMood) {
      matchesMood = entry.mood === selectedMood
    }

    return matchesSearch && matchesDate && matchesTag && matchesMood
  })

  const allTags = Array.from(new Set(entries.flatMap((entry) => entry.tags)))

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedDate(undefined)
    setSelectedTag(null)
    setSelectedMood(null)
  }

  const getMoodEmoji = (mood: string) => {
    return moods.find((m) => m.value === mood)?.emoji || "😐"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground">Record your thoughts, reflections, and experiences</p>
        </div>
        <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
              <DialogDescription>Record your thoughts, feelings, and experiences.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Give your entry a title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px]"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="mood" className="text-sm font-medium">
                    Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm ${
                          newEntry.mood === mood.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                      >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {newEntry.date ? format(parseISO(newEntry.date), "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newEntry.date ? parseISO(newEntry.date) : undefined}
                        onSelect={(date) =>
                          setNewEntry({ ...newEntry, date: date?.toISOString() || new Date().toISOString() })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEntry.tags &&
                    newEntry.tags.map((tag) => (
                      <Badge key={tag} className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-primary/20"
                          onClick={() => removeTag(tag)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(tagInput)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="text-xs bg-muted hover:bg-muted/80 rounded-full px-2 py-1"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEntry}>Save Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingEntry} onOpenChange={setIsEditingEntry}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Journal Entry</DialogTitle>
              <DialogDescription>Update your journal entry.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="edit-title"
                  placeholder="Give your entry a title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="edit-content"
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px]"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-mood" className="text-sm font-medium">
                    Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm ${
                          newEntry.mood === mood.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                      >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-date" className="text-sm font-medium">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {newEntry.date ? format(parseISO(newEntry.date), "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newEntry.date ? parseISO(newEntry.date) : undefined}
                        onSelect={(date) =>
                          setNewEntry({ ...newEntry, date: date?.toISOString() || new Date().toISOString() })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-tags" className="text-sm font-medium">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEntry.tags &&
                    newEntry.tags.map((tag) => (
                      <Badge key={tag} className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-primary/20"
                          onClick={() => removeTag(tag)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag(tagInput)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingEntry(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditEntry}>Update Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Find specific journal entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search entries..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="date-filter" className="text-sm font-medium">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="date-filter" variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label htmlFor="tag-filter" className="text-sm font-medium">
                  Tags
                </label>
                <Command className="rounded-lg border shadow-md">
                  <CommandInput placeholder="Search tags..." />
                  <CommandList>
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup>
                      {allTags.map((tag) => (
                        <CommandItem
                          key={tag}
                          onSelect={() => setSelectedTag(selectedTag === tag ? null : tag)}
                          className="flex items-center gap-2"
                        >
                          <Tag className="h-4 w-4" />
                          <span>{tag}</span>
                          {selectedTag === tag && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm ${
                        selectedMood === mood.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
                    >
                      <span>{mood.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Entries</span>
                <span className="font-medium">{entries.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">
                  {
                    entries.filter((entry) => {
                      const entryDate = parseISO(entry.date)
                      const now = new Date()
                      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most Used Tag</span>
                <span className="font-medium">
                  {allTags.length > 0
                    ? allTags.sort(
                        (a, b) =>
                          entries.filter((entry) => entry.tags.includes(b)).length -
                          entries.filter((entry) => entry.tags.includes(a)).length,
                      )[0]
                    : "None"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No journal entries found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                {entries.length === 0
                  ? "Start journaling to record your thoughts and experiences"
                  : "Try adjusting your filters to find entries"}
              </p>
              <Button onClick={() => setIsAddingEntry(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{entry.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(parseISO(entry.date), "MMMM d, yyyy")}
                          <span className="mx-2">•</span>
                          <span>{getMoodEmoji(entry.mood)}</span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditEntry(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line">{entry.content}</div>
                  </CardContent>
                  {entry.tags.length > 0 && (
                    <CardFooter>
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => setSelectedTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

