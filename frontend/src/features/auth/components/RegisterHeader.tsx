import React from 'react';
import { motion } from 'framer-motion';
import logo from '/ovelix-claro.png';

export const RegisterHeader: React.FC = () => {
  return (
    <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent/95 to-transparent/70 z-10"></div>
      <div className="relative z-20 max-w-lg text-white flex flex-col justify-center items-center h-full text-center py-16">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            className="relative group"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 blur-2xl rounded-full scale-150"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="p-[3px] rounded-full bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600 shadow-2xl shadow-blue-900/40 transition-all duration-700 group-hover:shadow-blue-700/70">
              <img
                src={logo}
                alt="ovelix"
                loading="lazy"
                className="w-40 h-40 rounded-full object-cover border-4 border-white/80 bg-black/30"
              />
            </div>
            <motion.div
              className="absolute inset-0 -z-10 rounded-full border border-white/10"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
              Únete a ovelix
            </span>
            <br />
            <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
              Gestiona tu taller
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
};
