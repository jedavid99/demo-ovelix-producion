import React from 'react';
import { Check, X, Eye, Edit, ExternalLink } from 'lucide-react';
import { EMAIL_TYPE_ICONS, WHATSAPP_TYPE_ICONS, EMAIL_TYPE_BADGES, WHATSAPP_TYPE_BADGES, formatLabel } from '../../constants/templates/templates.constants';

interface TemplateCardProps {
  template: any;
  iconType: 'email' | 'whatsapp' | 'page';
  onPreview: () => void;
  onEdit: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, iconType, onPreview, onEdit }) => {
  const icons = iconType === 'whatsapp' ? WHATSAPP_TYPE_ICONS : EMAIL_TYPE_ICONS;
  const badges = iconType === 'whatsapp' ? WHATSAPP_TYPE_BADGES : EMAIL_TYPE_BADGES;
  const IconComponent = icons[template.type] || icons.default;
  const badgeClass = badges[template.type] || badges.default || 'bg-muted text-foreground';
  const colorClass = iconType === 'whatsapp' ? 'text-success' : iconType === 'page' ? 'text-muted-foreground' : 'text-primary';

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={colorClass}>
            {IconComponent && <IconComponent className="w-5 h-5" strokeWidth={1.5} />}
          </div>
          <div>
            <h4 className="font-medium text-foreground">{template.name}</h4>
            {template.subject && <p className="text-sm text-muted-foreground line-clamp-1">{template.subject}</p>}
            {template.message && <p className="text-sm text-muted-foreground line-clamp-1">{template.message}</p>}
            {!template.subject && !template.message && <p className="text-sm text-muted-foreground">Vista previa de página</p>}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${badgeClass}`}>
          {formatLabel(template.type)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Modificado: {template.updated_at}</span>
        <div className="flex items-center gap-1">
          {template.active ? (
            <><Check className="w-3.5 h-3.5 text-success" /><span className="text-success">Activa</span></>
          ) : (
            <><X className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-muted-foreground">Inactiva</span></>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={onPreview} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-lg hover:bg-muted text-sm transition-colors">
          <Eye className="w-4 h-4" />Vista
        </button>
        <button onClick={onEdit} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          iconType === 'whatsapp' ? 'bg-success text-white hover:bg-success/90' : iconType === 'page' ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-primary text-white hover:bg-primary-hover'
        }`}>
          {iconType === 'page' ? <ExternalLink className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {iconType === 'page' ? 'Abrir' : 'Editar'}
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
