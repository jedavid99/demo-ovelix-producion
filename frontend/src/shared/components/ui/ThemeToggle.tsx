import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors whitespace-nowrap px-4"
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
    >
      {theme === 'light' ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
      <span className="flex-1 text-left">{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
    </button>
  )
}
