import React from 'react';
import { Mail } from 'lucide-react';

const VariablesSection: React.FC = () => (
  <div className="bg-primary/5 border border-blue-200 rounded-xl p-6">
    <div className="flex items-start space-x-3">
      <Mail className="w-5 h-5 text-primary mt-0.5" />
      <div>
        <h4 className="font-semibold text-primary mb-2">Variables Disponibles</h4>
        <p className="text-sm text-blue-800">
          Puedes usar las siguientes variables en tus plantillas:
          <br />
          {['name', 'email', 'empresa', 'link', 'date', 'time', 'order'].map(v => (
            <code key={v} className="bg-primary/10 px-2 py-1 rounded mt-2 inline-block mx-0.5">{`{{${v}}}`}</code>
          ))}
        </p>
      </div>
    </div>
  </div>
);

export default VariablesSection;
