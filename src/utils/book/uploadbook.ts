import { supabase } from "@/utils/supabase/client";
import { BookFormData } from "@/types/book";

interface UploadResult {
  success: boolean;
  error?: string;
}

interface SupabaseError {
  statusCode: string;
  message: string;
}

function isSupabaseError(error: any): error is SupabaseError {
  return (
    error &&
    typeof error === "object" &&
    "statusCode" in error &&
    "message" in error
  );
}

export const uploadBook = async (data: BookFormData): Promise<UploadResult> => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return { success: false, error: sessionError.message };
    }
    if (!sessionData) {
      console.error("User not authenticated.");
      return { success: false, error: "User not authenticated." };
    }

    const bucket = "books";
    const storage = supabase.storage.from(bucket);
    if (!storage) {
      console.error("Supabase Storage is not available.");
      return { success: false, error: "Supabase Storage is not available." };
    }

    // Upload Images
    const imageUrls = await Promise.all(
      data.images.map(async (file) => {
        try {
          const { data: uploadData, error: uploadError } = await storage.upload(
            `public/${file.name}`,
            file,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
          if (uploadError) {
            if (
              isSupabaseError(uploadError) &&
              uploadError.statusCode === "409"
            ) {
              throw new Error("Duplicate");
            }
            throw uploadError;
          }
          console.log("Data uploaded successfully!", uploadData);
          return uploadData?.path;
        } catch (error) {
          if (isSupabaseError(error) && error.statusCode === "409") {
            throw new Error("Duplicate");
          }
          throw error;
        }
      })
    );

    // Validate Image Urls
    const validImageUrls = imageUrls.filter((url) => url !== null);

    // Upload Book Data
    const { error: insertError } = await supabase.from("books").insert({
      title: data.title,
      author: data.author,
      description: data.description,
      published: data.published,
      categories: data.categories,
      status: data.status,
      rented_by: data.rented_by,
      images: validImageUrls,
    });
    if (insertError) {
      throw insertError;
    }

    return { success: true };
  } catch (error) {
    if ((error as Error).message === "Duplicate") {
      return { success: false, error: "Duplicate image file." };
    }
    console.error("Error uploading books", error);
    return {
      success: false,
      error: "An error occurred while uploading the book.",
    };
  }
};
