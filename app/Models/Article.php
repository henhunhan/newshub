<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $table = 'articles'; // penting kalau nama tabel bukan "articles"

    public $timestamps = false;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'category_id',
        'user_id',
        'thumbnail_image',
        'author_name',
        'published_at',
        'view_count',
        'like_count',
        'status',
    ];

    protected $casts = [
        'view_count' => 'integer',
        'like_count' => 'integer',
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function getThumbnailImageAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

}
