import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  message: string;
}

const FancyLoader = ({ message }: Props) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return;
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[400px]">
      {/* Main loader container */}
      <div className="relative w-20 h-20 mb-3">
        {/* Central rotating element */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-3 h-3 rounded-full bg-pink-500" />
        </motion.div>

        {/* Floating dresses */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute text-lg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            style={{
              left: `${35 + 25 * Math.cos((i * 2 * Math.PI) / 3)}%`,
              top: `${35 + 25 * Math.sin((i * 2 * Math.PI) / 3)}%`,
            }}
          >
            👗
          </motion.div>
        ))}
      </div>

      {/* Text with animation */}
      <motion.p
        className="text-sm font-medium text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message ?? " Preparing your styles..."}
      </motion.p>

      {/* Mini progress indicator */}
      <motion.div
        className="mt-2 w-16 h-1 bg-gray-200 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: 64 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default FancyLoader;
