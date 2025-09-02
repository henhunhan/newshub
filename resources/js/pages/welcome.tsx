import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
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
    desc: string;
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
};

export default function Welcome() {
    const { categories, news } = usePage<PageProps>().props;
    const { auth } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');
    const [isSearched, setIsSearched] = useState(false);

    // Tambahkan ini untuk membaca query search dari URL
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
        router.get(route('home'), { search }, { preserveState: true });
    };

    // Latest News
    const latestNews = news.slice(0, 3);
    // Featured News
    const featuredNews = news.slice(3);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="NewsHub" />
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-8">
                        <a href="/" className="text-2xl font-bold text-blue-600">NewsHub</a>
                        <nav className="flex gap-6 text-base font-medium text-gray-700">
                            {categories?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={route('categories.show', { slug: cat.slug })}
                                    className="hover:text-blue-600"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-8">
                        <form
                            className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 gap-4"
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
                                className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold hover:bg-blue-700 transition"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content & Footer Wrapper */}
            <div className="flex flex-col min-h-screen bg-gray-50">
                <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
                    {/* Search Result */}
                    {isSearched ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Hasil Pencarian</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {news.length > 0 ? news.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('newspage', { slug: item.slug })}
                                        className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
                                    >
                                        <img
                                            src={item.thumbnail_image}
                                            alt={item.title}
                                            className="rounded-lg mb-4 w-full h-auto max-h-60 object-cover object-center mx-auto transition-all duration-300"
                                        />
                                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded mb-2 w-fit">{item.category}</span>
                                        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {item.desc}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500 gap-2">
                                            <span>by {item.author_name}</span>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="col-span-full text-center text-gray-400 py-16">
                                        Tidak ada berita ditemukan.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Featured News */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4">Featured News</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredNews.length > 0 ? featuredNews.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route('newspage', { slug: item.slug })}
                                            className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
                                        >
                                            <img
                                                src={item.thumbnail_image}
                                                alt={item.title}
                                                className="rounded-lg mb-4 w-full h-auto max-h-60 object-cover object-center mx-auto transition-all duration-300"
                                            />
                                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded mb-2 w-fit">{item.category}</span>
                                            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {item.desc}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500 gap-2">
                                                <span>by {item.author_name}</span>
                                            </div>
                                        </Link>
                                    )) : (
                                        <div className="col-span-full text-center text-gray-400 py-16">
                                            Tidak ada berita ditampilkan.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Latest News */}
                            <section className="mt-12">
                                <h2 className="text-xl font-bold mb-4">Latest News</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {latestNews.length > 0 ? latestNews.map((news) => (
                                        <Link
                                            key={news.id}
                                            href={route('newspage', { slug: news.slug })}
                                            className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
                                        >
                                            <img
                                                src={news.thumbnail_image}
                                                alt={news.title}
                                                className="rounded-lg mb-4 w-full h-auto max-h-40 object-cover object-center mx-auto transition-all duration-300"
                                            />
                                            <span className={`inline-block ${news.category === 'Sports' ? 'bg-pink-100 text-pink-600' : news.category === 'Politics' ? 'bg-blue-100 text-blue-700' : news.category === 'Technology' ? 'bg-blue-100 text-blue-700' : news.category === 'Business' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-600'} text-xs font-semibold px-3 py-1 rounded mb-2 w-fit`}>
                                                {news.category}
                                            </span>
                                            <h3 className="text-base font-bold mb-1">{news.title}</h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {news.desc}
                                            </p>
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
            </div>        </>
    );
}
