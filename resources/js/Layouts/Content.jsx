import React from 'react'

export default function Content({children}) {
  return (
    <main className="absolute top-24 lg:left-96 right-12 lg:bottom-24 md:top-18 md:left-80 left-12">
        {children}
    </main>
  )
}
