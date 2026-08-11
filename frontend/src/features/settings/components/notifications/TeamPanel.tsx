import { Circle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { DemoNotice } from '@/shared/components/DemoNotice';
import type { TeamMember, Ticket, ActiveTab } from '../../types/notifications/notifications.types';

interface TeamPanelProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  teamMembers: TeamMember[];
  tickets: Ticket[];
  selectedTicket: string;
  onTicketSelect: (id: string) => void;
}

export const TeamPanel = ({ activeTab, onTabChange, teamMembers, tickets, selectedTicket, onTicketSelect }: TeamPanelProps) => (
  <Card>
    <div className="flex border-b border-border">
      <button onClick={() => onTabChange('equipo')}
        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'equipo' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
        Equipo
      </button>
      <button onClick={() => onTabChange('tickets')}
        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tickets' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
        Tickets
      </button>
    </div>
    <CardContent className="p-3">
      {activeTab === 'equipo' ? (
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div key={member.name} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
              <div className="relative">
                <img src={member.avatar} alt={member.name} loading="lazy" className="w-10 h-10 rounded-lg object-cover" />
                {member.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-background rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{member.status}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <DemoNotice
            title="Tickets en modo demo"
            description="La gestión de tickets no está conectada al backend. Los datos mostrados son de ejemplo."
            className="mb-2"
          />
          {tickets.map(ticket => (
            <div key={ticket.id} onClick={() => onTicketSelect(ticket.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTicket === ticket.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted border border-transparent'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{ticket.id}</span>
                <Badge variant={ticket.priority === 'High' ? 'destructive' : ticket.priority === 'Medium' ? 'default' : 'secondary'} className="text-[10px]">
                  {ticket.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{ticket.title}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Circle size={8} className="fill-green-500 text-success" />
                  {ticket.active} activos
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="text-muted-foreground">{ticket.device}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
