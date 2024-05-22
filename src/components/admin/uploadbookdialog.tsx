"use client";

import bookSchema from "@/types/book";
import { supabase } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type BookFormData = z.infer<typeof bookSchema>;

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
      // Upload Images
      const imageUrls = await Promise.all(
        data.images.map(async (file) => {
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("books")
              .upload(`public/${file.name}`, file);
          if (uploadError) {
            throw uploadError;
          }
          return uploadData.path;
        })
      );

      //   Upload Book Data
      const { error: insertError } = await supabase.from("books").insert({
        title: data.title,
        author: data.author,
        description: data.description,
        published: data.published,
        status: data.status,
        rented_by: data.rented_by,
        images: imageUrls,
      });
      if (insertError) {
        throw insertError;
      }

      //refresh the page
      router.refresh();
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} id="title" />
                  </FormControl>
                  {form.formState.errors.title && (
                    <FormMessage>
                      {form.formState.errors.title.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} id="author" />
                  </FormControl>
                  {form.formState.errors.author && (
                    <FormMessage>
                      {form.formState.errors.author.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} id="description" />
                  </FormControl>
                  {form.formState.errors.description && (
                    <FormMessage>
                      {form.formState.errors.description.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published Year</FormLabel>
                  <FormControl>
                    <Input {...field} id="published" />
                  </FormControl>
                  {form.formState.errors.published && (
                    <FormMessage>
                      {form.formState.errors.published.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    {/* <select
                      {...field}
                      id="status"
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select> */}
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.status && (
                    <FormMessage>
                      {form.formState.errors.status.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rented_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rented By</FormLabel>
                  <FormControl>
                    <Input {...field} id="rented_by" />
                  </FormControl>
                </FormItem>
              )}
            />

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
                          const files = Array.from(e.target.files);
                          field.onChange(files);
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
