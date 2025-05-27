import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

export const Filter = ({ handleFilterChange }) => {

  const [sortByPrice, setSortByPrice] = useState("");

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedValue);
  };
  return (
    <div className="w-full md:w-[20%] ">
      <div className="flex justify-between  flex-col gap-2">
        <h1 className="font-semibold text-lg ml-2">Filter</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      {/* <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {category.label}
            </Label>
          </div>
        ))}
      </div> */}
    </div>
  );
};

