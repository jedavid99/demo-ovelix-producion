import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, X } from 'lucide-react';
import { UseQuickRepairReturn } from '../../types/quickRepair/quickRepair.types';

const QuickRepairStep1: React.FC<UseQuickRepairReturn> = ({
  clientSearch, setClientSearch,
  clients, selectedClient, setSelectedClient, showClientDropdown, showNewClientForm, setShowNewClientForm, newClient, setNewClient, creatingClient,
  handleClientSelect, handleCreateClient, handleShowNewClientForm,
}) => (
  <motion.div
    key="step1"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.25 }}
    className="space-y-4"
  >
    <div>
      <h3 className="text-lg font-bold text-foreground mb-1">Seleccionar Cliente</h3>
      <p className="text-sm text-muted-foreground mb-4">Busca y selecciona el cliente que trae el dispositivo</p>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            aria-label="Buscar cliente"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Buscar por nombre, DNI o teléfono..."
            className="w-full pl-9 pr-3 py-2.5 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
          />
        </div>

        <AnimatePresence>
          {showClientDropdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 w-full mt-1 bg-card border-2 border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {clients.length > 0 ? (
                clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    className="w-full px-3 py-2.5 text-left hover:bg-primary/5 border-b border-border last:border-b-0 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{client.nombre_completo}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          {client.dni && <span>DNI: {client.dni}</span>}
                          {client.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {client.telefono}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-3">No se encontraron clientes</p>
                  <button
                    onClick={handleShowNewClientForm}
                    className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary transition-colors text-sm font-medium"
                  >
                    Crear nuevo cliente
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showNewClientForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-muted border-2 border-border rounded-lg"
        >
          <h4 className="font-semibold text-foreground mb-3">Registrar Nuevo Cliente</h4>
          <div className="space-y-3">
            <div>
              <label htmlFor="qr-new-name" className="block text-sm font-medium text-foreground mb-1">Nombre Completo *</label>
              <input
                id="qr-new-name"
                type="text"
                value={newClient.nombre_completo}
                onChange={(e) => setNewClient({ ...newClient, nombre_completo: e.target.value })}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div>
              <label htmlFor="qr-new-dni" className="block text-sm font-medium text-foreground mb-1">DNI</label>
              <input
                id="qr-new-dni"
                type="text"
                value={newClient.dni}
                onChange={(e) => setNewClient({ ...newClient, dni: e.target.value })}
                placeholder="Ej: 12345678"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div>
              <label htmlFor="qr-new-phone" className="block text-sm font-medium text-foreground mb-1">Teléfono *</label>
              <input
                id="qr-new-phone"
                type="text"
                value={newClient.telefono}
                onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                placeholder="Ej: 11-1234-5678"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div>
              <label htmlFor="qr-new-email" className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                id="qr-new-email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="Ej: juan@email.com"
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateClient}
                disabled={creatingClient}
                className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingClient ? 'Creando...' : 'Crear Cliente'}
              </button>
              <button
                onClick={() => {
                  setShowNewClientForm(false);
                  setNewClient({ nombre_completo: '', dni: '', telefono: '', email: '' });
                }}
                className="py-2 px-4 bg-muted text-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {selectedClient && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-primary/5 border border-blue-200 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{selectedClient.nombre_completo}</p>
              {selectedClient.telefono && (
                <p className="text-xs text-muted-foreground">{selectedClient.telefono}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedClient(null);
              setClientSearch('');
            }}
            className="p-1 hover:bg-card rounded-lg"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </div>
  </motion.div>
);

export default QuickRepairStep1;
