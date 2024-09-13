const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    if (!res.headersSent) {  // Vérifiez si les en-têtes n'ont pas encore été envoyés
      res.status(500).json({ message: error.message });
    } else {
      console.error("Headers already sent, error:", error.message);
    }
  });
};

export default asyncHandler;
