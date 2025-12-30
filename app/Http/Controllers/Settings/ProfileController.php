<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */

//     public function update(ProfileUpdateRequest $request)
// {
//     dd(
//         $request->all(),
//         $request->files->all(),
//         $request->hasFile('avatar')
//     );
// }

public function updatePersonal(Request $request)
{
    $user = $request->user();

    // 1. Validasi SEMUA field yang dikirim dari React
    $data = $request->validate([
        'name'          => 'required|string|max:255',
        'username'      => 'required|string|max:255',
        'gender'        => 'nullable|string',
        'date_of_birth' => 'nullable|date',
        'province'      => 'nullable|string',
        'city'          => 'nullable|string',
        'address'       => 'nullable|string',
        'avatar'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('avatar')) {
        // Hapus foto lama jika ada
        if ($user->avatar) {
            // Kita ambil nama filenya saja untuk dihapus dari disk 'public'
            $oldPath = str_replace('/storage/', '', $user->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        // Simpan foto baru ke folder 'avatars' di disk 'public'
        $path = $request->file('avatar')->store('avatars', 'public');
        
        // Simpan URL publiknya ke database
        $data['avatar'] = ($path); 
    }

    // Update user dengan SEMUA data yang sudah divalidasi
    $user->update($data);

    return back();
}

    public function updateAccount(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'backup_email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        if ($request->user()->email !== $data['email']) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->update($data);

        return back();
    }
}
