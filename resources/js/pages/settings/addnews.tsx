import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import React from 'react';
import { router } from '@inertiajs/react';


type Category = {
    id: number;
    name: string;
};

type AddNewsForm = {
    title: string;
    content: string;
    category_id: string;
    image?: File | null;
};

const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.post(route('logout'));
};

export default function AddNews() {
    const { auth, categories } = usePage<SharedData & { categories: Category[] }>().props;

    // Add news form
    const {
        data: newsData,
        setData: setNewsData,
        post: postNews,
        errors: newsErrors,
        processing: newsProcessing
    } = useForm<AddNewsForm>({
        title: '',
        content: '',
        category_id: '',
        image: null,
    });

    // Submit untuk add news
    const handleNewsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postNews(route('articles.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Reset form
                setNewsData({
                    title: '',
                    content: '',
                    category_id: '',
                    image: null,
                });
                alert('News published successfully!');
            },
        });
    };

    const sidebarNavItems = [
        { title: 'Profile', href: '/settings/profile' },
        { title: 'Password', href: '/settings/password' },
        { title: 'Add News', href: '/settings/addnews' },
    ];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <>
            <Head title="Add News" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <header className="w-full border-gray-700 top-0 z-50">
                    <div className="w-full mx-auto px-6 py-1">
                        {/* Top Section */}
                        <div className="flex items-center justify-between mb-6 ml-24">
                            {/* Search & Bell */}
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
                <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full max-w-xl lg:w-56">
                            <nav className="flex flex-col space-y-1">
                                {sidebarNavItems.map((item) => (
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

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-8">
                            {/* Add News Heading */}
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Add News</h1>
                                <p className="text-gray-500 mb-6">Create and publish a new news article</p>
                            </div>

                            {/* Add News Form */}
                            <section className="bg-white rounded-xl shadow p-6">
                                <form onSubmit={handleNewsSubmit}>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                name="title"
                                                value={newsData.title}
                                                onChange={e => setNewsData('title', e.target.value)}
                                                required
                                            />
                                            {newsErrors.title && <div className="text-red-500 text-xs">{newsErrors.title}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                name="category_id"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                value={newsData.category_id}
                                                onChange={e => setNewsData('category_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {newsErrors.category_id && <div className="text-red-500 text-xs">{newsErrors.category_id}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                            <textarea
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                name="content"
                                                rows={10}
                                                value={newsData.content}
                                                onChange={e => setNewsData('content', e.target.value)}
                                                required
                                            />
                                            {newsErrors.content && <div className="text-red-500 text-xs">{newsErrors.content}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setNewsData('image', file);
                                                    }
                                                }}
                                            />
                                            {newsErrors.image && <div className="text-red-500 text-xs">{newsErrors.image}</div>}
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition text-sm"
                                            disabled={newsProcessing}
                                        >
                                            {newsProcessing ? 'Publishing...' : 'Publish News'}
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-10 mt-16">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
                        <div>
                            <span className="text-2xl font-bold text-blue-400">NewsHub</span>
                            <p className="mt-2 text-gray-400 text-sm max-w-xs">
                                Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of global events.
                            </p>
                            <div className="flex gap-3 mt-4">
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-youtube"></i></a>
                                <a href="#" className="hover:text-blue-400"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Categories</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li>Sports</li>
                                <li>Politics</li>
                                <li>Technology</li>
                                <li>Business</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Quick Links</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 text-xs mt-8">
                        © 2024 NewsHub. All rights reserved.
                    </div>
                </footer>
            </div>
        </>
    );
}
