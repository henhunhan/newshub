import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import React, { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Search, ChevronsUpDown } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import { router } from '@inertiajs/react';

type Article = {
    id: number;
    title: string;
    desc: string;
    thumbnail_image: string;
    author_name: string;
    slug: string
};

type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

type CategoriesPageProps = SharedData & {
  categories: Category[];
  category?: Category;
  articles?: Article[];
  popularNews?: Article[];
  relatedNews?: Article[];
};

export default function Categories() {
    const { categories, category, articles, popularNews = [], relatedNews = []} = usePage<CategoriesPageProps>().props;
    const { auth } = usePage<SharedData>().props;

    const [search, setSearch] = useState('');
    const [isSearched, setIsSearched] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const searchParam = params.get('search');
        if (searchParam && searchParam.trim() !== '') {
            setIsSearched(true);
            setSearch(searchParam);
        } else {
            setIsSearched(false);
            setSearch('');
        }
    }, [window.location.search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('categories.show', { slug: category?.slug }), { search });
        // Tidak perlu setIsSearched(true), biarkan useEffect yang handle
    };

    // Filter articles jika sedang search
    const filteredArticles = isSearched && articles
        ? articles.filter(article =>
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.desc.toLowerCase().includes(search.toLowerCase())
        )
        : articles;

    return (
        <>
            <Head title={category ? category.name : 'Categories'} />
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-8">
                        <Link href={route('home')} className="text-2xl font-bold text-blue-600">
                            NewsHub
                        </Link>
                        <nav className="flex gap-6 text-base font-medium text-gray-700">
                            {categories?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={route('categories.show', { slug: cat.slug })}
                                    className={`hover:text-blue-600 ${category && category.slug === cat.slug ? 'text-blue-600 font-semibold' : ''}`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-8">
                        <form
                            className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm gap-2"
                            onSubmit={handleSearch}
                        >
                            <input
                                type="text"
                                placeholder="Search news..."
                                className="w-56 text-md focus:outline-none focus:ring-0"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                name="search"
                            />
                            <button type="submit">
                                <Search className="text-gray-500 cursor-pointer w-5 h-5" />
                            </button>
                        </form>
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className='flex flex-row items-center gap-3 rounded-sm py-1 bg-gray-50'>
                                    <UserInfo user={auth.user}/>
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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href={route('login')}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold hover:bg-blue-700 transition"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gray-50">
                <main className="flex-1 max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 w-full">
                    {/* Main Section */}
                    <section className="flex-1">
                        {category ? (
                            articles && articles.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-4 mb-2 mt-2">
                                        <h1 className="text-2xl font-bold">{category.name}</h1>
                                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{articles.length} articles</span>
                                    </div>
                                    <p className="text-gray-500 mb-6">{category.description}</p>
                                    {isSearched && (
                                        <h2 className="text-xl font-bold mb-4">Hasil Pencarian</h2>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {filteredArticles && filteredArticles.length > 0 ? (
                                            filteredArticles.map((article) => (
                                                <Link
                                                    key={article.id}
                                                    href={route('newspage', { slug: article.slug })}
                                                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition block"
                                                >
                                                    <img src={article.thumbnail_image} alt={article.title} className="w-full h-48 object-cover rounded mb-4" />
                                                    <h2 className="text-lg font-semibold">{article.title}</h2>
                                                    <p className="text-gray-500 text-sm line-clamp-2">{article.desc}</p>
                                                    <p className="text-xs text-gray-400 mt-2">By {article.author_name}</p>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center text-gray-400 py-16">
                                                {isSearched
                                                    ? 'Berita tidak ada.'
                                                    : 'Berita tidak ada pada kategori tersebut.'}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400 py-16">
                                    Berita tidak ada pada kategori tersebut.
                                </div>
                            )
                        ) : (
                            <div className="text-center text-gray-400 py-16">
                                Berita tidak ada pada kategori tersebut.
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside className="w-full md:w-80 flex flex-col gap-8">
                        {/* Popular News */}
                        <section className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-lg mb-4">Popular News</h3>
                            <div className="flex flex-col gap-4">
                                {popularNews.length > 0 ? popularNews.map((news) => (
                                    <Link
                                        key={news.id}
                                        href={route('newspage', { slug: news.slug })}
                                        className="flex gap-3 hover:bg-gray-100 rounded p-2 transition"
                                    >
                                        <img src={news.thumbnail_image} alt={news.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-sm">{news.title}</div>
                                            <div className="text-gray-400 text-xs">{news.desc}</div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="text-gray-400 text-sm">Tidak ada berita populer.</div>
                                )}
                            </div>
                        </section>
                        {/* Related News */}
                        <section className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-lg mb-4">Related News</h3>
                            <div className="flex flex-col gap-4">
                                {relatedNews.length > 0 ? relatedNews.map((news) => (
                                    <Link
                                        key={news.id}
                                        href={route('newspage', { slug: news.slug })}
                                        className="flex gap-3 hover:bg-gray-100 rounded p-2 transition"
                                    >
                                        <img src={news.thumbnail_image} alt={news.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-sm">{news.title}</div>
                                            <div className="text-gray-400 text-xs">{news.desc}</div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="text-gray-400 text-sm">Tidak ada berita terkait.</div>
                                )}
                            </div>
                        </section>
                    </aside>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-10 mt-auto">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
                        <div>
                            <span className="text-2xl font-bold text-blue-400">NewsHub</span>
                            <p className="mt-2 text-gray-400 text-sm max-w-xs">
                                © 2024 NewsHub. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}