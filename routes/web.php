<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\Comment;


Route::get('/', function (Request $request) {
    $query = \App\Models\Article::query();
        if ($request->search) {
        $query->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('content', 'like', '%' . $request->search . '%');
    }
    $categories = Category::all();
    $news = $query->orderBy('published_at', 'desc')->get();
        return Inertia::render('welcome', [
            'categories' => $categories, // Kirim ke komponen React
            'news' => $news,
        ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $query = \App\Models\Article::query();
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('content', 'like', '%' . $request->search . '%');
    }
        $categories = Category::all(); // Ambil semua kategori dari database
        $news = $query->orderBy('published_at', 'desc')->get();
        return Inertia::render('dashboard', [
            'categories' => $categories, // Kirim ke komponen React
            'news' => $news,
        ]);
    })->name('dashboard');
});


Route::get('/newspage/{slug}', function ($slug) {
    $news = \App\Models\Article::where('slug', $slug)->firstOrFail();
    $categories = \App\Models\Category::all();
    $comments = \App\Models\Comment::with('user')->where('article_id', $news->id)->orderBy('created_at', 'desc')->get();

    // Popular News: seluruh berita dari database, urut terbaru, kecuali berita yang sedang dibuka
    $popularNews = \App\Models\Article::where('id', '!=', $news->id)
        ->orderBy('published_at', 'desc')
        ->get();

    // Related News: berita lain dengan kategori sama, kecuali berita yang sedang dibuka
    $relatedNews = \App\Models\Article::where('category', $news->category)
        ->where('id', '!=', $news->id)
        ->orderBy('published_at', 'desc')
        ->get();

    return Inertia::render('newspage', [
        'news' => $news,
        'categories' => $categories,
        'popularNews' => $popularNews,
        'relatedNews' => $relatedNews,
        'comments' => $comments, // tambahkan ini agar comments dikirim ke frontend
    ]);
})->name('newspage');

Route::get('/categories', function () {
    $categories = Category::all();
    return Inertia::render('categories', [ // Sesuaikan dengan file React Pages-mu
        'categories' => $categories,
    ]);
})->name('categories');

// Route dinamis untuk detail kategori berdasarkan slug
Route::get('/categories/{slug}', function (Request $request, $slug) {
    $category = Category::where('slug', $slug)->firstOrFail();
    $query = \App\Models\Article::where('category', $category->name);
    

    if ($request->search) {
        $query->where(function($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('desc', 'like', '%' . $request->search . '%');
        });
    }

    $articles = $query->orderBy('published_at', 'desc')->get();

    // Popular News: seluruh berita dari database, urut terbaru
    $popularNews = \App\Models\Article::orderBy('published_at', 'desc')->get();

    // Related News: berita lain dengan kategori sama, kecuali yang sedang dibuka (jika ada pencarian, related tetap semua 1 kategori)
    $relatedNews = \App\Models\Article::where('category', $category->name)
        ->orderBy('published_at', 'desc')
        ->get();

    $categories = Category::all();
    return Inertia::render('categories', [
        'categories' => $categories,
        'category' => $category,
        'articles' => $articles,
        'popularNews' => $popularNews,
        'relatedNews' => $relatedNews,
    ]);
})->name('categories.show');

Route::post('/newspage/{slug}/comment', function (Request $request, $slug) {
    $news = \App\Models\Article::where('slug', $slug)->firstOrFail();
    $request->validate(['content' => 'required|string|max:1000']);
    \App\Models\Comment::create([
        'article_id' => $news->id,
        'user_id' => Auth::id(), // gunakan helper auth() agar konsisten
        'content' => $request->content,
    ]);
    return redirect()->route('newspage', ['slug' => $news->slug]);
})->middleware('auth')->name('comments');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
