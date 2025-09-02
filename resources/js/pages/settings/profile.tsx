import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Search, ChevronsUpDown } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import React, { useState} from 'react';

type ProfileForm = {
    name: string;
    username: string;
    gender: string;
    date_of_birth: string;
    province: string;
    city: string;
    address: string;
    email: string;
    backup_email: string;
    phone: string;
    password: string;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

type PageProps = {
    categories: Category[];
};

export default function Profile() {
    const { categories} = usePage<PageProps>().props;
    const { auth } = usePage<SharedData>().props;

    function formatDateToInput(dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ''; // jika dateStr invalid
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
}


    const { data, setData, patch, errors, processing } = useForm<Required<ProfileForm>>('', {
        name: String(auth.user.name ?? ''),
        username: String(auth.user.username ?? ''),
        gender: String(auth.user.gender ?? ''),
        date_of_birth: formatDateToInput(String(auth.user.date_of_birth ?? '')),
        province: String(auth.user.province ?? ''),
        city: String(auth.user.city ?? ''),
        address: String(auth.user.address ?? ''),
        email: String(auth.user.email ?? ''),
        backup_email: String(auth.user.backup_email ?? ''),
        phone: String(auth.user.phone ?? ''),
        password: '',
});


    // Pisahkan edit mode dan success state untuk masing-masing section
    const [editPersonal, setEditPersonal] = useState(false);
    const [editAccount, setEditAccount] = useState(false);
    const [successPersonal, setSuccessPersonal] = useState(false);
    const [successAccount, setSuccessAccount] = useState(false);

    // Tambahkan state untuk News Preferences
    const [editPreferences, setEditPreferences] = useState(false);
        const [preferences, setPreferences] = useState({
            topics: {
                Technology: true,
                Politics: true,
                Sports: true,
                Business: true,
                Entertainment: true,
                Health: false,
                Science: false,
            },
            notifications: {
                email: true,
                breaking: true,
                newsletter: false,
            },
        });
    const [successPreferences, setSuccessPreferences] = useState(false);

    const sidebarNavItems = [
        { title: 'Profile', href: '/settings/profile' },
        { title: 'Password', href: '/settings/password' },
    ];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Submit khusus untuk personal info
    const handlePersonalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setEditPersonal(false);
                setSuccessPersonal(true);
                setTimeout(() => setSuccessPersonal(false), 3000);
            },
        });
    };

    // Submit khusus untuk account & security
    const handleAccountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setEditAccount(false);
                setSuccessAccount(true);
                setTimeout(() => setSuccessAccount(false), 3000);
            },
        });
    };

    // Handler untuk checkbox topics
    const handleTopicChange = (topic: string) => {
        setPreferences((prev) => ({
            ...prev,
            topics: {
                ...prev.topics,
                [topic]: !prev.topics[topic],
            },
        }));
    };
