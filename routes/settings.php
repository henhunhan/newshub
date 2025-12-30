<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;

Route::middleware('auth')->group(function () {

    // Redirect default settings
    Route::redirect('settings', 'settings/profile');

    /*
    |--------------------------------------------------------------------------
    | SETTINGS PAGES (INERTIA)
    |--------------------------------------------------------------------------
    */

    Route::get('settings/profile', function () {
        return Inertia::render('settings/profile', [
            'categories' => Category::all(),
        ]);
    })->name('settings.profile');

    Route::get('settings/password', function () {
        return Inertia::render('settings/password', [
            'categories' => Category::all(),
        ]);
    })->name('password.edit');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    /*
    |--------------------------------------------------------------------------
    | PROFILE ACTIONS
    |--------------------------------------------------------------------------
    */

    // Halaman edit profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    // Update data profile (PATCH)
    Route::patch('/settings/profile/personal', [ProfileController::class, 'updatePersonal'])
        ->name('profile.personal.update');

    Route::patch('/settings/profile/account', [ProfileController::class, 'updateAccount'])
        ->name('profile.account.update');

    /*
    |--------------------------------------------------------------------------
    | PASSWORD ACTION
    |--------------------------------------------------------------------------
    */

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->name('password.update');
});
