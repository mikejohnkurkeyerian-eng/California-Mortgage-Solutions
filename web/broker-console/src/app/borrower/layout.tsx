import { BorrowerNavbar } from '@/components/layout/BorrowerNavbar';

export default function BorrowerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <BorrowerNavbar />
            {children}
        </>
    );
}
