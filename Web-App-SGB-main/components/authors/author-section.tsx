"use client"

import { AuthorForm } from "./author-form"
import { AuthorList } from "./author-list"

export function AuthorSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AuthorForm />
      <AuthorList />
    </div>
  )
}
