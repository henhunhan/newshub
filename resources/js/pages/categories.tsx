import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import React, { useState, useEffect, useRef } from 'react';
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
    slug: string;
    content: string;
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

    const [showSearchBar, setShowSearchBar] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

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
    }, [window.location.pathname, window.location.search.length]);

    useEffect(() => {
            if (showSearchBar && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, [showSearchBar]);
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== '') {
            router.get(route('dashboard'), { search });
            router.get(route('home'), { search });
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
            e.preventDefault();
            router.post(route('logout'));
    };

    // Filter articles jika sedang search
    const filteredArticles = isSearched && articles
        ? articles.filter(article =>
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.desc.toLowerCase().includes(search.toLowerCase())
        )
        : articles;

    const handleSearchIconClick = () => {
    setShowSearchBar((prev) => !prev);
    };

    return (
        <>
            <Head title={category ? category.name : 'Categories'} />
            {/* Header */}
            <header className="w-full border-gray-700 top-0 z-50">
                <div className="w-full mx-auto px-6 py-1">
                    {/* Top Section */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Search & Bell */}
                        <div className="flex items-center gap-4" style={{ minWidth: '120px' }}>
                            <button
                                type="button"
                                onClick={handleSearchIconClick}
                                className="text-gray-400 cursor-pointer w-5 h-5 flex items-center justify-center focus:outline-none"
                                aria-label="Show search bar"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            {showSearchBar && (
                                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in absolute left-0 mt-10 bg-white z-10 p-2 rounded shadow" style={{ minWidth: '220px' }}>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Cari berita..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        name="search"
                                    />
                                    <button type="submit" className="p-1 text-gray-400 hover:text-blue-500">
                                        Go
                                    </button>
                                </form>
                            )}
                            <i className="fas fa-bell text-gray-400 w-5 h-5"></i>
                        </div>

                        {/* NewsHub & Tagline - tetap di tengah */}
                        <div className="flex-1 flex flex-col items-center justify-center cursor-pointer" onClick={() => {
                            if (auth.user) {
                                router.get(route('dashboard'));
                            } else {
                                router.get(route('home'));
                            }
                        }}>
                            <h1 className="text-xl font-bold text-black font-serif">NewsHub</h1>
                            <p className="text-gray-400 italic text-sm">Your Trusted News Source</p>
                        </div>

                        {/* User menu */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='flex flex-row items-center gap-3 rounded-sm py-1'>
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

                    {/* Logo & Tagline */}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen ">
                <main className="flex-1 max-w-8xl mx-auto pl-16 pr-8 w-full flex flex-col md:flex-row gap-16">
                    {/* Main Section */}
                    <section className="flex-1">
                        {category ? (
                            articles && articles.length > 0 ? (
                                <>
                                    <div className="flex justify-items-start gap-4 mb-2 mt-2 flex-col">
                                        <div className='flex flex-row gap-4 items-center'>
                                            <h1 className="text-3xl font-bold">{category.name}</h1>
                                            <span className="bg-blue-100 text-blue-600 px-3 py-1 mt-1 rounded-full text-xs font-semibold">{articles.length} articles</span>
                                        </div>

                                    <nav className="flex text-sm font-semibold text-black border-b pb-2 overflow-x-auto border-black">
                                            {categories?.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={route('categories.show', { slug: cat.slug })}
                                                    className="py-1 px-3 hover:bg-gray-200 rounded-lg whitespace-nowrap transition"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                    </nav>

                                    </div>
                                    <p className="text-gray-500 mb-6">{category.description}</p>
                                    {isSearched && (
                                        <h2 className="text-xl font-bold mb-4">Hasil Pencarian</h2>
                                    )}
                                    <div className="">
                                        {filteredArticles && filteredArticles.length > 0 ? (
                                            filteredArticles.map((article) => (
                                            <div className='grid grid-cols-1 md:grid-cols-2 py-8 border-b border-gray-400'>
                                                <Link
                                                    key={article.id}
                                                    href={route('newspage', { slug: article.slug })}
                                                    className=""
                                                >
                                                        <div className="flex flex-col justify-start">
                                                        <h2 className="text-2xl font-bold text-black font-serif mb-4 hover:text-gray-400 transition">
                                                            {article.title}
                                                        </h2>
                                                        <p className="text-black text-base mb-4 leading-relaxed hover:text-gray-400 transition">
                                                            {article.content.slice(0, 150)}...
                                                        </p>
                                                        <p className="text-black text-sm">
                                                            By {article.author_name}
                                                        </p>
                                                    </div>
                                                </Link>

                                                <Link
                                                    href={route('newspage', { slug: article.slug })}
                                                >
                                                    <div className="overflow-hidden w-full">
                                                        <img
                                                            src={article.thumbnail_image}
                                                            alt={article.title}
                                                            className="w-full h-96 object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                                
                                            </div>
                                                
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
                                <div>
                                    <div className="flex justify-items-start gap-4 mb-2 mt-2 flex-col">
                                        <div className='flex flex-row gap-4 items-center'>
                                            <h1 className="text-3xl font-bold">{category.name}</h1>
                                        </div>

                                    <nav className="flex text-sm font-semibold text-black border-b pb-2 overflow-x-auto border-black">
                                            {categories?.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={route('categories.show', { slug: cat.slug })}
                                                    className="py-1 px-3 hover:bg-gray-200 rounded-lg whitespace-nowrap transition"
                                                >
                                                    {cat.name}
                                                </Link>
                                            ))}
                                    </nav>

                                    </div>

                                <div className="text-center text-gray-400 py-16">
                                    Berita tidak ada pada kategori tersebut.
                                </div>

                                </div>

                            )
                        ) : (
                            <div className="text-center text-gray-400 py-16">
                                Berita tidak ada pada kategori tersebut.
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside className="w-full md:w-80 flex flex-col gap-8 py-3">
                        {/* Popular News */}
                        <section className="">
                            <h3 className="font-semibold text-lg mb-4 border-b border-gray-400 ">Popular News</h3>
                            <div className="flex flex-col gap-4">
                                {popularNews.length > 0 ? popularNews.map((news) => (
                                    <Link
                                        key={news.id}
                                        href={route('newspage', { slug: news.slug })}
                                        className="flex gap-3 bg-white rounded shadow-sm p-2 hover:bg-gray-100 transition"
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
                        <section className="">
                            <h3 className="font-semibold text-lg mb-4 border-b border-gray-400">Related News</h3>
                            <div className="flex flex-col gap-4">
                                {relatedNews.length > 0 ? relatedNews.map((news) => (
                                    <Link
                                        key={news.id}
                                        href={route('newspage', { slug: news.slug })}
                                        className="flex gap-3 bg-white rounded shadow-sm p-2 hover:bg-gray-100 transition"
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