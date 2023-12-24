"use client";
import { createBoard } from "@/actions/create-board";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import React from "react";

import { useFormState } from "react-dom";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit";

export const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "Success");
    },
    onError: (error) => {
      console.error(error, "error");
    },
  });

  const onSubmitHandler = (formdata: FormData) => {
    const title = formdata.get("title") as string;

    execute({ title });
  };
  return (
    <form className="flex gap-x-2" action={onSubmitHandler}>
      <FormInput errors={fieldErrors} id="title" label="Board Title" />
      <FormSubmitButton> Save</FormSubmitButton>
    </form>
  );
};
