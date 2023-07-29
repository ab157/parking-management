import "./TicketPage.scss";
import TicketDataTable from "../TicketDataTable/TicketDataTable";
import { PageHeader } from "@carbon/ibm-products/lib/components";
import { Column, Grid } from "@carbon/react";
import { useState } from "react";
import CreateTicketModal from "../CreateTicketModal/CreateTicketModal";
import TicketDetailsModal from "../TicketDetailsModal/TicketDetailsModal";
import EditTicketModal from "../EditTicketModal/EditTicketModal";

const TicketPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        className="ticketsPage"
        title={{ text: "Parking Ticket Dashboard" }}
      />
      <Grid fullWidth>
        <Column lg={16}>
          <TicketDataTable
            selectTicket={setSelectedTicket}
            openCreateModal={setCreateModalOpen}
            openEditModal={setEditModalOpen}
            openDetailsModal={setDetailsModalOpen}
          />
        </Column>
      </Grid>
      {createModalOpen && (
        <CreateTicketModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
      {detailsModalOpen && (
        <TicketDetailsModal
          ticket={selectedTicket}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
        />
      )}
      {editModalOpen && (
        <EditTicketModal
          ticket={selectedTicket}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default TicketPage;
