import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLoan, getLoans, getLoanById, updateLoan } from '@/lib/api';
import { useSession, signOut } from 'next-auth/react';
import type { LoanApplication } from '@/types/shared';

export function useBorrowerLoans(borrowerId?: string) {
    return useQuery({
        queryKey: ['loans', 'borrower', borrowerId],
        queryFn: () => getLoans(), // getLoans now uses server session, no args needed
        enabled: !!borrowerId,
    });
}

export function useLoanApplication(loanId: string) {
    return useQuery({
        queryKey: ['loan', loanId],
        queryFn: () => getLoanById(loanId),
        enabled: !!loanId,
    });
}

export function useCreateLoan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<LoanApplication>) => createLoan(data),
        retry: 0, // Fail immediately, don't retry
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loans'] });
        },
    });
}

export function useUpdateLoan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<LoanApplication> }) => updateLoan(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['loans'] });
            queryClient.invalidateQueries({ queryKey: ['loan', variables.id] });
        },
    });
}

export function useBorrowerAuth() {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';
    const borrowerId = session?.user?.id || null;

    const login = (id: string) => {
        // Handled by NextAuth login page
    };

    const logout = async () => {
        await signOut({ redirect: false });
        window.location.href = '/login';
    };

    return {
        borrowerId,
        user: session?.user,
        mutate: session?.update,
        isLoading,
        login,
        logout
    };
}

