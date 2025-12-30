import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronsUpDown } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';

type News = {
    id: number;
    title: string;
    thumbnail_image: string;
    category: string;
    content: string;
    author_name: string;
    slug: string;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

type PageProps = {
    categories: Category[];
    news: News[]; // news dari backend, sudah urut sesuai kebutuhan
    auth: SharedData['auth'];
};

export default function Dashboard() {
    const { categories, news, auth } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [isSearched, setIsSearched] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Tambahkan useEffect ini
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname, window.location.search.length]);

    // Fokus ke input saat search bar muncul
    useEffect(() => {
        if (showSearchBar && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearchBar]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== '') {
            router.get(route('dashboard'), { search });
        }
    };

    const handleSearchIconClick = () => {
        setShowSearchBar((prev) => !prev);
    };

    // Featured News: 3 berita pertama
    const News = news.slice(0, 3);
    // Latest News: sisanya
    const latestNews = news.slice(3);
    const featureNews = news.slice(0, 3);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="NewsHub" />
            {/* Header */}
            <header className="w-full border-gray-700 top-0 z-50">
                <div className="w-full mx-auto px-6 py-1">
                    {/* Top Section */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleSearchIconClick}
                                className="text-gray-400 cursor-pointer w-5 h-5 flex items-center justify-center focus:outline-none"
                                aria-label="Show search bar"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            {showSearchBar && (
                                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
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
                                    className="text-black font-semibold"
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Logo & Tagline */}
                        <div className="flex-1 flex flex-col items-center justify-center cursor-pointer py-3 gap-2" onClick={() => {
                            if (auth.user) {
                                router.get(route('dashboard'));
                            } else {
                                router.get(route('home'));
                            }
                        }}>
                            <h1 className="text-5xl font-bold text-black font-serif">NewsHub</h1>
                            <p className="text-gray-400 italic text-lg">Your Trusted News Source</p>
                        </div>

                    {/* Navigation */}
                    <nav className="flex gap-10 text-sm font-semibold text-black border-b pb-2 overflow-x-auto justify-center max-w-7xl mx-auto border-black">
                        {categories?.map((cat) => (
                            <Link
                                key={cat.id}
                                href={route('categories.show', { slug: cat.slug })}
                                className="py-1 px-2 hover:bg-gray-200 rounded-lg whitespace-nowrap transition"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content & Footer Wrapper */}
            <div className="flex flex-col min-h-screen ">
                <main className="flex-1 max-w-8xl mx-auto px-8 w-full">
                    {/* Search Result */}
                    {isSearched ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4 py-6 pl-12">Hasil Pencarian</h2>
                            <div className="gap-6 mb-12">
                                {news.length > 0 ? news.map((item) => (
                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 py-8 border-b border-gray-200">
                                            <div>
                                                <Link
                                                    href={route('newspage', { slug: item.slug })}
                                                    className="block group ml-10"
                                                >
                                                    <div className="flex flex-col justify-start">
                                                        <h2 className="text-2xl font-bold text-black font-serif mb-4 hover:text-gray-400 transition">
                                                            {item.title}
                                                        </h2>
                                                        <p className="text-black text-base mb-4 leading-relaxed hover:text-gray-400 transition">
                                                            {item.content.slice(0, 150)}...
                                                        </p>
                                                        <p className="text-black text-sm">
                                                            By {item.author_name}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('newspage', { slug: item.slug })}
                                                >
                                                    <div className="overflow-hidden w-full">
                                                        <img
                                                            src={item.thumbnail_image}
                                                            alt={item.title}
                                                            className="w-full h-96 object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                )) : (
                                    <div className="col-span-full text-center text-gray-400 py-16">
                                        Tidak ada berita ditemukan.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Hero Section & Featured News Side by Side */}
                            <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Hero Section (2/3) */}
                                <div className="md:col-span-2 rounded-lg overflow-hidden">
                                    {News.length > 0 ? News.map((item) => (
                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 py-8 border-b border-gray-200">
                                            <div>
                                                <Link
                                                    href={route('newspage', { slug: item.slug })}
                                                    className="block group ml-10"
                                                >
                                                    <div className="flex flex-col justify-start">
                                                        <h2 className="text-2xl font-bold text-black font-serif mb-4 hover:text-gray-400 transition">
                                                            {item.title}
                                                        </h2>
                                                        <p className="text-black text-base mb-4 leading-relaxed hover:text-gray-400 transition">
                                                            {item.content.slice(0, 150)}...
                                                        </p>
                                                        <p className="text-black text-sm">
                                                            By {item.author_name}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('newspage', { slug: item.slug })}
                                                >
                                                    <div className="overflow-hidden w-full">
                                                        <img
                                                            src={item.thumbnail_image}
                                                            alt={item.title}
                                                            className="w-full h-96 object-cover"
                                                        />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full text-center text-gray-400 py-16">
                                            Tidak ada berita ditampilkan.
                                        </div>
                                    )}
                                </div>
                                {/* Featured News (1/3) */}
                                <aside className="md:col-span-1">
                                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Featured News</h2>
                                    <div className="grid grid-cols-1 gap-6">
                                        {featureNews.length > 0 ? featureNews.map((news) => (
                                            <Link
                                                key={news.id}
                                                href={route('newspage', { slug: news.slug })}
                                                className="bg-white rounded-lg shadow overflow-hidden flex flex-col hover:shadow-lg transition group"
                                            >
                                                <div className="overflow-hidden rounded-t-lg h-32">
                                                    <img
                                                        src={news.thumbnail_image}
                                                        alt={news.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />
                                                </div>
                                                <div className="p-4 flex flex-col flex-1">
                                                    <span className={`inline-block ${news.category === 'Sports' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-700'} text-xs font-semibold px-3 py-1 rounded mb-2 w-fit`}>
                                                        {news.category}
                                                    </span>
                                                    <h3 className="text-base font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                                        {news.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">
                                                        {news.content.slice(0, 80)}...
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        By {news.author_name}
                                                    </p>
                                                </div>
                                            </Link>
                                        )) : (
                                            <div className="col-span-full text-center text-gray-400 py-8">
                                                Tidak ada berita unggulan.
                                            </div>
                                        )}
                                    </div>
                                </aside>
                            </section>

                            {/* Latest News Grid */}
                            <section className="mt-12">
                                <h2 className="text-2xl font-bold mb-6 border-b pb-4">Latest News</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {latestNews.length > 0 ? latestNews.map((news) => (
                                        <Link
                                            key={news.id}
                                            href={route('newspage', { slug: news.slug })}
                                            className="bg-white rounded-lg shadow overflow-hidden flex flex-col hover:shadow-lg transition group"
                                        >
                                            <div className="overflow-hidden rounded-t-lg h-40">
                                                <img
                                                    src={news.thumbnail_image}
                                                    alt={news.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            </div>
                                            <div className="p-4 flex flex-col flex-1">
                                                <span className={`inline-block ${news.category === 'Sports' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-700'} text-xs font-semibold px-3 py-1 rounded mb-2 w-fit`}>
                                                    {news.category}
                                                </span>
                                                <h3 className="text-base font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                                    {news.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">
                                                    {/* {news.desc} */}
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    By {news.author_name}
                                                </p>
                                            </div>
                                        </Link>
                                    )) : (
                                        <div className="col-span-full text-center text-gray-400 py-16">
                                            Tidak ada berita terbaru.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-10 mt-auto">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
                        <div>
                            <span className="text-2xl font-bold text-blue-400">NewsHub</span>
                            <p className="mt-2 text-gray-400 text-sm max-w-xs">
                                Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of global events.
                            </p>
                            <div className="flex gap-3 mt-4">
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Categories</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                {categories.map((cat) => (
                                    <li key={cat.id}>{cat.name}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Quick Links</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-400">Newsletter</a></li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
