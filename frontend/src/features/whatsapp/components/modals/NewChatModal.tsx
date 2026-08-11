import React, { useState } from 'react';
import { Search, User, Building2, X, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { Contact } from '../../whatsapp.types';

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
  availableContacts: Contact[];
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  open,
  onClose,
  onSelectContact,
  availableContacts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');


  const filteredContacts = availableContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );


  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] p-0 gap-0 bg-background border-green-200/60 dark:border-green-800/30 shadow-xl rounded-xl overflow-hidden">
        {/* Header con gradiente WhatsApp */}
        <DialogHeader className="p-6 pb-3 border-b border-green-200/50 dark:border-green-800/30 bg-gradient-to-r from-green-50/50 to-white dark:from-green-950/20 dark:to-gray-950">
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-success dark:text-green-400" />
            </div>
            <div>
              <span className="font-semibold text-green-700 dark:text-green-300">Nuevo chat</span>
              <p className="text-xs font-normal text-success/70 dark:text-green-400/70 mt-0.5">
                Selecciona un cliente del sistema para comenzar
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Búsqueda mejorada */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400/70" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              aria-label="Buscar por nombre o teléfono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-10 bg-card/80 dark:bg-card/80 border-green-200/50 dark:border-green-800/30 focus-visible:ring-2 focus-visible:ring-green-400/40 focus-visible:border-green-400/40 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <X className="h-4 w-4 text-green-400/70" />
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-between text-xs text-success/70 dark:text-green-400/70">
            <span>
              {filteredContacts.length} {filteredContacts.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
            </span>
            {searchTerm && filteredContacts.length === 0 && (
              <span className="text-destructive/70">No coincide con la búsqueda</span>
            )}
          </div>

          {/* Lista de contactos */}
          <ScrollArea className="h-64 pr-2 -mr-2">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-success/70 dark:text-green-400/70 py-12">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-green-400/60" />
                </div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  {searchTerm ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
                </p>
                <p className="text-xs text-success/60 dark:text-green-400/60 mt-1">
                  {searchTerm ? 'Intenta con otra búsqueda' : 'Agrega clientes al sistema primero'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      onSelectContact(contact);
                      onClose();
                    }}
                    className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-success/10/70 dark:hover:bg-green-900/20 hover:shadow-sm border border-transparent hover:border-green-200/50 dark:hover:border-green-800/30 group"
                  >
                    <Avatar className="h-11 w-11 ring-2 ring-green-500/20 shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-green-500/20 to-green-500/5 text-success dark:text-green-400">
                        {contact.type === 'client' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Building2 className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate text-foreground dark:text-muted-foreground">{contact.name}</p>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-2 py-0 h-5 font-medium flex-shrink-0 border-0 bg-green-100/60 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                        >
                          {contact.type === 'client' ? 'Cliente' : 'Proveedor'}
                        </Badge>
                      </div>
                      <p className="text-xs text-success/70 dark:text-green-400/70 truncate mt-0.5">
                        {contact.phone}
                      </p>
                    </div>
                    {/* Flecha indicadora en hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-success">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer con acción */}
        <DialogFooter className="p-6 pt-3 border-t border-green-200/30 dark:border-green-800/20 bg-green-50/30 dark:bg-green-950/20">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-success/70 dark:text-green-400/70 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};