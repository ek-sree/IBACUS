import { X } from "lucide-react";

const PdfViewerModal = ({ fileUrl, isOpen, onClose }: {
  fileUrl: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
        onClick={onClose}
      >
        <X className="w-6 h-6 text-black" />
      </button>

      {/* PDF iframe */}
      <div className="flex-1 p-4 overflow-auto bg-white rounded-xl mx-4 my-16 shadow-2xl flex flex-col items-center gap-8">
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title="PDF Preview"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default PdfViewerModal;
