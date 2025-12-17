'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function BorrowerDebugFooter() {
    const { data: session } = useSession();
    const [localRef, setLocalRef] = useState<string | null>('Checking...');

    useEffect(() => {
        const ref = localStorage.getItem('broker_ref_v2');
        setLocalRef(ref || 'NULL');
    }, []);

    if (!session) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white p-2 text-xs font-mono z-50 opacity-90">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex gap-4">
                    <div>
                        <span className="text-slate-400">LocalStorage Ref:</span>{' '}
                        <span className={localRef && localRef !== 'NULL' ? 'text-green-400 font-bold' : 'text-red-500 font-bold'}>
                            {localRef}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400">Session BrokerID:</span>{' '}
                        <span className={(session.user as any)?.brokerId ? 'text-green-400 font-bold' : 'text-red-500 font-bold'}>
                            {(session.user as any)?.brokerId || 'NULL'}
                        </span>
                    </div>

                    <div>
                        <span className="text-slate-400">User Email:</span> {session.user?.email}
                    </div>
                </div>
                <div className="text-slate-500">
                    Debug Mode Active
                </div>
            </div>
        </div>
    );
}
