import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("会社情報のインサート");
  const csvFilePath = path.resolve(__dirname, "init/companies_data.csv");
  const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  const companies = fileContent.split("\n").slice(1).map((content) => {
    const splittedContent = content.split(",");
    if (!splittedContent[1]){
      console.log(splittedContent)
    }
    return {
      name: splittedContent[1],
      tel: splittedContent[2],
      employeeCount: splittedContent[3] ? Number(splittedContent[3]) : undefined,
      homepageLink: splittedContent[4],
      address: splittedContent[5],
      salesAmount: splittedContent[6],
    };
  });

  await Promise.all(
    companies.map(async (company) => {
      await prisma.company.create({
        data: {
          name: company.name,
          tel: company.tel,
          employeeCount: company.employeeCount,
          homepageLink: company.homepageLink,
          address: company.address,
          salesAmount: company.salesAmount,
        },
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
