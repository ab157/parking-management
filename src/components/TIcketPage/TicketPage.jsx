import "./TicketPage.scss";
import TicketDataTable from "../TicketDataTable/TicketDataTable";
import { PageHeader } from "@carbon/ibm-products/lib/components";
import { Column, Grid } from "@carbon/react";
import { useState, useEffect, useContext } from "react";
import CreateTicketModal from "../CreateTicketModal/CreateTicketModal";
import TicketDetailsModal from "../TicketDetailsModal/TicketDetailsModal";
import EditTicketModal from "../EditTicketModal/EditTicketModal";
import { editTicket, getTickets } from "../../utils/tickets";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers } from "../../utils/users";

const TicketPage = () => {
  const [selectedTicket, setSelectedTicket] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [parkingSlots, setParkingSlots] = useState([]);
  const { user: sessionUser } = useContext(AuthContext);

  useEffect(() => {
    getTickets((err, tickets) => {
      if (err) {
        return;
      }
      setTickets(tickets);
    });
  }, [createModalOpen, editModalOpen, selectedTicket]);

  useEffect(() => {
    if (sessionUser?.role === "ADMIN" || sessionUser?.role === "REVIEWER") {
      getAllUsers((err, users) => {
        if (err) return;
        setUsers(users);
      });
    }
  }, [sessionUser?.role]);

  useEffect(() => {
    const slotsArray = tickets.map((ticket) => {
      return {
        label: ticket.parkingSlot,
        occupiedFrom: ticket.timeFrom,
        occupiedTill: ticket.timeTill,
      };
    });

    setParkingSlots(slotsArray);
  }, [tickets]);

  function approveHandler(ticket, isTicketApproved) {
    if (isTicketApproved) {
      const updatedTicket = {
        ...ticket,
        status: {
          ...ticket.status,
          type: "Approved",
          sendToReview: true,
          isReviewed: true,
          reviewSuccess: true,
          sendToApproval: true,
          isApproved: true,
          approveSuccess: true,
        },
      };

      editTicket(updatedTicket, (err, ticket) => {
        if (err) {
          return;
        }
        setSelectedTicket(ticket);
      });
    } else {
      const updatedTicket = {
        ...ticket,
        status: {
          ...ticket.status,
          type: "Re-review requested",
          isReviewed: false,
          reviewSuccess: false,
          sendToApproval: false,
          isApproved: false,
          approveSuccess: false,
        },
      };

      editTicket(updatedTicket, (err, ticket) => {
        if (err) {
          return;
        }
        setSelectedTicket(ticket);
      });
    }
  }

  function reviewHandler(ticket, isTicketReviewed) {
    if (isTicketReviewed) {
      const updatedTicket = {
        ...ticket,
        status: {
          ...ticket.status,
          type: "Under Approval",
          isReviewed: true,
          reviewSuccess: true,
          sendToApproval: true,
        },
      };
      editTicket(updatedTicket, (err, ticket) => {
        if (err) {
          return;
        }
        setSelectedTicket(ticket);
      });
    } else {
      const updatedTicket = {
        ...ticket,
        status: {
          ...ticket.status,
          type: "Edit requested",
          sendToReview: false,
          isReviewed: false,
          reviewSuccess: false,
        },
      };
      editTicket(updatedTicket, (err) => {
        if (err) {
          return;
        }
        setSelectedTicket(ticket);
      });
    }
  }

  function sendToReviewHandler(ticket) {
    const updatedTicket = {
      ...ticket,
      status: {
        ...ticket.status,
        type: "Under Review",
        sendToReview: true,
        isReviewed: false,
        reviewSuccess: null,
      },
    };
    editTicket(updatedTicket, (err, t) => {
      if (err) {
        return;
      }

      setSelectedTicket(t);
    });
  }
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
            reviewTicketHandler={reviewHandler}
            sendToReview={sendToReviewHandler}
            approveTicketHandler={approveHandler}
          />
        </Column>
      </Grid>
      {createModalOpen && (
        <CreateTicketModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          occupiedSlots={parkingSlots}
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
          occupiedSlots={parkingSlots}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default TicketPage;
