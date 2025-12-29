'use client';

import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDocuments } from '@/context/DocumentContext';
import { useBrokerSettings } from '@/context/BrokerContext';

export default function BorrowerSettingsPage() {
    const { currentLoan } = useDocuments();
    const { settings, toggleTheme } = useBrokerSettings();
    const isDark = settings.theme === 'dark';

    // Local state for form fields (initialized with context data if available)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Notification preferences state
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(true);

    useEffect(() => {
        if (currentLoan?.borrower) {
            setFirstName(currentLoan.borrower.firstName || '');
            setLastName(currentLoan.borrower.lastName || '');
            setEmail(currentLoan.borrower.email || '');
            setPhone(currentLoan.borrower.phone || '');
        }
    }, [currentLoan]);

    const handleSaveProfile = () => {
        // In a real app, this would call an API to update the borrower profile
        alert('Profile updated successfully!');
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">


            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">Account Settings</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your profile, preferences, and security settings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Navigation/Sidebar (Optional, for now just stacking) */}

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Profile Section */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details and contact information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                                        <Input
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                                        <Input
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john.doe@example.com"
                                        type="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="(555) 123-4567"
                                        type="tel"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button onClick={handleSaveProfile} className="bg-primary-600 hover:bg-primary-500">
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferences Section */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Customize your application experience.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium text-slate-900 dark:text-white">Appearance</label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Switch between light and dark mode.
                                        </p>
                                    </div>
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        <button
                                            onClick={() => isDark && toggleTheme()}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${!isDark
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                                }`}
                                        >
                                            Light
                                        </button>
                                        <button
                                            onClick={() => !isDark && toggleTheme()}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isDark
                                                ? 'bg-slate-700 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                                }`}
                                        >
                                            Dark
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-6"></div>

                                {/* Notifications */}
                                <div className="space-y-4">
                                    <h3 className="text-base font-medium text-slate-900 dark:text-white">Notifications</h3>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Notifications</label>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Receive updates about your loan application via email.
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setEmailNotifs(!emailNotifs)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${emailNotifs ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">SMS Notifications</label>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Get text messages for urgent updates.
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setSmsNotifs(!smsNotifs)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${smsNotifs ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsNotifs ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Section */}
                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>Manage your password and account security.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Password</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Last changed 3 months ago</p>
                                    </div>
                                    <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                                        Change Password
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
                                    </div>
                                    <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                                        Enable 2FA
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column - Help/Support */}
                    <div className="space-y-6">
                        <Card variant="glass" className="bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">Need Help?</h3>
                                <p className="text-sm text-primary-700 dark:text-primary-300 mb-4">
                                    Our support team is available 24/7 to assist you with any questions or issues.
                                </p>
                                <Button className="w-full bg-primary-600 hover:bg-primary-500">
                                    Contact Support
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

