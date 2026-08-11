import React, { useState } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { toast } from '@/shared/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface ApiToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  lastUsed: string;
  expiresAt: string;
  scopes: string[];
  active: boolean;
}

export default function Tokens() {
  const [tokens, setTokens] = useState<ApiToken[]>([
    {
      id: '1',
      name: 'Token de Producción',
      token: 'sk_live_51MzB2...xyz',
      createdAt: '2024-01-10',
      lastUsed: '2024-01-15 10:30:00',
      expiresAt: '2024-07-10',
      scopes: ['read', 'write'],
      active: true
    },
    {
      id: '2',
      name: 'Token de Desarrollo',
      token: 'sk_test_51MzB2...abc',
      createdAt: '2024-01-05',
      lastUsed: '2024-01-14 15:45:00',
      expiresAt: '2024-04-05',
      scopes: ['read'],
      active: true
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'revoke' | 'delete'; tokenId: string } | null>(null);

  const toggleTokenVisibility = (id: string) => {
    setVisibleTokens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleDelete = (id: string) => {
    setConfirmAction({ type: 'delete', tokenId: id });
  };

  const handleRevoke = (id: string) => {
    setConfirmAction({ type: 'revoke', tokenId: id });
  };

  const confirmRevoke = () => {
    if (confirmAction) {
      setTokens(tokens.map(t => t.id === confirmAction.tokenId ? { ...t, active: false } : t));
      toast({ title: 'Éxito', description: 'Token revocado correctamente.' });
    }
    setConfirmAction(null);
  };

  const confirmDelete = () => {
    if (confirmAction) {
      setTokens(tokens.filter(t => t.id !== confirmAction.tokenId));
      toast({ title: 'Éxito', description: 'Token eliminado correctamente.' });
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tokens de API</h2>
          <p className="text-sm text-muted-foreground mt-1">Generar y revocar tokens para integraciones externas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Token</span>
        </button>
      </div>

      {/* Lista de tokens */}
      <div className="space-y-4">
        {tokens.map((token) => (
          <div key={token.id} className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${token.active ? 'bg-green-100' : 'bg-muted'}`}>
                  <Key className={`w-6 h-6 ${token.active ? 'text-success' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{token.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {token.active ? 'Activo' : 'Revocado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {token.active && (
                  <button
                    onClick={() => handleRevoke(token.id)}
                    className="p-2 text-yellow-600 hover:bg-warning/10 rounded"
                    title="Revocar"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(token.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <code className={`flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono ${
                  visibleTokens.has(token.id) ? '' : 'blur-sm'
                }`}>
                  {token.token}
                </code>
                <button
                  onClick={() => toggleTokenVisibility(token.id)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded"
                >
                  {visibleTokens.has(token.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToken(token.token)}
                  className="p-2 text-muted-foreground hover:bg-muted rounded"
                >
                  {copiedToken === token.token ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Creado</p>
                  <p className="text-foreground">{token.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Último uso</p>
                  <p className="text-foreground">{token.lastUsed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expira</p>
                  <p className="text-foreground">{token.expiresAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Permisos</p>
                  <div className="flex space-x-1">
                    {token.scopes.map((scope) => (
                      <span key={scope} className="text-xs bg-primary/10 text-blue-800 px-2 py-0.5 rounded">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear token */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre del Token</label>
              <input
                type="text"
                placeholder="Ej: Token de Integración"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Permisos</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-foreground">Read (Lectura)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-foreground">Write (Escritura)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-foreground">Admin (Administración)</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Expiración</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent">
                <option value="30">30 días</option>
                <option value="90">90 días</option>
                <option value="180">6 meses</option>
                <option value="365">1 año</option>
                <option value="never">Nunca</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Crear Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Información de seguridad */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Seguridad de Tokens</h4>
            <p className="text-sm text-yellow-800">
              Los tokens de API otorgan acceso completo a tu cuenta. Nunca los compartas públicamente.
              Si un token es comprometido, revócalo inmediatamente y genera uno nuevo.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
        title={confirmAction?.type === 'revoke' ? 'Revocar token' : 'Eliminar token'}
        description={
          confirmAction?.type === 'revoke'
            ? '¿Estás seguro de que deseas revocar este token? La integración que lo usa dejará de funcionar inmediatamente.'
            : '¿Estás seguro de que deseas eliminar este token de forma permanente?'
        }
        confirmLabel={confirmAction?.type === 'revoke' ? 'Revocar' : 'Eliminar'}
        onConfirm={confirmAction?.type === 'revoke' ? confirmRevoke : confirmDelete}
      />
    </div>
  );
}
