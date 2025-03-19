export type Book = {
  id: string
  title: string
  author: string
  type: "physical" | "ebook" | "audiobook" | "pdf" | "link"
  category: string
  status: "to-read" | "reading" | "completed" | "reference"
  rating?: number
  notes?: string
  link?: string
  coverImage?: string
  dateAdded: Date
}

