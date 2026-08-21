import { useEffect, useState } from 'react';
import { BarChart2, Star, MessageSquare } from 'lucide-react';
import { getReviews } from '@/services/reviews.service';
import { AsyncState } from '@/shared/components/async/AsyncState';

interface Review {
  id: string;
  cliente_id: string;
  entidad: string;
  entidad_id: string;
  puntuacion: number;
  comentario: string | null;
  created_at: string;
  cliente?: { id: string; nombre_completo: string; telefono: string };
}

export const PerformanceSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setLoading(true);
    getReviews({ limit: 50 })
      .then((res: { data?: Review[]; meta?: { totalPages?: number } } | Review[]) => {
        const list = 'data' in res ? (res.data ?? []) : res;
        setReviews(Array.isArray(list) ? list : []);
        if (Array.isArray(list) && list.length > 0) {
          const avg = list.reduce((s: number, r: Review) => s + r.puntuacion, 0) / list.length;
          setAverage(Math.round(avg * 10) / 10);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

const renderStars = (n: number, size = 16) => (
    <span className="inline-flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= n ? (
          <Star key={i} size={size} className="text-amber-400 fill-current" />
        ) : (
          <Star key={i} size={size} className="text-muted-foreground/40" strokeWidth={2} />
        )
      )}
    </span>
  );

  const entityBadge = (entidad: string) => {
    const e = entidad.toUpperCase();
    if (e === 'REPAIR') return 'bg-success/10 text-success';
    if (e === 'SALE') return 'bg-primary/10 text-primary';
    return 'bg-muted/50 text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Calificaciones y Reseñas</h2>
            <p className="text-xs text-muted-foreground">Opiniones de clientes sobre ventas y reparaciones</p>
          </div>
        </div>
        {!loading && reviews.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full">
            <Star size={20} className="text-amber-400 fill-current" />
            <span className="font-bold text-xl text-foreground">{average}</span>
            <span className="text-xs text-muted-foreground">/ 5 · {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <AsyncState
        loading={loading}
        empty={!loading && reviews.length === 0}
        loadingLabel="Cargando reseñas..."
        emptyIcon={BarChart2}
        emptyTitle="Sin calificaciones todavía"
        emptyDescription="Las reseñas de clientes aparecerán aquí cuando comiencen a calificar ventas y reparaciones"
      >
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <div key={review.id} className="p-5 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-medium text-foreground text-sm">
                      {review.cliente?.nombre_completo || 'Cliente'}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${entityBadge(review.entidad)}`}>
                      {review.entidad === 'REPAIR' ? 'Reparación' : 'Venta'}
                    </span>
                  </div>
                  {review.comentario && (
                    <p className="text-sm text-muted-foreground mt-1.5 flex items-start gap-1.5 line-clamp-3">
                      <MessageSquare size={14} className="shrink-0 mt-0.5 text-muted-foreground/50" />
                      {review.comentario}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(review.created_at).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="shrink-0 flex items-center">{renderStars(review.puntuacion, 18)}</div>
              </div>
            </div>
          ))}
        </div>
      </AsyncState>
    </div>
  );
};