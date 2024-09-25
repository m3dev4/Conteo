export const getImageUrl = (imagePath: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://conteo-1.onrender.com";
    
    // Vérifier si imagePath est défini
    if (!imagePath) {
      console.error("imagePath is undefined or null");
      return `${baseUrl}/uploads/defaultImage.png`; // Retourner une image par défaut si nécessaire
    }
  
    // Remplacer les barres obliques inversées par des barres obliques normales
    const normalizedPath = imagePath.replace(/\\/g, "/");
  
    // Si le chemin contient déjà 'uploads/', ne pas ajouter de préfixe
    const finalPath = normalizedPath.startsWith("uploads/")
      ? normalizedPath
      : `uploads/${normalizedPath}`;
  
    return `${baseUrl}/${finalPath}`;
  };
  