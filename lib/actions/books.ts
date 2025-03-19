"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function getBooks() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to view books")
  }

  const books = await prisma.book.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      dateAdded: "desc",
    },
  })

  return books
}

export async function createBook(data: {
  title: string
  author: string
  type: string
  category: string
  status: string
  rating?: number
  notes?: string
  link?: string
  coverImage?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a book")
  }

  const book = await prisma.book.create({
    data: {
      userId: session.user.id,
      title: data.title,
      author: data.author,
      type: data.type,
      category: data.category,
      status: data.status,
      rating: data.rating,
      notes: data.notes,
      link: data.link,
      coverImage: data.coverImage,
    },
  })

  revalidatePath("/dashboard/bookshelf")

  return book
}

export async function updateBook(data: {
  id: string
  title: string
  author: string
  type: string
  category: string
  status: string
  rating?: number
  notes?: string
  link?: string
  coverImage?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update a book")
  }

  const book = await prisma.book.findUnique({
    where: {
      id: data.id,
    },
  })

  if (!book || book.userId !== session.user.id) {
    throw new Error("Book not found or you don't have permission")
  }

  const updatedBook = await prisma.book.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      author: data.author,
      type: data.type,
      category: data.category,
      status: data.status,
      rating: data.rating,
      notes: data.notes,
      link: data.link,
      coverImage: data.coverImage,
    },
  })

  revalidatePath("/dashboard/bookshelf")

  return updatedBook
}

export async function deleteBook(bookId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a book")
  }

  const book = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })

  if (!book || book.userId !== session.user.id) {
    throw new Error("Book not found or you don't have permission")
  }

  await prisma.book.delete({
    where: {
      id: bookId,
    },
  })

  revalidatePath("/dashboard/bookshelf")

  return { success: true }
}

