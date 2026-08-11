import React, { useState } from 'react';
import { RefreshCw, HardDrive, AlertTriangle, Check, Upload, FileText } from 'lucide-react';

interface BackupFile {
  id: string;
  name: string;
  date: string;
  size: string;
}

export default function Restore() {
  const [backups] = useState<BackupFile[]>([
    {
      id: '1',
      name: 'backup_2024-01-15_02-00.sql',
      date: '2024-01-15 02:00:00',
      size: '2.5 GB'
    },
    {
      id: '2',
      name: 'backup_2024-01-14_02-00.sql',
      date: '2024-01-14 02:00:00',
      size: '2.4 GB'
    },
    {
      id: '3',
      name: 'backup_2024-01-13_15-30.sql',
      date: '2024-01-13 15:30:00',
      size: '2.3 GB'
    },
  ]);

  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleRestore = () => {
    if (!selectedBackup) return;
    setIsRestoring(true);
    setRestoreProgress(0);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUploadRestore = () => {
    if (!uploadFile) return;
    setIsRestoring(true);
    setRestoreProgress(0);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Restaurar Backup</h2>
        <p className="text-sm text-muted-foreground mt-1">Listado de backups disponibles para restauración</p>
      </div>

      {/* Advertencia */}
      <div className="bg-destructive/10 border border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-2">⚠️ Advertencia Importante</h4>
            <p className="text-sm text-red-800">
              Restaurar un backup reemplazará completamente la base de datos actual. 
              Esta acción no se puede deshacer. Se recomienda hacer un backup antes de restaurar.
            </p>
          </div>
        </div>
      </div>

      {/* Restaurar desde backups existentes */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Restaurar desde Backups Existentes</h3>
        <div className="space-y-3">
          {backups.map((backup) => (
            <div
              key={backup.id}
              onClick={() => setSelectedBackup(backup.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedBackup === backup.id
                  ? 'border-blue-500 bg-primary/5'
                  : 'border-border hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{backup.name}</p>
                    <p className="text-sm text-muted-foreground">{backup.date} • {backup.size}</p>
                  </div>
                </div>
                {selectedBackup === backup.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleRestore}
          disabled={!selectedBackup || isRestoring}
          className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
          <span>{isRestoring ? 'Restaurando...' : 'Restaurar Backup Seleccionado'}</span>
        </button>
      </div>

      {/* Progreso de restauración */}
      {isRestoring && (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            <div>
              <h3 className="font-semibold text-foreground">Restaurando Base de Datos</h3>
              <p className="text-sm text-muted-foreground">Por favor no cierre esta página</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-4 mb-2">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-300"
              style={{ width: `${restoreProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">{restoreProgress}% completado</p>
        </div>
      )}

      {/* Subir backup externo */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Restaurar desde Archivo Externo</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Arrastra un archivo SQL aquí o haz clic para seleccionar
          </p>
          <input
            type="file"
            accept=".sql"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Seleccionar Archivo</span>
          </label>
          {uploadFile && (
            <p className="mt-4 text-sm text-foreground font-medium">{uploadFile.name}</p>
          )}
        </div>
        {uploadFile && (
          <button
            onClick={handleUploadRestore}
            disabled={isRestoring}
            className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
            <span>{isRestoring ? 'Restaurando...' : 'Restaurar Archivo'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
