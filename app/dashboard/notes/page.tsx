"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Edit, FileText, Plus, Search, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for notes
const initialNotes = [
  {
    id: "1",
    title: "React Hooks Overview",
    content: "useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef...",
    category: "Programming",
    createdAt: "2023-03-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Spanish Verb Conjugations",
    content: "Present tense: hablo, hablas, habla, hablamos, habláis, hablan...",
    category: "Language",
    createdAt: "2023-03-14T14:20:00Z",
  },
  {
    id: "3",
    title: "Guitar Chord Progressions",
    content: "Common progressions: I-IV-V, ii-V-I, I-V-vi-IV...",
    category: "Music",
    createdAt: "2023-03-10T09:15:00Z",
  },
]

export default function NotesPage() {
  const { toast } = useToast()
  const [notes, setNotes] = useState(initialNotes)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [editNoteOpen, setEditNoteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // New note form state
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteCategory, setNewNoteCategory] = useState("")

  // Edit note form state
  const [editingNote, setEditingNote] = useState<any>(null)

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(notes.map((note) => note.category)))

  const handleAddNote = () => {
    if (!newNoteTitle.trim()) {
      toast({
        title: "Error",
        description: "Note title is required",
        variant: "destructive",
      })
      return
    }

    const newNote = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      category: newNoteCategory || "Uncategorized",
      createdAt: new Date().toISOString(),
    }

    setNotes([newNote, ...notes])
    setNewNoteTitle("")
    setNewNoteContent("")
    setNewNoteCategory("")
    setNewNoteOpen(false)

    toast({
      title: "Note added",
      description: "Your note has been saved",
    })
  }

  const handleEditNote = () => {
    if (!editingNote || !editingNote.title.trim()) {
      toast({
        title: "Error",
        description: "Note title is required",
        variant: "destructive",
      })
      return
    }

    setNotes(notes.map((note) => (note.id === editingNote.id ? editingNote : note)))
    setEditingNote(null)
    setEditNoteOpen(false)

    toast({
      title: "Note updated",
      description: "Your changes have been saved",
    })
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))

    toast({
      title: "Note deleted",
      description: "The note has been removed",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Organize your learning resources and notes</p>
        </div>
        <Dialog open={newNoteOpen} onOpenChange={setNewNoteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
              <DialogDescription>Create a new note or learning resource</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value)}
                  placeholder="e.g., Programming, Language, Music"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={8}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your note here..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="category-filter" className="whitespace-nowrap">
            Filter by:
          </Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter" className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No notes found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== "all"
                ? "Try changing your search or filter"
                : "Get started by creating your first note"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                    <CardDescription>{note.category}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingNote(note)
                        setEditNoteOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-4 text-sm text-muted-foreground">{note.content}</p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Created on {new Date(note.createdAt).toLocaleDateString()}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editNoteOpen} onOpenChange={setEditNoteOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Make changes to your note</DialogDescription>
          </DialogHeader>
          {editingNote && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={editingNote.category}
                  onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  rows={8}
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

