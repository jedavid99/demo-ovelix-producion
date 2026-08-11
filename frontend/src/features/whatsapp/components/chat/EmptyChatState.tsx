import { MessageSquare } from 'lucide-react';

export const EmptyChatState = () => (
  <div className="flex flex-col h-full bg-gradient-to-br from-green-50/30 via-white to-green-50/30 dark:from-green-950/10 dark:via-gray-950/30 dark:to-green-950/10">
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-muted-foreground p-8">
        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <MessageSquare className="h-8 w-8 text-green-400/60" />
        </div>
        <p className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">Selecciona un contacto</p>
        <p className="text-sm text-success/60 dark:text-green-400/60">Para comenzar a chatear</p>
      </div>
    </div>
  </div>
);
