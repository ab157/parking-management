import "./TicketPage.scss";
import TicketDataTable from "../TicketDataTable/TicketDataTable";
import { PageHeader } from "@carbon/ibm-products/lib/components";
import { Column, Grid } from "@carbon/react";
import { useState, useEffect, useContext } from "react";
import CreateTicketModal from "../CreateTicketModal/CreateTicketModal";
import TicketDetailsModal from "../TicketDetailsModal/TicketDetailsModal";
import EditTicketModal from "../EditTicketModal/EditTicketModal";
import { getTickets } from "../../utils/tickets";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers } from "../../utils/users";

const TicketPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const { user: sessionUser } = useContext(AuthContext);

  useEffect(() => {
    console.log("TicketsPage");
    getTickets((err, tickets) => {
      if (err) {
        return;
      }
      setTickets(tickets);
    });
  }, [createModalOpen, editModalOpen]);

  useEffect(() => {
    if (sessionUser?.role === "ADMIN" || sessionUser?.role === "REVIEWER") {
      getAllUsers((err, users) => {
        if (err) return;
        setUsers(users);
      });
    }
  }, [sessionUser?.role]);

  return (
    <>
      <PageHeader
        className="ticketsPage"
        title={{ text: "Parking Ticket Dashboard" }}
      />
      <Grid fullWidth>
        <Column lg={16}>
          <TicketDataTable
            tickets={tickets}
            users={users}
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
