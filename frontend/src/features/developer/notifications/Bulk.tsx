import React, { useState } from 'react';
import { Send, Mail, Users, Check, AlertTriangle, Filter } from 'lucide-react';

export default function Bulk() {
  const [recipients, setRecipients] = useState<'all' | 'admins' | 'technicians' | 'companies'>('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleSend = () => {
    if (!subject || !message) return;
    setIsSending(true);
    setSentCount(0);

    const totalRecipients = recipients === 'all' ? 1234 : 
                           recipients === 'admins' ? 45 :
                           recipients === 'technicians' ? 89 : 56;

    const interval = setInterval(() => {
      setSentCount(prev => {
        if (prev >= totalRecipients) {
          clearInterval(interval);
          setIsSending(false);
          return totalRecipients;
        }
        return prev + 50;
      });
    }, 200);
  };

  const recipientCounts = {
    all: 1234,
    admins: 45,
    technicians: 89,
    companies: 56
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Envío Masivo</h2>
        <p className="text-sm text-muted-foreground mt-1">Enviar notificaciones push o emails a todos los usuarios</p>
      </div>

      {/* Estadísticas de envíos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-primary">1,234</div>
          <div className="text-sm text-muted-foreground">Usuarios Totales</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-success">45</div>
          <div className="text-sm text-muted-foreground">Envíos Este Mes</div>
        </div>
        <div className="bg-card rounded-xl shadow-sm border border-border p-4">
          <div className="text-2xl font-bold text-purple-600">98%</div>
          <div className="text-sm text-muted-foreground">Tasa de Entrega</div>
        </div>
      </div>

      {/* Formulario de envío */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Crear Nueva Notificación</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Destinatarios</label>
            <div className="flex space-x-2">
              {(['all', 'admins', 'technicians', 'companies'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setRecipients(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    recipients === option
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground hover:bg-muted'
                  }`}
                >
                  {option === 'all' ? 'Todos' : option}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Se enviará a {recipientCounts[recipients]} usuarios
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tipo de Notificación</label>
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted">
                <Send className="w-4 h-4" />
                <span>Push</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Asunto de la notificación"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mensaje</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>

          {isSending && (
            <div className="bg-primary/5 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Send className="w-5 h-5 text-primary animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">Enviando notificaciones...</p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(sentCount / recipientCounts[recipients]) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-primary mt-1">{sentCount} / {recipientCounts[recipients]} enviados</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!subject || !message || isSending}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Enviando...' : 'Enviar Notificación'}</span>
          </button>
        </div>
      </div>

      {/* Historial de envíos */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Historial de Envíos</h3>
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </button>
        </div>
        <div className="space-y-3">
          {[
            { date: '2024-01-15 10:00', recipients: 'Todos', subject: 'Mantenimiento programado', status: 'delivered' },
            { date: '2024-01-14 15:30', recipients: 'Administradores', subject: 'Nuevas funciones disponibles', status: 'delivered' },
            { date: '2024-01-13 09:00', recipients: 'Técnicos', subject: 'Actualización de sistema', status: 'delivered' },
            { date: '2024-01-12 14:20', recipients: 'Empresas', subject: 'Recordatorio de pago', status: 'failed' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.date} • {item.recipients}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {item.status === 'delivered' ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-xs text-success">Entregado</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-destructive">Fallido</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
