"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormData, bookSchema, categories } from "@/types/book";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import CustomFormField from "@/components/reusables/customformfield";
import { useToast } from "@/components/ui/use-toast";
import { uploadBook } from "@/utils/book/uploadbook";
import { capitalizeFirstLetter } from "../../../utils/functions/capitalize";

const UploadBookDialog = ({ mutate }: { mutate: () => void }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      published: "",
      status: "Available",
      rented_by: "",
      images: [],
      categories: [],
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: BookFormData) => {
    try {
      const { success, error } = await uploadBook(data);
      if (success) {
        setOpen(false);
        form.reset();
        mutate();
        toast({
          title: "New book uploaded!",
          description: `${data.title} by ${data.author} has been added.`,
        });
      } else {
        let errorMessage =
          "An error occurred while uploading the book. Please try again.";
        if (error === "Duplicate image file.") {
          errorMessage =
            "The image file already exists. Please use a different image or rename the file.";
        }
        toast({
          variant: "destructive",
          title: "Error uploading book",
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error("Error uploading book", error);
      toast({
        variant: "destructive",
        title: "Error uploading book",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Book</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Book</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField name="title" label="Title" />
            <CustomFormField name="author" label="Author" />
            <CustomFormField
              name="description"
              label="Description"
              type="text"
            />
            <CustomFormField name="published" label="Published Year" />

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Categories</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <FormField
                          key={category}
                          control={form.control}
                          name="categories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            category,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== category
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>
                                  {capitalizeFirstLetter(category)}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomFormField
              name="status"
              label="Status"
              type="select"
              options={[
                { value: "Available", label: "Available" },
                { value: "Rented", label: "Rented" },
              ]}
            />
            <CustomFormField name="rented_by" label="Rented By" />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          field.onChange(Array.from(e.target.files));
                        }
                      }}
                    />
                  </FormControl>
                  {form.formState.errors.images && (
                    <FormMessage>
                      {form.formState.errors.images.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadBookDialog;
