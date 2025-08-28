import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";

export default function DisplayImage({ image, onClose }) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            >
                {/* Stop click propagation inside content */}
                <motion.div
                    className="relative w-full max-w-4xl max-h-[90vh] flex justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-2 right-2 text-white text-3xl hover:text-red-400 transition"
                        onClick={onClose}
                    >
                        <IoClose />
                    </button>

                    {/* Image */}
                    <img
                        src={image}
                        alt="Preview"
                        className="max-h-[80vh] w-auto rounded-lg shadow-xl object-contain border-2 border-white"
                    />
                    
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
