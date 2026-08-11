import { useEffect, useState } from 'react';

export function BrandedLoading({ text = 'Cargando...' }: { text?: string }) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: 'conic-gradient(from 0deg, #1e3f57, #3c517d, #6bb2cd, #1e3f57)',
              maskImage: 'radial-gradient(circle, transparent 60%, black 61%)',
              WebkitMaskImage: 'radial-gradient(circle, transparent 60%, black 61%)',
            }}
          />
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <img
              src={isDark ? '/ovelix-oscuro.png' : '/ovelix-claro.png'}
              alt="ovelix"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">{text}</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: ['#1e3f57', '#3c517d', '#6bb2cd'][i],
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BrandedInlineLoader() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, #1e3f57, #3c517d, #6bb2cd, #1e3f57)',
            maskImage: 'radial-gradient(circle, transparent 55%, black 56%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 56%)',
          }}
        />
        <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
          <img
            src="/ovelix-claro.png"
            alt=""
            className="w-4 h-4 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
