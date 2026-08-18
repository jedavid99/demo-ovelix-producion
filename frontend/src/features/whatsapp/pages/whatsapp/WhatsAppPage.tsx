import React from 'react';
import { ContactList } from '../../components/ContactList';
import { ChatArea } from '../../components/ChatArea';
import { NewChatModal } from '../../components/modals/NewChatModal';
import { SendCatalogModal } from '../../components/modals/SendCatalogModal';
import { SendOrderModal } from '../../components/modals/SendOrderModal';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import DisconnectedView from '../../components/whatsapp/DisconnectedView';
import ConnectedIndicator from '../../components/whatsapp/ConnectedIndicator';
import LinkingView from '../../components/whatsapp/LinkingView';
import { useWhatsApp } from '../../hooks/whatsapp/useWhatsApp';
import { mockProducts } from '../../constants/whatsapp/whatsapp.constants';

export default function WhatsAppPage() {
  const qr = useWhatsApp();

  if (qr.loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Conectando con WhatsApp...</p>
        </div>
      </div>
    );
  }

  if (qr.isLinking) {
    return <LinkingView />;
  }

  if (!qr.isConnected) {
    return (
      <div className="h-full ">
        <DisconnectedView
          qrCode={qr.qrCode}
          qrImageUrl={qr.qrImageUrl}
          loading={qr.loading}
          connectionError={qr.connectionError}
          pairingCode={qr.pairingCode}
          onGenerateQR={qr.handleGenerateQR}
          onRegenerateQR={qr.handleRegenerateQR}
          onLogout={qr.handleLogout}
          onRequestPairingCode={qr.handleRequestPairingCode}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      {qr.isConnected && <ConnectedIndicator onLogout={qr.handleLogout} />}
      <div className="flex flex-col lg:flex-row h-full min-h-0">
          <div className={`w-full lg:w-80 lg:flex-shrink-0 ${qr.selectedContact ? 'hidden lg:block' : ''}`}>
            <ContactList
              contacts={qr.activeChats}
              selectedContact={qr.selectedContact}
              onSelectContact={qr.handleSelectContact}
              searchTerm={qr.searchTerm}
              onSearchChange={qr.setSearchTerm}
              onNewChat={() => qr.setNewChatOpen(true)}
              onArchiveChat={qr.handleArchiveChat}
              onUnarchiveChat={qr.handleUnarchiveChat}
              onDeleteChat={qr.handleDeleteChat}
              archivedChats={qr.archivedChats}
              showArchived={qr.showArchived}
              onToggleArchived={() => qr.setShowArchived(!qr.showArchived)}
              loading={qr.loadingContacts}
            />
          </div>

          <div className={`flex-1 min-w-0 ${qr.selectedContact ? '' : 'hidden lg:block'}`}>
            <ChatArea
              selectedContact={qr.selectedContact}
              onBack={() => qr.setSelectedContact(null)}
              messages={qr.selectedContact ? qr.getFilteredMessages(qr.selectedContact.id) : []}
              onSendMessage={qr.handleSendMessage}
              onSendAttachment={qr.handleSendAttachment}
              onRemoveAttachment={qr.handleRemoveAttachment}
              attachments={qr.attachments}
              onSendCatalog={() => qr.setCatalogOpen(true)}
              onRequestQuote={() => {
                if (qr.selectedContact) {
                  qr.handleSendMessage('📝 Hola, me gustaría solicitar una cotización para...');
                }
              }}
              onSendServiceOrder={() => qr.setOrderOpen(true)}
              onLoadMoreMessages={qr.handleLoadMoreMessages}
              hasMoreMessages={qr.selectedContact ? (qr.messagePagination[qr.selectedContact.id]?.page || 0) < (qr.messagePagination[qr.selectedContact.id]?.totalPages || 1) : false}
              isLoadingMore={qr.selectedContact ? qr.messagePagination[qr.selectedContact.id]?.loading || false : false}
              contactStatus={qr.selectedContact ? qr.getContactStatus(qr.selectedContact) : 'offline'}
              lastSeen={qr.selectedContact ? qr.selectedContact.lastInteraction : undefined}
              filterDate={qr.filterDate}
              filterKeyword={qr.filterKeyword}
              onFilterDateChange={qr.setFilterDate}
              onFilterKeywordChange={qr.setFilterKeyword}
              onClearFilters={() => {
                qr.setFilterDate(null);
                qr.setFilterKeyword('');
              }}
              loading={qr.loadingMessages}
            />
          </div>
        </div>

      <NewChatModal
        open={qr.newChatOpen}
        onClose={() => qr.setNewChatOpen(false)}
        onSelectContact={qr.handleSelectContact}
        availableContacts={qr.contacts}
      />

      <SendCatalogModal
        open={qr.catalogOpen}
        onClose={() => qr.setCatalogOpen(false)}
        onSend={qr.handleSendCatalog}
        availableProducts={mockProducts}
      />

      <SendOrderModal
        open={qr.orderOpen}
        onClose={() => qr.setOrderOpen(false)}
        onSend={qr.handleSendOrder}
        availableOrders={qr.serviceOrders}
        loading={qr.loadingServiceOrders}
        error={qr.serviceOrdersError}
      />

      <ConfirmDialog
        open={qr.deleteConfirmOpen}
        onOpenChange={qr.setDeleteConfirmOpen}
        title="Eliminar chat"
        description={qr.contactToDelete ? `¿Estás seguro de que deseas eliminar el chat con ${qr.contactToDelete.name}? Esta acción eliminará todos los mensajes de la base de datos.` : ''}
        onConfirm={qr.confirmDeleteChat}
      />
    </div>
  );
}
