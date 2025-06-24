import { X } from "lucide-react"

const ViewImageModal = ({isOpen,onClose,imagePreviewUrl}) => {

    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-black" />
          </button>
          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
  )
}

export default ViewImageModal