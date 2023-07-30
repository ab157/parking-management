/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext, useCallback } from "react";
import { PropTypes } from "prop-types";
import { format } from "date-fns";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Link,
  Pagination,
  Tag,
} from "@carbon/react";
import { Edit, Add } from "@carbon/icons-react";
import { NoDataEmptyState } from "@carbon/ibm-products/lib/components";
import { AuthContext } from "../../context/AuthContext";
import { getHeadersForTicketsTable } from "../../utils/tickets";
import "./TicketDataTable.scss";

const TicketDataTable = ({
  tickets,
  users,
  selectTicket,
  openCreateModal,
  openEditModal,
  openDetailsModal,
  reviewTicketHandler,
  sendToReview,
  approveTicketHandler,
}) => {
  const [formattedTickets, setFormattedTickets] = useState([]);
  const { user: sessionUser } = useContext(AuthContext);

  // For Details Modal
  const handleTicketClick = useCallback(
    (ticketId) => {
      const ticket = tickets.filter((item) => item.id === ticketId)[0];
      selectTicket(ticket);
      openDetailsModal(true);
    },
    [tickets, selectTicket, openDetailsModal]
  );

  // Formatting Tickets for Data Table
  const formatTickets = useCallback(
    (tickets, user) => {
      let modifiedTickets = [];
      // Common fields in modified tickets
      modifiedTickets = tickets.map((item) => {
        return {
          ...item,
          parkingFrom: format(new Date(item.parkingFrom), "dd/MM/yy"),
          parkingTo: format(new Date(item.parkingTo), "dd/MM/yy "),
          timeFrom: format(new Date(item.timeFrom), "hh:mm a"),
          timeTill: format(new Date(item.timeTill), "hh:mm a"),
          status: (
            <Tag
              size="md"
              type={
                item.status.reviewSuccess
                  ? "teal"
                  : item.status.approveSuccess
                  ? "green"
                  : "blue"
              }
              title={item.status.type}
            >
              {item.status.type}
            </Tag>
          ),
          // User actions
          actions: !item.status.isApproved && (
            <div>
              <Button
                kind="ghost"
                disabled={item.status.sendToReview}
                onClick={() => {
                  selectTicket(item);
                  openEditModal(true);
                }}
              >
                <Edit />
              </Button>
              {!item.status.sendToReview && (
                <Button kind="ghost" onClick={() => sendToReview(item)}>
                  Send To Review
                </Button>
              )}
            </div>
          ),
        };
      });

      // If Role is USER
      if (user?.role === "USER") {
        return modifiedTickets.filter(
          (item) => item.createdBy.userId === user.id
        );
      }

      // If Role is Reviewer
      if (user?.role === "REVIEWER") {
        modifiedTickets = modifiedTickets.map((item) => {
          const user = users.find((user) => user.id === item.createdBy.userId);
          // To retrieve original ticket
          const originalTicket = tickets.find(
            (ticket) => ticket.id === item.id
          );
          if (user) {
            return {
              ...item,
              actions: originalTicket.status.sendToReview && (
                <div>
                  <Button
                    kind="ghost"
                    disabled={originalTicket.status.reviewSuccess}
                    onClick={() => reviewTicketHandler(originalTicket, true)}
                  >
                    {originalTicket.status.isReviewed
                      ? "Reviewed"
                      : "Mark as Review"}
                  </Button>

                  <Button
                    kind="ghost"
                    disabled={originalTicket.status.reviewSuccess}
                    onClick={() => reviewTicketHandler(originalTicket, false)}
                  >
                    Send Back to Edit
                  </Button>
                </div>
              ),
              userName: item?.createdFor
                ? `${item?.createdFor?.name}`
                : `${user?.first_name} ${user?.last_name}`,
            };
          }
        });
      }

      // If Role is Admin
      if (user?.role === "ADMIN") {
        modifiedTickets = modifiedTickets.map((item) => {
          const user = users.find((user) => user.id === item.createdBy.userId);
          const originalTicket = tickets.find(
            (ticket) => ticket.id === item.id
          );
          if (user) {
            return {
              ...item,
              actions: originalTicket.status.sendToApproval && (
                <div>
                  <Button
                    kind="ghost"
                    disabled={originalTicket.status.approveSuccess}
                    onClick={() => approveTicketHandler(originalTicket, true)}
                  >
                    {originalTicket.status.isApproved
                      ? "Ticket Approved"
                      : "Approve Ticket"}
                  </Button>
                  <Button
                    kind="ghost"
                    disabled={originalTicket.status.approveSuccess}
                    onClick={() => approveTicketHandler(originalTicket, false)}
                  >
                    Send Back to Review
                  </Button>
                </div>
              ),
              userName: item?.createdFor
                ? `${item?.createdFor?.name}`
                : `${user?.first_name} ${user?.last_name}`,
            };
          }
        });
      }

      return modifiedTickets;
    },
    [
      users,
      openEditModal,
      selectTicket,
      reviewTicketHandler,
      sendToReview,
      approveTicketHandler,
    ]
  );

  // For Empty data table
  const getEmptyDataTable = useCallback(() => {
    return {
      id: "",
      carNo: (
        <NoDataEmptyState
          size="lg"
          className="tickets_noDataState"
          action={
            sessionUser?.role === "USER" && {
              onClick: () => openCreateModal(true),
              renderIcon: Add,
              iconDescription: "Add icon",
              text: "Create Ticket",
            }
          }
          subtitle={
            sessionUser?.role === "USER"
              ? "Create new Ticket"
              : sessionUser?.role === "REVIEWER"
              ? ""
              : ""
          }
          title="No Ticket"
        />
      ),
      parkingFrom: "",
      timeFrom: "",
      parkingTo: "",
      timeTill: "",
      parkingSlot: "",
      actions: "",
    };
  }, [openCreateModal, sessionUser?.role]);

  // For setting formatted ticket on page load
  useEffect(() => {
    const ticketsFormatted = formatTickets(tickets, sessionUser);
    if (ticketsFormatted.length !== 0) {
      setFormattedTickets(ticketsFormatted);
    } else {
      setFormattedTickets([getEmptyDataTable()]);
    }
  }, [tickets, formatTickets, getEmptyDataTable, sessionUser]);

  return (
    <div>
      {formattedTickets && (
        <DataTable
          id="ticketsDataTable"
          rows={formattedTickets}
          headers={getHeadersForTicketsTable(sessionUser?.role)}
        >
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            onInputChange,
          }) => (
            <TableContainer title="Tickets">
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={(evt) => onInputChange(evt)}
                    disabled={!tickets.length}
                  />
                  {sessionUser?.role === "USER" && (
                    <Button onClick={() => openCreateModal(true)}>
                      Create Ticket
                    </Button>
                  )}
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={index} {...getRowProps({ row })}>
                      {row.cells.map((cell, index) => (
                        <TableCell key={index}>
                          {cell.info.header === "id" ? (
                            <Link onClick={() => handleTicketClick(row.id)}>
                              {cell.value}
                            </Link>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      )}
    </div>
  );
};

// Prop validation for TicketDataTable
TicketDataTable.propTypes = {
  tickets: PropTypes.array,
  users: PropTypes.array,
  selectTicket: PropTypes.func,
  openCreateModal: PropTypes.func,
  openEditModal: PropTypes.func,
  openDetailsModal: PropTypes.func,
  reviewTicketHandler: PropTypes.func,
  sendToReview: PropTypes.func,
  approveTicketHandler: PropTypes.func,
};

export default TicketDataTable;
