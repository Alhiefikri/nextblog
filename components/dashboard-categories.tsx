"use client";

import { Category, User } from "@/app/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface CategoryProps {
  categories: (Category & { user: User })[];
}

const DashboardCategories = ({ categories }: CategoryProps) => {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Latest categories</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {categories.map((category) => (
            <div
              className="p-4 rounded-lg gap-6 shadow-sm flex items-center"
              key={category.id}
            >
              <p className="font-medium">{category.name}</p>
              <div className="flex items-center gap-1">
                <div className="relative h-8 w-8 rounded-full shadow-lg">
                  <Image
                    className="rounded-full"
                    src={category.user?.image ?? ""}
                    alt={category.user?.name}
                    fill
                  />
                </div>
                <p className="font-medium">{category.user?.name}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCategories;
