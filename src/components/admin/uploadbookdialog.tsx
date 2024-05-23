"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import CustomFormField from "@/components/reusables/customformfield";
import { bookSchema, BookFormData } from "@/types/book";
import { uploadBook } from "@/utils/book/uploadbook";
import { toast } from "sonner";

const UploadBookDialog = () => {
  const router = useRouter();
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
    },
  });

  const onSubmit = async (data: BookFormData) => {
    try {
      const success = await uploadBook(data);
      if (success) {
        setOpen(false);

        form.reset();
        // toast("Book data uploaded successfully!", {
        //   description: `${data.title}, ${data.author}`,
        //   action: {
        //     label: "Go'zal!",
        //     onClick: () => {
        //     },
        //   },
        // });
        router.refresh();
      }
    } catch (error) {
      console.error("Error uploading books", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload New Book</Button>
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
            <CustomFormField
              name="status"
              label="Status"
              type="select"
              options={[
                { value: "Available", label: "Available" },
                { value: "Unavailable", label: "Unavailable" },
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
