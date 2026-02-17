"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<any[]>([])

  // get logged in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) loadBookmarks(data.user.id)
    })
  }, [])

  // realtime listener
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => loadBookmarks(user.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  const loadBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  // ADD bookmark (no overwrite)
  const addBookmark = async () => {
    if (!title || !url) return alert("Fill both fields")

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    if (error) return alert(error.message)

    setTitle("")
    setUrl("")
  }

  // DELETE bookmark (user protected)
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) alert(error.message)
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button onClick={login} className="bg-black text-white px-6 py-3 rounded">
          Login with Google
        </button>
      </div>
    )
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-xl mb-4">Welcome {user.email}</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <button onClick={addBookmark} className="bg-green-600 text-white px-4 py-2">
        Add Bookmark
      </button>

      <ul className="mt-6">
        {bookmarks.map((b) => (
          <li key={b.id} className="flex justify-between border-b py-2">
            <a href={b.url} target="_blank">{b.title}</a>
            <button onClick={() => deleteBookmark(b.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
