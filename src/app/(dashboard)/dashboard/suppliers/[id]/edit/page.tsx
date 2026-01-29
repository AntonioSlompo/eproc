import { getSupplier } from "@/lib/actions/suppliers";
import { notFound } from "next/navigation";
import EditSupplierPageClient from "./page-client";

interface EditSupplierPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
    const { id } = await params;

    try {
        const supplier = await getSupplier(id);

        return <EditSupplierPageClient params={params} supplier={supplier} />;
    } catch (error) {
        notFound();
    }
}
