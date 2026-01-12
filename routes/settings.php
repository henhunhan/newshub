<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    Route::get('settings/addnews', function () {
        return Inertia::render('settings/addnews', [
            'categories' => Category::all(),
        ]);
    })->middleware('auth')->name('addnews');


    Route::get('settings/newsdraft', function () {
        $drafts = Article::with('category')
            ->where('status', 'draft')
            ->where('user_id', Auth::id()) // 🔥 PENTING
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('settings/newsdraft', [
            'drafts' => $drafts
        ]);
    })->middleware('auth')->name('newsdraft');


Route::post('/settings/newsdraft/{article}/publish', function (Article $article) {

    abort_if($article->user_id !== Auth::id(), 403);

    $article->update([
        'status' => 'published'
    ]);

    return redirect()->route('newsdraft')
        ->with('success', 'Berita berhasil dipublish');
})->middleware('auth')->name('newsdraft.publish');


Route::delete('/settings/newsdraft/{article}', function (Article $article) {

    abort_if($article->user_id !== Auth::id(), 403);

    $article->delete();

    return redirect()->route('newsdraft')
        ->with('success', 'Draft berhasil dihapus');
})->middleware('auth')->name('newsdraft.delete');

    
Route::get('/settings/news/edit/{article}', function (Article $article) {

    abort_if($article->user_id !== Auth::id(), 403);

    return Inertia::render('settings/newsedit', [
        'article' => $article->load('category'),
        'categories' => Category::all()
    ]);
})->middleware('auth')->name('news.edit');


Route::put('/settings/news/{article}', function (Request $request, Article $article) {

    abort_if($article->user_id !== Auth::id(), 403);

    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'category_id' => 'required|exists:categories,id',
        'content' => 'required',
        'image' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $validated['thumbnail_image'] = $request->file('image')->store('news', 'public');
    }

    $article->update($validated);

    return redirect()->route('newsdraft')
        ->with('success', 'Berita berhasil diperbarui');
})->middleware('auth')->name('news.update');






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
