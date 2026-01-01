<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $table = 'articles'; // penting kalau nama tabel bukan "articles"

    public $timestamps = false; // ✅ INI SOLUSINYA

    protected $fillable = [
        'category',
        'title',
        'slug',
        'content',
        'thumbnail_image',
        'published_at',
        'status',
        'view_count',
        'created_at',
        'author_name',
        'like_count',
    ];

    protected $casts = [
        'view_count' => 'integer',
        'like_count' => 'integer',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
