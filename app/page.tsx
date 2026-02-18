"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        fetchBookmarks(data.user.id)
      }
    }

    getUser()
  }, [])

  // Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  // Login with Google
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setBookmarks([])
  }

  // Add Bookmark
  const addBookmark = async () => {
    if (!title || !url) return

    const { data } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()
      .single()

    // instant UI update
    setBookmarks(prev => [data, ...prev])

    setTitle("")
    setUrl("")
  }

  // Delete Bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)

    // instant UI update
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  // If not logged in
  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Smart Bookmark</h1>
        <button onClick={login}>Login with Google</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Logged in as: {user.email}</h2>
      <button onClick={logout}>Logout</button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Add Bookmark</h3>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={addBookmark}>Add</button>

      <hr style={{ margin: "20px 0" }} />

      <h3>Your Bookmarks</h3>

      {bookmarks.map((b) => (
        <div key={b.id} style={{ marginBottom: 10 }}>
          <a href={b.url} target="_blank">
            {b.title}
          </a>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => deleteBookmark(b.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
