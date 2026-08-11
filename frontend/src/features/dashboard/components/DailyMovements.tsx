import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { MdInventory2, MdBuild, MdPersonAdd } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { DailyActivity } from '../types/dashboard.types';

interface DailyMovementsProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onRegisterMovementClick: () => void;
  dailyActivities: DailyActivity[];
  loading: boolean;
}

export function DailyMovements({ selectedDate, setSelectedDate, onRegisterMovementClick, dailyActivities, loading }: DailyMovementsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Movimientos del Día</CardTitle>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1 flex flex-col">
        <div className="mb-4 pb-4 border-b border-border">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground"
          />
          <Button onClick={onRegisterMovementClick} className="w-full mt-3" variant="outline">
            <Plus size={18} className="mr-2" /> Registrar Movimiento
          </Button>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto max-h-52">
          {dailyActivities.length > 0 ? (
            dailyActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activity.type === 'Stock' && (
                      <MdInventory2 size={16} className="text-blue-500 shrink-0" />
                    )}
                    {activity.type === 'Reparación' && (
                      <MdBuild size={16} className="text-orange-500 shrink-0" />
                    )}
                    {activity.type === 'Cliente' && (
                      <MdPersonAdd size={16} className="text-success shrink-0" />
                    )}
                    {activity.type === 'WhatsApp' && (
                      <BsWhatsapp size={16} className="text-success shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{activity.time}</p>
                    {activity.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">x{activity.quantity}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Sin actividades para esta fecha</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}