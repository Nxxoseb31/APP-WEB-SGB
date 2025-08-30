"use client"

import { BookForm } from "./book-form"
import { BookList } from "./book-list"

export function BookSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BookForm />
      <BookList />
    </div>
  )
}
