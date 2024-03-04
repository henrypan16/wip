import React from 'react'

export default function Content({children}) {
  return (
    <main className="absolute top-24 left-96 right-12 bottom-24 w-3/4">
        {children}
    </main>
  )
}
