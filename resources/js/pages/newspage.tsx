import { Head, Link, usePage } from '@inertiajs/react';
import { Search, ChevronsUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { Auth } from '@/types';

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



export default function Newspage({ news, categories, popularNews = [], relatedNews = [], comments = [] }: Props) {
    const { auth } = usePage().props as { auth: Auth };
    const [comment, setComment] = useState('');

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        router.post(route('comments', { slug: news.slug }), { content: comment }, {
            onSuccess: () => setComment(''),
        });
    };

    return (
        <>
            <Head title={news.title} />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                        {/* Logo & Navigation */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')}>
                                <span className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700">NewsHub</span>
                            </Link>
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
                        {/* Search & User */}
                        <div className="flex items-center gap-8">
                            <form className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm gap-2">
                                <input
                                    type="text"
                                    placeholder="Search news..."
                                    className="w-56 text-md focus:outline-none focus:ring-0"
                                />
                                <button type="submit">
                                    <Search className="text-gray-500 cursor-pointer w-5 h-5" />
                                </button>
                            </form>
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='flex flex-row items-center gap-3 rounded-sm py-1 bg-gray-50 px-2'>
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
                                                type="submit"
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

                {/* Main Content */}
                <main className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-8">
                    {/* Main Article */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow p-8 mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{news.category}</span>
                                <span className="text-gray-400 text-xs">
                                    {news.created_at ? new Date(news.created_at).toLocaleDateString() : ''}
                                </span>
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
                        <section className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-lg mb-4">Popular News</h3>
                            <div className="flex flex-col gap-4">
                                {(popularNews.length > 0 ? popularNews : [news]).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('newspage', { slug: item.slug })}
                                        className="flex gap-3 hover:bg-gray-100 rounded p-2 transition"
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
                        <section className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-lg mb-4">Related News</h3>
                            <div className="flex flex-col gap-4">
                                {(relatedNews.length > 0 ? relatedNews : []).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('newspage', { slug: item.slug })}
                                        className="flex gap-3 hover:bg-gray-100 rounded p-2 transition"
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