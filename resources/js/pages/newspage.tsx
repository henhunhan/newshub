import { Head, Link, usePage } from '@inertiajs/react';
import { Search, ChevronsUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { Auth } from '@/types';
import { Heart } from 'lucide-react';


type NewsType = {
    id: number;
    title: string;
    thumbnail_image: string;
    category: string;
    desc: string;
    author: string;
    created_at?: string;
    content?: string;
    slug: string;
    view_count: number;
    like_count: number;
    is_liked: boolean;
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

type CommentType = {
    id: number;
    content: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
};

type Props = {
    news: NewsType;
    categories: Category[];
    popularNews?: NewsType[];
    relatedNews?: NewsType[];
    comments?: CommentType[];
};



export default function Newspage({ news, popularNews = [], relatedNews = [], comments = [] }: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const [search, setSearch] = useState('');
    const [comment, setComment] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

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
            router.get(route('home'), { search });
        }
    };

    const handleSearchIconClick = () => {
        setShowSearchBar((prev) => !prev);
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        router.post(route('comments', { slug: news.slug }), { content: comment }, {
            onSuccess: () => setComment(''),
        });
    };

        const handleLogout = (e: React.MouseEvent) => {
            e.preventDefault();
            router.post(route('logout'));
        };

    return (
        <>
            <Head title={news.title} />
            <div className="min-h-screen">
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
                <main className="max-w-8xl mx-auto w-full pl-16 pr-8 py-10 flex flex-col lg:flex-row gap-8">
                    {/* Main Article */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{news.category}</span>
                                <span className="text-gray-400 text-xs">
                                    {news.created_at ? new Date(news.created_at).toLocaleDateString() : ''}
                                </span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-400 text-xs">
                                            {news.view_count} views
                                        </span>

                                        <button
                                            onClick={() =>
                                                router.post(route('articles.like', news.id), {}, {
                                                    preserveScroll: true,
                                                })
                                            }
                                            className={`flex items-center gap-1 text-sm transition ${
                                                news.is_liked ? 'text-red-600' : 'text-gray-400'
                                            }`}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${
                                                    news.is_liked ? 'fill-red-600' : ''
                                                }`}
                                            />
                                            <span>{news.like_count}</span>
                                        </button>
                                    </div>

                            </div>
                            <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
                            <div className="flex items-center gap-3 mb-6">
                                <div>
                                    <div className="font-semibold text-sm">{news.author}</div>
                                    <div className="text-gray-400 text-xs">Technology Reporter</div>
                                </div>
                            </div>
                            <img src={news.thumbnail_image} alt={news.title} className="w-full rounded-lg mb-6 max-h-96 object-cover" />
                            <div className="text-gray-700 text-base mb-6 text-justify">
                                {news.content ? news.content : news.desc}
                            </div>
                            {/* Comment Section */}
                            <div className="mt-10">
                                <h3 className="font-semibold text-lg mb-4">Comments ({comments.length})</h3>
                                {auth?.user && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <form className="flex flex-col gap-2" onSubmit={handleComment}>
                                            <textarea
                                                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                                                placeholder="Add a comment..."
                                                rows={2}
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold hover:bg-blue-700 transition"
                                                >
                                                    Post Comment
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div className="flex flex-col gap-6">
                                    {comments.map(c => (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{c.user.name}</span>
                                                    <span className="text-gray-400 text-xs">{new Date(c.created_at).toLocaleString()}</span>
                                                </div>
                                                <div className="text-gray-700 text-justify">{c.content}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {comments.length === 0 && (
                                        <div className="text-gray-400 text-sm">Belum ada komentar.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex flex-col gap-8">
                        {/* Popular News */}
                        <section className="">
                            <h3 className="font-semibold text-lg mb-4 border-b border-gray-400">Popular News</h3>
                            <div className="flex flex-col gap-4">
                                {(popularNews.length > 0 ? popularNews : [news]).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('newspage', { slug: item.slug })}
                                        className="flex gap-3 bg-white rounded shadow-sm p-2 hover:bg-gray-100 transition"
                                    >
                                        <img src={item.thumbnail_image} alt={item.title} className="w-20 h-14 rounded object-cover" />
                                        <div>
                                            <div className="font-medium text-sm">{item.title}</div>
                                            <div className="text-gray-400 text-xs">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                        {/* Related News */}
                        <section className="">
                            <h3 className="font-semibold text-lg mb-4 border-b border-gray-400">Related News</h3>
                            <div className="flex flex-col gap-4">
                                {(relatedNews.length > 0 ? relatedNews : []).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('newspage', { slug: item.slug })}
                                        className="flex gap-3 bg-white rounded shadow-sm p-2 hover:bg-gray-100 transition"
                                    >
                                        <img src={item.thumbnail_image} alt={item.title} className="w-20 h-14 rounded object-cover" />
                                        <div>
                                            <div className="font-medium text-sm">{item.title}</div>
                                            <div className="text-gray-400 text-xs">{item.category} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );

}