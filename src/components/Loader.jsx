import { motion } from "framer-motion";
export default function Loader() {
  return (
    <div className="relative flex flex-col items-center justify-center">

      <motion.div
        className="w-32 h-32 border-t-4 border-l-4 border-green-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="w-24 h-24 border-b-4 border-r-4 border-orange-600 rounded-full absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="w-8 h-8 bg-gray-300 rounded-full absolute"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="flex mt-8">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="h-2 w-2 bg-white rounded-full mx-1"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: dot * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
