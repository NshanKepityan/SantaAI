import { motion } from "framer-motion";

export default function SectionHeaderHighliteLeft({ highlight, title }: { highlight: string; title?: string }) {
return (
<motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center leading-tight text-white drop-shadow-xl mb-20"
      >
        <span className="text-red-300">{highlight} {" "}</span>
		{title}
      </motion.h1>
)}