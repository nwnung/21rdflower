'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FlowerAnimation() {
  return (
    <div className="flower-container">
      <motion.div 
        className="relative w-64 h-64"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Tallo */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 top-1/2 w-4 h-32 stem origin-top"
          animate={{ 
            rotateZ: [0, 2, -2, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut" 
          }}
        />
        
        {/* Centro de la flor */}
        <motion.div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 center z-10"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut" 
          }}
        />
        
        {/* Pétalos */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-[80px] w-24 h-24 petal"
            style={{
              rotate: `${i * 45}deg`,
            }}
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
        
        {/* Brillo */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-[45%] -translate-y-[45%] w-8 h-8 bg-white rounded-full blur-sm z-20"
          animate={{
            opacity: [0.1, 0.7, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
        
        {/* Hojas */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-[90%] translate-y-[30%] w-16 h-8 leaf -rotate-30 origin-left"
          animate={{
            rotateZ: [-30, -25, -30],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-[10%] translate-y-[30%] w-16 h-8 leaf rotate-30 origin-left"
          animate={{
            rotateZ: [30, 25, 30],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
} 