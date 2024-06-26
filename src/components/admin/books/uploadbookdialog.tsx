"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import CustomFormField from "@/components/reusables/customformfield";
import Description from "@/components/reusables/description";

import { uploadBook } from "@/utils/book/uploadbook";
import { updateBook } from "@/utils/book/updatebook";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";
import { BookFormData, bookSchema, categories } from "@/types/book";

interface UploadBookDialogProps {
  mutate: () => void;
  bookToEdit?: BookFormData;
}

const UploadBookDialog = ({ mutate, bookToEdit }: UploadBookDialogProps) => {
  const formMethods = useForm<BookFormData>({
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
      price_per_week: 0,
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (bookToEdit) {
      formMethods.reset(bookToEdit);
    }
  }, [bookToEdit, formMethods]);

  const onSubmit = async (data: BookFormData) => {
    try {
      let result;
      if (bookToEdit) {
        result = await updateBook(bookToEdit.id!, data);
      } else {
        result = await uploadBook(data);
      }
      const { success, error } = result;
      if (success) {
        formMethods.reset();
        mutate();
        toast({
          title: bookToEdit ? "Book updated!" : "New book uploaded!",
          description: `${data.title} by ${data.author} has been ${
            bookToEdit ? "updated" : "added"
          }.`,
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
      toast({
        variant: "destructive",
        title: "Error uploading book",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={bookToEdit ? "outline" : "default"}>
          {bookToEdit ? "Edit" : "New Book"}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-screen overflow-y-auto"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>
            {bookToEdit ? "Edit Book" : "Upload New Book"}
          </DialogTitle>
        </DialogHeader>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormDescription id="dialog-description">
              {bookToEdit
                ? "Update the details of the book."
                : "Fill in the details to upload a new book."}
            </FormDescription>
            <CustomFormField name="title" label="Title" />
            <CustomFormField name="author" label="Author" />
            <CustomFormField
              name="description"
              label="Description"
              type="text"
            />
            <CustomFormField name="published" label="Published Year" />

            <FormField
              control={formMethods.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Categories</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <FormField
                          key={category}
                          control={formMethods.control}
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
                { value: "Pending", label: "Pending" },
              ]}
            />
            <CustomFormField name="rented_by" label="Rented By" />

            <FormField
              control={formMethods.control}
              name="price_per_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Week</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {formMethods.formState.errors.price_per_week && (
                    <FormMessage>
                      {formMethods.formState.errors.price_per_week.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
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
                  {formMethods.formState.errors.images && (
                    <FormMessage>
                      {formMethods.formState.errors.images.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{bookToEdit ? "Update" : "Submit"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadBookDialog;
