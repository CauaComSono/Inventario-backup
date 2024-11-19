import * as React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  head: React.ReactNode; 
}

const Table: React.FC<TableProps> = ({ className, head, children, ...props }) => {
  return (
    <table className={cn("min-w-full border border-gray-200", className)} {...props}>
      <thead className="bg-gray-100">
        <tr>{head}</tr> {}
      </thead>
      <tbody>{children}</tbody> {}
    </table>
  );
};

export default Table;
