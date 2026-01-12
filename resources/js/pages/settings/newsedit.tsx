import React from 'react'
import { Head, useForm, router, usePage } from '@inertiajs/react'
import { type SharedData } from '@/types'

interface Category {
  id: number
  name: string
}

interface Article {
  id: number
  title: string
  content: string
  category_id: number

  // ⬇️ PAKAI FIELD YANG SUDAH TERBUKTI BISA
  thumbnail_image?: string | null
}

interface Props {
  article: Article
  categories: Category[]
}

export default function NewsEdit({ article, categories }: Props) {
  // ===== IMAGE PREVIEW STATE =====
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    article.thumbnail_image ?? null
  )
  const { auth} = usePage<SharedData>().props

  const { data, setData, post, processing, errors } = useForm({
    title: article.title,
    category_id: article.category_id,
    content: article.content,
    image: null as File | null,
    _method: 'put',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route('news.update', article.id), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        alert('News updated successfully!')
        router.get(route('newsdraft'))
      },
    })
  }

  return (
    <>
      <Head title="Edit News" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="w-full border-gray-700 top-0 z-50">
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
        </header>

        {/* ===== BODY ===== */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
          <h1 className="text-2xl font-bold mb-6">Edit News Draft</h1>

          <form onSubmit={submit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block font-medium mb-1">Judul</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-1">Kategori</label>
              <select
                value={data.category_id}
                onChange={(e) =>
                  setData('category_id', Number(e.target.value))
                }
                className="w-full border rounded px-3 py-2"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block font-medium mb-1">Content</label>
              <textarea
                rows={10}
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* ===== IMAGE PREVIEW + UPLOAD ===== */}
            <div>
              <label className="block font-medium mb-2">Image</label>

              {/* Preview image */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-48 mb-3 rounded-md border object-cover"
                />
              )}

              {/* Hidden input */}
              <input
                id="image-edit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setData('image', file)

                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setImagePreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />

              {/* Custom button */}
              <label
                htmlFor="image-edit"
                className="inline-block cursor-pointer bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Change Image
              </label>

              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.get(route('newsdraft'))}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {processing ? 'Saving...' : 'OK'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
