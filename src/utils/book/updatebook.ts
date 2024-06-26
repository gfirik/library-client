import { supabase } from "@/utils/supabase/client";
import { BookFormData } from "@/types/book";

interface UploadResult {
  success: boolean;
  error?: string;
}

async function deleteImageFromStorage(imagePath: string) {
  const bucket = "books";
  const storage = supabase.storage.from(bucket);
  const { error } = await storage.remove([imagePath]);
  if (error) {
    console.error(`Error deleting image ${imagePath}:`, error);
  }
}

async function uploadNewImages(images: (File | string)[]) {
  const bucket = "books";
  const storage = supabase.storage.from(bucket);

  const imageUrls = await Promise.all(
    images.map(async (image) => {
      if (typeof image === "string") {
        return image; // Return existing image URL
      }
      // Upload new image
      const { data: uploadData, error: uploadError } = await storage.upload(
        `public/${image.name}`,
        image,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );
      if (uploadError) {
        throw uploadError;
      }
      return uploadData?.path || "";
    })
  );

  return imageUrls.filter((url): url is string => url !== "");
}

export const updateBook = async (
  bookId: number,
  data: BookFormData
): Promise<UploadResult> => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData) {
      return { success: false, error: "User not authenticated." };
    }

    // Fetch the current book data
    const { data: currentBook, error: fetchError } = await supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Handle image updates if necessary
    let updatedImageUrls = data.images;
    if (data.images.some((image) => image instanceof File)) {
      // Delete old images from storage
      if (currentBook.images && currentBook.images.length > 0) {
        for (const imagePath of currentBook.images) {
          await deleteImageFromStorage(imagePath);
        }
      }

      // Update book record to remove old image paths
      const { error: updateError } = await supabase
        .from("books")
        .update({ images: [] })
        .eq("id", bookId);

      if (updateError) {
        throw updateError;
      }

      // Upload new images
      updatedImageUrls = await uploadNewImages(data.images);
    }

    // Update book data with all fields including new image paths
    const { error: finalUpdateError } = await supabase
      .from("books")
      .update({
        title: data.title,
        author: data.author,
        description: data.description,
        published: data.published,
        categories: data.categories,
        status: data.status,
        rented_by: data.rented_by,
        images: updatedImageUrls,
        price_per_week: data.price_per_week,
      })
      .eq("id", bookId);

    if (finalUpdateError) {
      throw finalUpdateError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating book", error);
    return {
      success: false,
      error: "An error occurred while updating the book.",
    };
  }
};
