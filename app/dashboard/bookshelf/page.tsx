"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Edit, ExternalLink, FileText, Link2, Plus, Search, Star, Trash } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Book as BookType } from "@/types/book"

// Mock data for books
const initialBooks: BookType[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    type: "physical",
    category: "Self-Improvement",
    status: "completed",
    rating: 5,
    notes: "Great book on building habits. Key takeaway: focus on small improvements.",
    coverImage: "/placeholder.svg?height=200&width=150",
    dateAdded: new Date(2023, 0, 15),
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    type: "ebook",
    category: "Productivity",
    status: "reading",
    notes: "Currently on chapter 4. Interesting concepts about focused work.",
    coverImage: "/placeholder.svg?height=200&width=150",
    dateAdded: new Date(2023, 1, 10),
  },
  {
    id: "3",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    type: "audiobook",
    category: "Finance",
    status: "to-read",
    coverImage: "/placeholder.svg?height=200&width=150",
    dateAdded: new Date(2023, 2, 5),
  },
  {
    id: "4",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    type: "physical",
    category: "Computer Science",
    status: "reference",
    notes: "Classic reference book for algorithms.",
    coverImage: "/placeholder.svg?height=200&width=150",
    dateAdded: new Date(2022, 11, 20),
  },
  {
    id: "5",
    title: "How to Take Smart Notes",
    author: "Sönke Ahrens",
    type: "pdf",
    category: "Productivity",
    status: "completed",
    rating: 4,
    link: "https://example.com/smart-notes.pdf",
    coverImage: "/placeholder.svg?height=200&width=150",
    dateAdded: new Date(2023, 3, 12),
  },
]

// Book categories
const bookCategories = [
  "Self-Improvement",
  "Productivity",
  "Finance",
  "Computer Science",
  "Business",
  "Psychology",
  "Philosophy",
  "Fiction",
  "Science",
  "History",
  "Other",
]