// Handler untuk checkbox notifications
    const handleNotifChange = (notif: string) => {
        setPreferences((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [notif]: !prev.notifications[notif],
            },
        }));
    };

    // Handler untuk submit preferences
    const handlePreferencesSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Kirim ke backend jika perlu, contoh:
        // patch(route('preferences.update'), { data: preferences, ... })
        setEditPreferences(false);
        setSuccessPreferences(true);
        setTimeout(() => setSuccessPreferences(false), 2000);
    };

    return (
        <>
            <Head title="Profile Settings" />
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
                            {/* Profile Settings Heading */}
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
                                <p className="text-gray-500 mb-6">Manage your account information and preferences</p>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Column */}
                                <div className="flex-1 flex flex-col gap-8">
                                    {/* Personal Information */}
                                    <section className="bg-white rounded-xl shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="font-semibold text-lg">Personal Information</h2>
                                            <button
                                                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
                                                onClick={() => setEditPersonal(!editPersonal)}
                                                type="button"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"></path>
                                                </svg>
                                                {editPersonal ? 'Cancel' : 'Edit'}
                                            </button>
                                        </div>
                                        <form onSubmit={handlePersonalSubmit}>
                                            <div className="flex items-center gap-4 mb-6">
                                                <img
                                                    alt="Profile"
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold text-base">{auth.user.name}</div>
                                                    <div className="text-gray-500 text-sm">{auth.user.username}</div>
                                                    <div className="text-gray-400 text-xs">Member since {auth.user.created_at ? new Date(auth.user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : '-'}</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={e => setData('name', e.target.value)}
                                                        readOnly={!editPersonal}
                                                    />
                                                    {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="username"
                                                        value={data.username}
                                                        onChange={e => setData('username', e.target.value)}
                                                        readOnly={!editPersonal}
                                                    />
                                                    {errors.username && <div className="text-red-500 text-xs">{errors.username}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                    {editPersonal ? (
                                                        <select
                                                            name="gender"
                                                            className="w-full border rounded px-3 py-2 text-sm"
                                                            value={data.gender}
                                                            onChange={e => setData('gender', e.target.value)}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            className="w-full border rounded px-3 py-2 text-sm"
                                                            value={data.gender}
                                                            readOnly
                                                        />
                                                    )}
                                                    {errors.gender && <div className="text-red-500 text-xs">{errors.gender}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="dob"
                                                        value={data.date_of_birth}
                                                        onChange={e => setData('date_of_birth', e.target.value)}
                                                        readOnly={!editPersonal}
                                                    />
                                                    {errors.date_of_birth && <div className="text-red-500 text-xs">{errors.date_of_birth}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="province"
                                                        value={data.province}
                                                        onChange={e => setData('province', e.target.value)}
                                                        readOnly={!editPersonal}
                                                    />
                                                    {errors.province && <div className="text-red-500 text-xs">{errors.province}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="city"
                                                        value={data.city}
                                                        onChange={e => setData('city', e.target.value)}
                                                        readOnly={!editPersonal}
                                                    />
                                                    {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="address"
                                                        value={data.address}
                                                        onChange={e => setData('address', e.target.value)}
                                                        readOnly={!editPersonal}
                                                    />
                                                    {errors.address && <div className="text-red-500 text-xs">{errors.address}</div>}
                                                </div>
                                            </div>
                                            {editPersonal && (
                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition text-sm"
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            )}
                                            {successPersonal && (
                                                <div className="text-green-600 text-sm mt-2">Profile updated successfully.</div>
                                            )}
                                        </form>
                                    </section>

                                    {/* Account & Security */}
                                    <section className="bg-white rounded-xl shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="font-semibold text-lg">Account & Security</h2>
                                            <button
                                                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
                                                onClick={() => setEditAccount(!editAccount)}
                                                type="button"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.293-11.293a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0L3 15v6z"></path>
                                                </svg>
                                                {editAccount ? 'Cancel' : 'Edit'}
                                            </button>
                                        </div>
                                        <form onSubmit={handleAccountSubmit}>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="email"
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        readOnly={!editAccount}
                                                    />
                                                    {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Backup Email</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="backup_email"
                                                        value={data.backup_email}
                                                        onChange={e => setData('backup_email', e.target.value)}
                                                        readOnly={!editAccount}
                                                    />
                                                    {errors.backup_email && <div className="text-red-500 text-xs">{errors.backup_email}</div>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        className="w-full border rounded px-3 py-2 text-sm"
                                                        name="phone"
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        readOnly={!editAccount}
                                                    />
                                                    {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
                                                </div>
                                                <div>
                                                </div>
                                            </div>
                                            {editAccount && (
                                                <div className="flex items-center mt-2">
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 text-xs underline mr-4"
                                                        onClick={() => {/* handle change password modal */}}
                                                    >
                                                        Change Password
                                                    </button>
                                                </div>
                                            )}
                                            {editAccount && (
                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition text-sm"
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Updating...' : 'Update Security'}
                                                    </button>
                                                </div>
                                            )}
                                            {successAccount && (
                                                <div className="text-green-600 text-sm mt-2">Account & Security updated successfully.</div>
                                            )}
                                        </form>
                                    </section>
                                </div>
                                {/* Right Column */}
                                <div className="flex flex-col gap-8 w-full lg:w-80">
                                    {/* News Preferences */}
                                    <section className="bg-white rounded-xl shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="font-semibold text-lg">News Preferences</h2>
                                            <button
                                                className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
                                                type="button"
                                                onClick={() => setEditPreferences((v) => !v)}
                                            >
                                                {editPreferences ? 'Cancel' : 'Change'}
                                            </button>
                                        </div>
                                        <form onSubmit={handlePreferencesSubmit}>
                                            <div className="mb-4">
                                                <div className="font-medium text-gray-700 mb-2">Favorite Topics</div>
                                                <div className="flex flex-col gap-1">
                                                    {Object.keys(preferences.topics).map((topic) => (
                                                        <label key={topic} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={preferences.topics[topic as keyof typeof preferences.topics]}
                                                                disabled={!editPreferences}
                                                                onChange={() => handleTopicChange(topic)}
                                                            /> {topic}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="font-medium text-gray-700 mb-2">Notification Settings</div>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={preferences.notifications.email}
                                                        disabled={!editPreferences}
                                                        onChange={() => handleNotifChange('email')}
                                                    /> Email Notifications
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={preferences.notifications.breaking}
                                                        disabled={!editPreferences}
                                                        onChange={() => handleNotifChange('breaking')}
                                                    /> Breaking News Alerts
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={preferences.notifications.newsletter}
                                                        disabled={!editPreferences}
                                                        onChange={() => handleNotifChange('newsletter')}
                                                    /> Weekly Newsletter
                                                </label>
                                            </div>
                                            {editPreferences && (
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition text-sm border border-blue-100"
                                                    >
                                                        Save Preferences
                                                    </button>
                                                </div>
                                            )}
                                            {successPreferences && (
                                                <div className="text-green-600 text-sm mt-2 text-right">Preferences saved!</div>
                                            )}
                                        </form>
                                    </section>
                                </div>
                            </div>
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
