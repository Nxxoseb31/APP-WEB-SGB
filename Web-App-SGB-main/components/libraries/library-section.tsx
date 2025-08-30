"use client"

import { LibraryForm } from "./library-form"
import { LibraryList } from "./library-list"

export function LibrarySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <LibraryForm />
      <LibraryList />
    </div>
  )
}
