import { Loader2 } from "lucide-react"


const SmallLoader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse flex items-center justify-center">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" />
            </div>
          </div>
  )
}

export default SmallLoader