import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Search, ChevronsUpDown } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import React, { useRef } from 'react';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

type PageProps = {
    categories: Category[];
};

export default function Password() {
    const { categories } = usePage<PageProps>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { auth } = usePage<SharedData>().props;

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const sidebarNavItems = [
        { title: 'Profile', href: '/settings/profile' },
        { title: 'Password', href: '/settings/password' },
    ];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <>
            <Head title="Password Settings" />
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Header */}
                <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
                        <div className="flex items-center gap-8">
                            <Link href={route('home')}>
                                <span className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 focus:outline-none focus:ring-0">NewsHub</span>
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
                        <div className="flex items-center gap-8">
                            <form className="flex items-center border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search news..."
                                    className="w-max text-md focus:outline-none focus:ring-0"
                                />
                                <Search className="text-gray-500 cursor-pointer w-4" type="submit" />
                            </form>
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='flex flex-row items-center gap-3 rounded-sm py-1'>
                                        <UserInfo user={auth.user} />
                                        <ChevronsUpDown className="ml-auto size-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-40 rounded-lg shadow">
                                        <UserMenuContent user={auth.user} />
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
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Change Password</h1>
                                <p className="text-gray-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                            <section className="bg-white rounded-xl shadow p-6 max-w-lg">
                                <form onSubmit={updatePassword} className="space-y-6">
                                    <div>
                                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            type="password"
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />
                                        <InputError message={errors.current_password} />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            id="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            type="password"
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            autoComplete="new-password"
                                            placeholder="New password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            type="password"
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            autoComplete="new-password"
                                            placeholder="Confirm new password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition text-sm"
                                            disabled={processing}
                                        >
                                            {processing ? 'Saving...' : 'Save password'}
                                        </button>
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Saved</p>
                                        </Transition>
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
                </footer>
            </div>
        </>
    );
}
