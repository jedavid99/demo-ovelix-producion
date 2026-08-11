import { useEffect, useState } from 'react';
import { MdBarChart, MdStar, MdStarBorder } from 'react-icons/md';
import { getReviews } from '@/services/reviews.service';
import { FaRegComment } from "react-icons/fa6";
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
    setLoading(true);
    getReviews({ limit: 50 })
      .then((res: any) => {
        const list = res?.data ?? res ?? [];
        setReviews(Array.isArray(list) ? list : []);
        if (Array.isArray(list) && list.length > 0) {
          const avg = list.reduce((s: number, r: Review) => s + r.puntuacion, 0) / list.length;
          setAverage(Math.round(avg * 10) / 10);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const renderStars = (n: number) => (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= n ? (
          <MdStar key={i} size={16} className="text-amber-400" />
        ) : (
          <MdStarBorder key={i} size={16} className="text-muted-foreground/40" />
        )
      )}
    </span>
  );

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MdBarChart size={20} />
          <div>
            <h2 className="text-lg font-semibold text-foreground">Calificaciones y Reseñas</h2>
            <p className="text-xs text-muted-foreground">Opiniones de clientes sobre ventas y reparaciones</p>
          </div>
        </div>
        {!loading && reviews.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <MdStar size={18} className="text-amber-400" />
            <span className="font-bold text-foreground">{average}</span>
            <span className="text-xs text-muted-foreground">/ 5</span>
          </div>
        )}
      </div>
      <AsyncState
        loading={loading}
        empty={!loading && reviews.length === 0}
        loadingLabel="Cargando reseñas..."
        emptyIcon={MdBarChart}
        emptyTitle="Sin calificaciones todavía"
        emptyDescription="Las reseñas de clientes aparecerán aquí cuando comiencen a calificar ventas y reparaciones"
      >
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-border-light dark:border-border-dark rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">
                      {review.cliente?.nombre_completo || 'Cliente'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                      {review.entidad === 'REPAIR' ? 'Reparación' : 'Venta'}
                    </span>
                  </div>
                  {review.comentario && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1.5">
                      <FaRegComment  size={14} className="shrink-0 mt-0.5 text-muted-foreground/50" />
                      {review.comentario}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {new Date(review.created_at).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="shrink-0">{renderStars(review.puntuacion)}</div>
              </div>
            </div>
          ))}
        </div>
      </AsyncState>
    </div>
  );
};
