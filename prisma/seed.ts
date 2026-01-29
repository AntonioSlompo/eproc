import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@eproc.com" },
        update: {},
        create: {
            email: "admin@eproc.com",
            name: "Administrador",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log(`✅ Admin user created: ${admin.email}`);

    // Create a supplier
    const supplier = await prisma.supplier.upsert({
        where: { id: "supplier-demo-1" },
        update: {},
        create: {
            id: "supplier-demo-1",
            name: "Fornecedor Demo Ltda",
            email: "contato@fornecedor.com",
            phone: "(11) 99999-9999",
            address: "Rua das Compras, 123 - São Paulo, SP",
        },
    });

    console.log(`✅ Supplier created: ${supplier.name}`);

    // Create sample products
    const products = [
        {
            name: "Papel A4 Resma 500 folhas",
            description: "Papel sulfite branco para impressão",
            sku: "PAP-A4-500",
            unitPrice: 25.90,
        },
        {
            name: "Caneta Esferográfica Azul",
            description: "Caneta esferográfica ponta média",
            sku: "CAN-ESF-AZ",
            unitPrice: 2.50,
        },
        {
            name: "Notebook Dell Latitude",
            description: "Notebook corporativo i5 8GB RAM",
            sku: "NOT-DELL-LAT",
            unitPrice: 4500.00,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { sku: product.sku },
            update: {},
            create: {
                ...product,
                supplierId: supplier.id,
            },
        });
        console.log(`✅ Product created: ${product.name}`);
    }

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📋 Login credentials:");
    console.log("   Email: admin@eproc.com");
    console.log("   Password: admin123");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
