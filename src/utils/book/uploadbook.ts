import { supabase } from "@/utils/supabase/client";
import { BookFormData } from "@/types/book";

export const uploadBook = async (data: BookFormData): Promise<boolean> => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return false;
    }
    if (!sessionData) {
      console.error("User not authenticated.");
      return false;
    }

    const bucket = "books";
    const storage = supabase.storage.from(bucket);
    if (!storage) {
      console.error("Supabase Storage is not available.");
      return false;
    }

    // Upload Images
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
        console.log("Data uploaded successfully!", uploadData);
        return uploadData?.path;
      })
    );

    // Validate Image Urls
    const validImageUrls = imageUrls.filter((url) => url !== null);

    // Upload Book Data
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

    return true;
  } catch (error) {
    console.error("Error uploading books", error);
    return false;
  }
};
