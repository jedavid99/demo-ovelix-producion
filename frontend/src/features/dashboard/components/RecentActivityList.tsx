import React from 'react';
import { ChevronRight } from 'lucide-react';
import {
  MdWarning,
  MdShoppingCart,
  MdCheckCircle,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  PendingDelivery,
  StockAlert,
} from '../types/dashboard.types';
import { getDeliveryBadge } from '../constants/dashboard.constants';

interface RecentDeliveriesProps {
  pendingDeliveries: PendingDelivery[];
  stockAlerts: StockAlert[];
}

const RecentDeliveries: React.FC<RecentDeliveriesProps> = ({
  pendingDeliveries,
  stockAlerts,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-full">
      
      
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MdWarning className="text-destructive" />
                Stock Crítico
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/stock')}>
                Ver Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {stockAlerts.length > 0 ? (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {stockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {alert.name}
                      </p>
                      <Badge variant="destructive" size="sm">
                        {alert.quantity} {alert.unit}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => navigate('/providers')}
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 gap-1"
                    >
                      <MdShoppingCart size={14} /> Comprar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MdCheckCircle size={32} className="mx-auto text-success mb-2" />
                <p className="text-sm font-medium text-success">
                  Todo el stock dentro de niveles óptimos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

export default RecentDeliveries;
