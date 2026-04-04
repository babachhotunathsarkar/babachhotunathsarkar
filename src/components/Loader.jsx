import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true }) => {
  const text = "बाबा छोटू नाथ सरकार सेवा समिति";
  const characters = Array.from(text);

  // Snake-like wave animation variants
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const letterVariants = {
    initial: { 
      y: 0, 
      opacity: 0,
      scale: 0.8
    },
    animate: {
      y: [0, -25, 25, 0],
      x: [0, 5, -5, 0],
      opacity: 1,
      scale: [1, 1.2, 1, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const content = (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex flex-wrap justify-center items-center gap-x-1 md:gap-x-2 px-10 text-center"
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="text-2xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-600 via-orange-500 to-yellow-600 drop-shadow-xl select-none filter blur-[0.2px]"
          style={{ 
            display: 'inline-block', 
            minWidth: char === ' ' ? '0.4em' : 'auto',
            marginLeft: char === ' ' ? '0.2em' : '0'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white shadow-2xl z-[9999] flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-400 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-300 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative flex flex-col items-center">
             {/* Center Glow */}
             <div className="absolute -inset-20 bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
             
             {/* Content */}
             <div className="relative z-10">
                {content}
             </div>
             
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-16 flex flex-col items-center gap-4"
             >
                <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
                <p className="text-orange-800/40 text-[10px] font-black uppercase tracking-[0.3em]">
                    Kripaya Prateeksha Karein
                </p>
             </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 flex justify-center w-full overflow-hidden">
      {content}
    </div>
  );
};

export default Loader;
