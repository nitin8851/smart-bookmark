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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow w-[350px] text-center">
          <h1 className="text-2xl font-bold mb-6">Smart Bookmark</h1>

          <button
            onClick={login}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
          >
            Login with Google
          </button>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold">Welcome</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <input
            placeholder="Bookmark title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full"
          />

          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border rounded p-2 w-full"
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
            <p className="text-center text-gray-400">No bookmarks yet</p>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <a
                href={b.url}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {b.title}
              </a>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 hover:text-red-700"
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
