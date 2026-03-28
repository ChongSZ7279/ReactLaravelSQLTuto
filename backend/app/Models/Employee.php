<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Employee extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'salary',
        'hire_date',
        'profile_picture',
    ];

    protected $appends = [
        'profile_picture_url',
    ];

    protected function profilePictureUrl(): Attribute
    {
        return Attribute::get(function () {
            if (! $this->profile_picture) {
                return null;
            }

            return Storage::disk('public')->url($this->profile_picture);
        });
    }
}
