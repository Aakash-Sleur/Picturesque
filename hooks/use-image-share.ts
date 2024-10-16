export const useImageShare = async (imageUrl: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this image!",
        text: "I found this awesome image in a folder.",
        url: imageUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    await navigator.clipboard.writeText(imageUrl);
  }
};
