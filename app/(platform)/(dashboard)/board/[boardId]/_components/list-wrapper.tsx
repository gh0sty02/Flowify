import React from "react";

export const ListWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-[272px] shrink-0 h-full">{children}</div>;
};
