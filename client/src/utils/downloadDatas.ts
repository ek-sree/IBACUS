export const handleDownload = async (url) => {
  try {
    // Fetch the file
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = blobUrl;
    
    // Extract the most meaningful filename from Cloudinary URL
    let filename = "document";
    const urlParts = url.split('/');
    
    // Try to get the original filename (last part before extension in Cloudinary)
    const cloudinaryParts = urlParts[urlParts.length - 1].split('.');
    console.log("CL",cloudinaryParts);
    
    if (cloudinaryParts.length > 1) {
      // If there's an extension, use the part before the random string as filename
      const originalNamePart = urlParts[urlParts.length - 2];
      if (originalNamePart && originalNamePart !== "upload") {
        filename = originalNamePart;
      }
      
      // Always preserve the original extension
      const extension = cloudinaryParts[cloudinaryParts.length - 1];
      filename = `${filename}.${extension}`;
    } else {
      // Fallback for URLs without clear extension
      const contentType = response.headers.get('content-type');
      if (contentType) {
        const extension = contentType.split('/')[1];
        filename = `download.${extension}`;
      } else {
        filename = `download.${url.endsWith('.pdf') ? 'pdf' : 'file'}`;
      }
    }
    
    // Clean up filename (remove any random strings if present)
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    link.download = filename;
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download failed. Please try again.");
  }
};