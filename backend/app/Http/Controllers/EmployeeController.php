<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    private const PROFILE_RULES = [
        'nullable',
        'image',
        'max:2048',
        'mimes:jpeg,jpg,png,webp,gif',
    ];

    public function index()
    {
        return response()->json(Employee::query()->orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('employees', 'email')],
            'phone' => ['required', 'string', 'max:50'],
            'position' => ['required', 'string', 'max:255'],
            'salary' => ['required', 'numeric'],
            'hire_date' => ['required', 'date'],
            'profile_picture' => self::PROFILE_RULES,
        ]);

        $upload = $validated['profile_picture'] ?? null;
        if ($upload instanceof UploadedFile) {
            $validated['profile_picture'] = $upload->store('employee_profiles', 'public');
        } else {
            $validated['profile_picture'] = null;
        }

        $employee = Employee::create($validated);

        return response()->json($employee, 201);
    }

    public function show($id)
    {
        return response()->json(Employee::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('employees', 'email')->ignore($employee->id),
            ],
            'phone' => ['required', 'string', 'max:50'],
            'position' => ['required', 'string', 'max:255'],
            'salary' => ['required', 'numeric'],
            'hire_date' => ['required', 'date'],
            'profile_picture' => self::PROFILE_RULES,
        ]);

        $upload = $validated['profile_picture'] ?? null;
        if ($upload instanceof UploadedFile) {
            if ($employee->profile_picture) {
                Storage::disk('public')->delete($employee->profile_picture);
            }
            $validated['profile_picture'] = $upload->store('employee_profiles', 'public');
        } else {
            unset($validated['profile_picture']);
        }

        $employee->update($validated);

        return response()->json($employee->fresh());
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        if ($employee->profile_picture) {
            Storage::disk('public')->delete($employee->profile_picture);
        }

        $employee->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
