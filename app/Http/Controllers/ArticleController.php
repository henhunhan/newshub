<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // ✅ Pastikan user login
        $user = Auth::user();

        // Generate slug unik
        $slug = Str::slug($request->title);
        $originalSlug = $slug;
        $count = 1;

        while (Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        // Upload image
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('articles', 'public');
        }

        Article::create([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'category_id' => (int) $request->category_id,
            'user_id' => $user->id,
            'author_name' => $user->name, // ✅ INI YANG KAMU MAU
            'thumbnail_image' => $imagePath,
            'published_at' => now(),
            'view_count' => 0,
            'like_count' => 0,
        ]);

        return redirect()->back()->with('success', 'Article published successfully!');
    }
}
