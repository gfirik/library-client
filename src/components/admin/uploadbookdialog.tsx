"use client";

import { bookSchema, BookFormData } from "@/types/book";
import { supabase } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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

const UploadBookDialog = () => {
  const router = useRouter();

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
      const bucket = "books";
      const storage = supabase.storage?.from(bucket);
      console.log(storage);
      if (!storage) {
        console.error("Supabase Storage is not available.");
        return;
      }
      //   Upload Images
      const imageUrls = await Promise.all(
        data.images.map(async (file) => {
          const { data: uploadData, error: uploadError } = await storage.upload(
            `public/${file.name}`,
            file,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
          if (uploadError) {
            throw uploadError;
          }
          alert("File uploaded successfully!");
          return uploadData?.path;
        })
      );

      //   Validate Image Urls
      const validImageUrls = imageUrls.filter((url) => url !== null);

      //   Upload Book Data
      const { data: bookData, error: insertError } = await supabase
        .from("books")
        .insert({
          title: data.title,
          author: data.author,
          description: data.description,
          published: data.published,
          status: data.status,
          rented_by: data.rented_by,
          images: validImageUrls,
        });
      if (insertError) {
        throw insertError;
      }

      //refresh the page
      if (bookData) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error uploading books", error);
    }
  };

  return (
    <Dialog>
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
