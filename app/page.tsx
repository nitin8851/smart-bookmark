"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) fetchBookmarks(data.user.id)
    }

    init()
  }, [])

  const fetchBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setBookmarks([])
  }

  const addBookmark = async () => {
    if (!title || !url) return alert("Fill both fields")

    const { data } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()
      .single()

    setBookmarks((prev) => [data, ...prev])
    setTitle("")
    setUrl("")
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-zinc-900 p-10 rounded-xl shadow-xl w-[350px] text-center border border-zinc-800">
          <h1 className="text-2xl font-bold mb-6 text-white">Smart Bookmark</h1>

          <button
            onClick={login}
            className="w-full bg-white text-black py-3 rounded hover:bg-gray-200"
          >
            Login with Google
          </button>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-xl mx-auto bg-zinc-900 rounded-xl shadow-xl p-6 border border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold">Welcome</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <input
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-black border border-zinc-700 rounded p-2 w-full text-white"
          />

          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-black border border-zinc-700 rounded p-2 w-full text-white"
          />

          <button
            onClick={addBookmark}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Bookmark
          </button>
        </div>

        <div className="space-y-3 mt-6">
          {bookmarks.length === 0 && (
            <p className="text-center text-gray-500">No bookmarks yet</p>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center border border-zinc-700 rounded p-3 bg-black"
            >
              <a
                href={b.url}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                {b.title}
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
