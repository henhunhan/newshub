import React from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { ChevronsUpDown } from 'lucide-react'
import { UserInfo } from '@/components/user-info'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { type SharedData } from '@/types'

interface Category {
  id: number
  name: string
}

interface Article {
  id: number
  title: string
  status: string
  created_at: string
  category?: Category | null
  content?: string

  // ⬇️ PASTIKAN NAMA FIELD SESUAI BACKEND
  thumbnail_image?: string | null
}

interface NewsDraftProps {
  drafts: Article[]
}

export default function NewsDraft({ drafts }: NewsDraftProps) {
  const { auth, url } = usePage<SharedData>().props
  const currentPath = url

  const sidebarNavItems = [
    { title: 'Profile', href: '/settings/profile' },
    { title: 'Password', href: '/settings/password' },
    { title: 'Add News', href: '/settings/addnews' },
    { title: 'News Draft', href: '/settings/newsdraft' },
  ]

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault()
    router.post(route('logout'))
  }

  const handlePublish = (id: number) => {
    if (confirm('Publish berita ini?')) {
      router.post(route('newsdraft.publish', id))
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Hapus draft ini?')) {
      router.delete(route('newsdraft.delete', id))
    }
  }

  return (
    <>
      <Head title="News Draft" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="w-full border-gray-700 top-0 z-50">
          <div className="w-full mx-auto px-6 py-1">
            <div className="flex items-center justify-between mb-6 ml-24">
              <div
                className="flex-1 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => {
                  if (auth.user) {
                    router.get(route('dashboard'))
                  } else {
                    router.get(route('home'))
                  }
                }}
              >
                <h1 className="text-xl font-bold text-black font-serif">NewsHub</h1>
                <p className="text-gray-400 italic text-sm">Your Trusted News Source</p>
              </div>

              <div className="flex items-center gap-4">
                {auth.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center gap-3 rounded-sm py-1">
                      <UserInfo user={auth.user} />
                      <ChevronsUpDown className="ml-auto size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40 rounded-lg shadow">
                      <div className="px-4 py-2 text-sm">
                        <div className="font-semibold">{auth.user.name}</div>
                        <div className="text-gray-500">{auth.user.email}</div>
                      </div>
                      <div className="border-t my-2" />
                      <Link
                        href={route('profile.edit')}
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <form method="POST" action={route('logout')}>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        >
                          Log Out
                        </button>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={route('login')}
                    className="text-black font-semibold text-md py-3 px-2"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ===== BODY ===== */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
          <div className="flex flex-1">
            {/* ===== SIDEBAR ===== */}
            <aside className="w-full max-w-xl lg:w-56">
              <nav className="flex flex-col space-y-1">
                {sidebarNavItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    className={`text-left px-4 py-2 rounded-lg font-medium text-base ${
                      currentPath === item.href
                        ? 'bg-gray-100 text-black'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <div className="flex-1 flex flex-col gap-8">
              <h1 className="text-2xl font-bold mb-6">News Draft</h1>

              {drafts.length === 0 ? (
                <p className="text-gray-500">Tidak ada berita draft.</p>
              ) : (
                <ul className="space-y-4">
                  {drafts.map(news => (
                    <li
                      key={news.id}
                      className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition" 
                    >
                      <div className="flex flex-col gap-4">
                        {/* ===== IMAGE PREVIEW ===== */}
                        {news.thumbnail_image && (
                          <img
                            src={news.thumbnail_image} // ⬅️ ganti jika field berbeda
                            alt={news.title}
                            className="border max-w-[150px] h-auto"
                          />
                        )}

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-lg font-semibold">
                                {news.title}
                              </h2>

                              <p className="text-sm text-gray-500">
                                Kategori: {news.category?.name ?? '-'}
                              </p>

                              <p className="text-sm text-gray-500">
                                {news.content ?? '-'}
                              </p>                              

                            </div>

                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                              Draft
                            </span>
                          </div>

                          <div className="mt-3 flex gap-4">
                            <Link
                              href={route('news.edit', news.id)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handlePublish(news.id)}
                              className="text-green-600 hover:underline text-sm font-medium"
                            >
                              Publish
                            </button>

                            <button
                              onClick={() => handleDelete(news.id)}
                              className="text-red-600 hover:underline text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
