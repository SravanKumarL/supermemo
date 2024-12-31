import React from "react";

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white shadow rounded">{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);
