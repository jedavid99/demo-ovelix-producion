import { MdSearch, MdFileDownload } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { STATUS_FILTERS } from '../constants';

interface OrderFiltersProps {
  searchQuery: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onExport: () => void;
}

export function OrderFilters({ searchQuery, selectedStatus, onSearchChange, onStatusChange, onExport }: OrderFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número o proveedor..."
              aria-label="Buscar por número o proveedor"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(status => (
              <Badge
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onStatusChange(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
          <Button variant="outline" onClick={onExport}>
            <MdFileDownload className="mr-2" />
            Exportar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
