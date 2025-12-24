'use client';

import { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';

import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen pt-20 px-4">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </main>
    );
}

