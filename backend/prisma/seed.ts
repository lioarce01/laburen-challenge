import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const workbook = XLSX.readFile('prisma/products.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);
  const sample = rows.slice(0, Math.ceil(rows.length * 0.1)); // only 10% of the excel data

  for (const row of sample) {
    await prisma.product.create({
      data: {
        name: row['TIPO_PRENDA'] + ' ' + row['CATEGORÍA'],
        description: row['DESCRIPCIÓN'],
        price: parseFloat(row['PRECIO_50_U']),
        stock: parseInt(row['CANTIDAD_DISPONIBLE'], 10),
      },
    });
  }
}
main().finally(() => prisma.$disconnect());
