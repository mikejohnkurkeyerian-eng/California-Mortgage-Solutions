import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoans, getLoanById, updateLoan, submitLoanApplication, approveLoan } from '@/lib/api';
import type { LoanApplication } from '@loan-platform/shared-types';

export function useBrokerPipeline() {
    return useQuery({
        queryKey: ['loans', 'pipeline'],
        queryFn: () => getLoans(),
    });
}

export function useUpdateLoan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<LoanApplication> }) =>
            updateLoan(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['loan', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['loans'] });
        },
    });
}

export function useApproveLoan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => approveLoan(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['loan', id] });
            queryClient.invalidateQueries({ queryKey: ['loans'] });
        },
    });
}

export function useLoan(id: string) {
    return useQuery({
        queryKey: ['loan', id],
        queryFn: () => getLoanById(id),
        enabled: !!id,
    });
}
