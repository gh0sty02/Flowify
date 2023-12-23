import { Input } from "@/components/ui/input";
import React from "react";

interface FromInputProps {
  title: string;
  errors?: {
    title?: string[];
  };
}

export const FormInput = ({ title, errors }: FromInputProps) => {
  return (
    <div>
      {" "}
      <div className="flex flex-col space-y-2">
        <Input
          id="title"
          name="title"
          required
          placeholder="Enter a Board Title"
        />
        {errors?.title ? (
          <div>
            {errors.title.map((error) => (
              <p className="text-rose-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
      </div>{" "}
    </div>
  );
};