export default function BookshelfPage() {
  const { toast } = useToast()
  const [books, setBooks] = useState<BookType[]>(initialBooks)
  const [newBookOpen, setNewBookOpen] = useState(false)
  const [editBookOpen, setEditBookOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // New book form state
  const [newBookTitle, setNewBookTitle] = useState("")
  const [newBookAuthor, setNewBookAuthor] = useState("")
  const [newBookType, setNewBookType] = useState<"physical" | "ebook" | "audiobook" | "pdf" | "link">("physical")
  const [newBookCategory, setNewBookCategory] = useState("Self-Improvement")
  const [newBookStatus, setNewBookStatus] = useState<"to-read" | "reading" | "completed" | "reference">("to-read")
  const [newBookRating, setNewBookRating] = useState<number | undefined>(undefined)
  const [newBookNotes, setNewBookNotes] = useState("")
  const [newBookLink, setNewBookLink] = useState("")
  const [newBookCoverImage, setNewBookCoverImage] = useState("")

  // Edit book form state
  const [editingBook, setEditingBook] = useState<BookType | null>(null)

  // Filter books based on active tab, category, and search query
  const filteredBooks = books.filter((book) => {
    // Filter by tab
    if (activeTab !== "all" && book.status !== activeTab) return false

    // Filter by category
    if (categoryFilter !== "all" && book.category !== categoryFilter) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        (book.notes && book.notes.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Get unique categories from books
  const categories = Array.from(new Set(books.map((book) => book.category)))

  // Function to add book
  const handleAddBook = () => {
    if (!newBookTitle.trim() || !newBookAuthor.trim()) {
      toast({
        title: "Error",
        description: "Book title and author are required",
        variant: "destructive",
      })
      return
    }

    const newBook: BookType = {
      id: Date.now().toString(),
      title: newBookTitle,
      author: newBookAuthor,
      type: newBookType,
      category: newBookCategory,
      status: newBookStatus,
      rating: newBookRating,
      notes: newBookNotes || undefined,
      link: newBookLink || undefined,
      coverImage: newBookCoverImage || "/placeholder.svg?height=200&width=150",
      dateAdded: new Date(),
    }

    setBooks([...books, newBook])
    resetNewBookForm()
    setNewBookOpen(false)

    toast({
      title: "Book added",
      description: `"${newBookTitle}" has been added to your bookshelf`,
    })
  }

  // Function to update book
  const handleUpdateBook = () => {
    if (!editingBook || !editingBook.title.trim() || !editingBook.author.trim()) {
      toast({
        title: "Error",
        description: "Book title and author are required",
        variant: "destructive",
      })
      return
    }

    setBooks(books.map((book) => (book.id === editingBook.id ? editingBook : book)))
    setEditingBook(null)
    setEditBookOpen(false)

    toast({
      title: "Book updated",
      description: "Your changes have been saved",
    })
  }

  // Function to delete book
  const handleDeleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id))

    toast({
      title: "Book deleted",
      description: "The book has been removed from your bookshelf",
    })
  }

  // Reset new book form
  const resetNewBookForm = () => {
    setNewBookTitle("")
    setNewBookAuthor("")
    setNewBookType("physical")
    setNewBookCategory("Self-Improvement")
    setNewBookStatus("to-read")
    setNewBookRating(undefined)
    setNewBookNotes("")
    setNewBookLink("")
    setNewBookCoverImage("")
  }

  // Render book type icon
  const renderBookTypeIcon = (type: string) => {
    switch (type) {
      case "physical":
        return <FileText className="h-4 w-4" />
      case "ebook":
        return <BookOpen className="h-4 w-4" />
      case "audiobook":
        return <FileText className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "link":
        return <Link2 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Render book status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "to-read":
        return <Badge variant="outline">To Read</Badge>
      case "reading":
        return <Badge variant="secondary">Reading</Badge>
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "reference":
        return <Badge variant="outline">Reference</Badge>
      default:
        return null
    }
  }

  // Render star rating
  const renderStarRating = (rating?: number) => {
    if (!rating) return null

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookshelf</h1>
          <p className="text-muted-foreground">Manage your books, PDFs, and reading resources</p>
        </div>
        <Dialog open={newBookOpen} onOpenChange={setNewBookOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Add a book, e-book, PDF, or link to your bookshelf</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    placeholder="Book title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newBookType} onValueChange={(value) => setNewBookType(value as any)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical Book</SelectItem>
                      <SelectItem value="ebook">E-Book</SelectItem>
                      <SelectItem value="audiobook">Audiobook</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="link">Link/Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newBookCategory} onValueChange={setNewBookCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newBookStatus} onValueChange={(value) => setNewBookStatus(value as any)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-read">To Read</SelectItem>
                      <SelectItem value="reading">Currently Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="reference">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating (if completed)</Label>
                  <Select
                    value={newBookRating?.toString() || ""}
                    onValueChange={(value) => setNewBookRating(value ? Number.parseInt(value) : undefined)}
                  >
                    <SelectTrigger id="rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Rating</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(newBookType === "pdf" || newBookType === "link" || newBookType === "ebook") && (
                <div className="grid gap-2">
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    value={newBookLink}
                    onChange={(e) => setNewBookLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="cover">Cover Image URL (Optional)</Label>
                <Input
                  id="cover"
                  value={newBookCoverImage}
                  onChange={(e) => setNewBookCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newBookNotes}
                  onChange={(e) => setNewBookNotes(e.target.value)}
                  placeholder="Your thoughts, key takeaways, etc."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBook}>Add to Bookshelf</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
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

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Books</TabsTrigger>
          <TabsTrigger value="to-read">To Read</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={book.coverImage || "/placeholder.svg?height=200&width=150"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">{renderStatusBadge(book.status)}</div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingBook(book)
                          setEditBookOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderBookTypeIcon(book.type)}
                      <span className="text-xs text-muted-foreground capitalize">{book.type}</span>
                    </div>
                    {renderStarRating(book.rating)}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  {book.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(book.link, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Open
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="to-read" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={book.coverImage || "/placeholder.svg?height=200&width=150"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderBookTypeIcon(book.type)}
                      <span className="text-xs text-muted-foreground capitalize">{book.type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setBooks(books.map((b) => (b.id === book.id ? { ...b, status: "reading" } : b)))
                      toast({
                        title: "Status updated",
                        description: `"${book.title}" moved to Currently Reading`,
                      })
                    }}
                  >
                    Start Reading
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reading" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={book.coverImage || "/placeholder.svg?height=200&width=150"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderBookTypeIcon(book.type)}
                      <span className="text-xs text-muted-foreground capitalize">{book.type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setEditingBook({
                        ...book,
                        status: "completed",
                      })
                      setEditBookOpen(true)
                    }}
                  >
                    Mark as Completed
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={book.coverImage || "/placeholder.svg?height=200&width=150"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                    {renderStarRating(book.rating)}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  {book.notes && <p className="text-sm text-muted-foreground line-clamp-3">{book.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reference" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={book.coverImage || "/placeholder.svg?height=200&width=150"}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <div className="flex items-center space-x-1">
                    {renderBookTypeIcon(book.type)}
                    <span className="text-xs text-muted-foreground capitalize">{book.type}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  {book.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(book.link, "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Open
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={editBookOpen} onOpenChange={setEditBookOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Make changes to your book</DialogDescription>
          </DialogHeader>
          {editingBook && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingBook.title}
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-author">Author</Label>
                  <Input
                    id="edit-author"
                    value={editingBook.author}
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editingBook.type}
                    onValueChange={(value) => setEditingBook({ ...editingBook, type: value as any })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical Book</SelectItem>
                      <SelectItem value="ebook">E-Book</SelectItem>
                      <SelectItem value="audiobook">Audiobook</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="link">Link/Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingBook.category}
                    onValueChange={(value) => setEditingBook({ ...editingBook, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingBook.status}
                    onValueChange={(value) => setEditingBook({ ...editingBook, status: value as any })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-read">To Read</SelectItem>
                      <SelectItem value="reading">Currently Reading</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="reference">Reference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rating">Rating</Label>
                  <Select
                    value={editingBook.rating?.toString() || ""}
                    onValueChange={(value) =>
                      setEditingBook({
                        ...editingBook,
                        rating: value ? Number.parseInt(value) : undefined,
                      })
                    }
                  >
                    <SelectTrigger id="edit-rating">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Rating</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(editingBook.type === "pdf" || editingBook.type === "link" || editingBook.type === "ebook") && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-link">Link URL</Label>
                  <Input
                    id="edit-link"
                    value={editingBook.link || ""}
                    onChange={(e) => setEditingBook({ ...editingBook, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="edit-cover">Cover Image URL</Label>
                <Input
                  id="edit-cover"
                  value={editingBook.coverImage || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingBook.notes || ""}
                  onChange={(e) => setEditingBook({ ...editingBook, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateBook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

