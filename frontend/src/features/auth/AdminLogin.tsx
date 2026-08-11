import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import logo from '/ovelix-claro.png';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE } from '../../services/api';
import { toast } from '@/shared/components/ui/use-toast';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerData, setRegisterData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    dni: '',
    telefono: '',
    inviteToken: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Login como desarrollador (sin código de empresa)
      await login(email, password, '');
      navigate('/developer');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/auth/register-developer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar desarrollador');
      }

      // Registro exitoso, cambiar a modo login
      setIsRegisterMode(false);
      setEmail(registerData.email);
      setPassword(registerData.password);
      setRegisterData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        dni: '',
        telefono: '',
        inviteToken: ''
      });
      toast({ title: 'Éxito', description: 'Desarrollador registrado exitosamente. Ahora puedes iniciar sesión.' });
    } catch (err: any) {
      setError(err.message || 'Error al registrar desarrollador');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-background text-primary select-none">
      {/* Left section - branding */}
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
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                Modo Desarrollador
              </span>
              <br />
              <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
                Acceso al Sistema
              </span>
            </h1>
          </div>
        </div>
      </section>
      {/* Right section - form */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative">
        {/* Mobile logo */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img src={logo} alt="ovelix" loading="lazy" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[440px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl shadow-xl border border-border/60 p-8 lg:p-10"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">
                  {isRegisterMode ? 'Registrar Desarrollador' : 'Acceso Desarrollador'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isRegisterMode 
                    ? 'Crea una cuenta de desarrollador para gestionar empresas'
                    : 'Ingresa tus credenciales de desarrollador'}
                </p>
              </div>
              <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-5">
                {isRegisterMode && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        type="text"
                        placeholder="Juan"
                        value={registerData.nombre}
                        onChange={(e) => setRegisterData({...registerData, nombre: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        type="text"
                        placeholder="Pérez"
                        value={registerData.apellido}
                        onChange={(e) => setRegisterData({...registerData, apellido: e.target.value})}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="desarrollador@ovelix.com"
                    value={isRegisterMode ? registerData.email : email}
                    onChange={(e) => isRegisterMode 
                      ? setRegisterData({...registerData, email: e.target.value})
                      : setEmail(e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={isRegisterMode ? registerData.password : password}
                      onChange={(e) => isRegisterMode 
                        ? setRegisterData({...registerData, password: e.target.value})
                        : setPassword(e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {isRegisterMode && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="inviteToken">Token de invitación</Label>
                      <Input
                        id="inviteToken"
                        type="password"
                        placeholder="Token provisto por el administrador"
                        value={registerData.inviteToken}
                        onChange={(e) => setRegisterData({...registerData, inviteToken: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="dni">DNI (opcional)</Label>
                      <Input
                        id="dni"
                        type="text"
                        placeholder="12345678"
                        value={registerData.dni}
                        onChange={(e) => setRegisterData({...registerData, dni: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefono">Teléfono (opcional)</Label>
                      <Input
                        id="telefono"
                        type="text"
                        placeholder="+5491112345678"
                        value={registerData.telefono}
                        onChange={(e) => setRegisterData({...registerData, telefono: e.target.value})}
                      />
                    </div>
                  </>
                )}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive font-medium"
                  >
                    {error}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99] font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading 
                    ? 'Procesando...' 
                    : isRegisterMode 
                      ? 'Registrar Desarrollador' 
                      : 'Ingresar'
                  }
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </form>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isRegisterMode 
                    ? '¿Ya tienes cuenta? Inicia sesión' 
                    : '¿No tienes cuenta? Regístrate como desarrollador'}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Volver al login principal
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
