<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleLike;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ArticleLikeController extends Controller
{
    public function toggle(Article $article)
    {
        $user = Auth::user(); // 🔥 FIX intelephense

        DB::transaction(function () use ($article, $user) {

            $liked = ArticleLike::where('article_id', $article->id)
                ->where('user_id', $user->id)
                ->first();

            if ($liked) {
                $liked->delete();
                $article->decrement('like_count');
            } else {
                ArticleLike::create([
                    'article_id' => $article->id,
                    'user_id' => $user->id,
                ]);
                $article->increment('like_count');
            }
        });

        return back();
    }
}
