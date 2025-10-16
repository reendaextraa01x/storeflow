import { Header } from "@/components/header";
import ProductsClient from "@/components/products-client";

export default function ProductsPage() {
    return (
        <>
            <Header />
            <main>
                <ProductsClient />
            </main>
        </>
    )
}