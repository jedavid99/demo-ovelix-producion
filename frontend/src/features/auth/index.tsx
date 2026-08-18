import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '/ovelix-claro.png';
import { motion } from 'framer-motion';
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    codigoEmpresa: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (errorMessage) setErrorMessage('');
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Llamamos al login del AuthContext
      await login(
        formData.email,
        formData.password,
        formData.codigoEmpresa
      );
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Mostrar mensaje detallado del backend
      const mensaje = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      setErrorMessage(mensaje);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-background text-primary select-none">
      {/* Sección izquierda (branding) - la dejamos igual */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent/95 to-transparent/70 z-10"></div>
        <div className="relative z-20 max-w-lg text-white flex flex-col justify-center items-center h-full text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              className="relative group"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 blur-2xl rounded-full scale-150"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="p-[3px] rounded-full bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600 shadow-2xl shadow-blue-900/40 transition-all duration-700 group-hover:shadow-blue-700/70">
                <img src={logo} alt="ovelix" loading="lazy" className="w-40 h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
              </div>
              <motion.div
                className="absolute inset-0 -z-10 rounded-full border border-white/10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                La mejor ayuda
              </span>
              <br />
              <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
                para tu taller
              </span>
            </h1>
          </div>
        </div>
      </section>
      {/* Sección derecha (formulario) */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative pattern-bg">
        {/* Logo móvil */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img src={logo} alt="ovelix" loading="lazy" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[440px] bg-card rounded-2xl shadow-xl border border-border/60 p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">Bienvenido</h2>
              <p className="text-sm text-muted-foreground">Inicia sesión para acceder a tu panel de administración.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="email">Correo</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-card  border border-border rounded-xl text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ejemplo@hotmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Código de empresa (NUEVO) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground" htmlFor="codigoEmpresa">
                  Código de empresa
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Building2 className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-card  border border-border rounded-xl text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="codigoEmpresa"
                    name="codigoEmpresa"
                    type="text"
                    placeholder="Ej: 80YTE2 (opcional para desarrolladores)"
                    value={formData.codigoEmpresa}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Contraseña */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-muted-foreground" htmlFor="password">
                    Contraseña
                  </label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline cursor-pointer">
                    ¿Olvidaste la contraseña?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-card  border border-border rounded-xl text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errorMessage && (
                <div className="flex items-start gap-2 text-sm text-destructive dark:text-destructive bg-destructive/10 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3.5 py-3 mt-1">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </form>
          <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
