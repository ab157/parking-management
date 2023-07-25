/* eslint-disable no-unused-vars */
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
} from "@carbon/react";
import { NoDataEmptyState } from "@carbon/ibm-products/lib/components";
import { Edit, Add } from "@carbon/icons-react";
import CreateTicketModal from "../CreateTicketModal/CreateTicketModal";
import { useEffect, useState, useContext, useCallback } from "react";
import { format } from "date-fns";
import TicketDetailsModal from "../TicketDetailsModal/TicketDetailsModal";
import "./TicketDataTable.scss";
import EditTicketModal from "../EditTicketModal/EditTicketModal";
import { AuthContext } from "../../context/AuthContext";
import { getHeadersForTicketsTable, getTickets } from "../../utils/tickets";
import { getAllUsers, getUserById } from "../../utils/users";

const TicketDataTable = () => {
  const [tickets, setTickets] = useState([]);
  const [formattedTickets, setFormattedTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user: sessionUser } = useContext(AuthContext);

  const pageSize = 5;

  const handleTicketClick = useCallback(
    (ticketId) => {
      const ticket = tickets.filter((item) => item.id === ticketId)[0];
      setSelectedTicket(ticket);
      setDetailsModalOpen(true);
    },
    [tickets]
  );

  const formatTickets = useCallback(
    (tickets, user) => {
      let modifiedTickets = [];
      modifiedTickets = tickets.map((item) => {
        return {
          ...item,
          parkingFrom: format(new Date(item.parkingFrom), "dd/MM/yy"),
          parkingTo: format(new Date(item.parkingTo), "dd/MM/yy "),
          actions: (
            <div>
              <Button
                kind="ghost"
                onClick={() => {
                  setSelectedTicket(item);
                  setEditModalOpen(true);
                }}
              >
                <Edit />
              </Button>
            </div>
          ),
        };
      });

      if (user?.role === "ADMIN") {
        modifiedTickets = modifiedTickets.map((item) => {
          const user = users.find((user) => user.id === item.userId);
          if (user) {
            return {
              ...item,
              userName: `${user?.first_name} ${user?.last_name}`,
            };
          }
        });
      }

      return modifiedTickets;
    },
    [users]
  );

  const getEmptyDataTable = useCallback(() => {
    return {
      id: "",
      userId: "",
      carNo: (
        <NoDataEmptyState
          size="lg"
          className="tickets_noDataState"
          action={{
            onClick: () => setCreateModalOpen(true),
            renderIcon: Add,
            iconDescription: "Add icon",
            text: "Create Ticket",
          }}
          subtitle="Create new Ticket"
          title="No Ticket"
        />
      ),
      parkingFrom: "",
      parkingTo: "",
      parkingSlot: "",
      actions: " ",
    };
  }, []);

  useEffect(() => {
    if (sessionUser) {
      getTickets((err, tickets) => {
        if (err) {
          return;
        }
        if (sessionUser?.role === "USER") {
          setTickets(
            tickets.filter((ticket) => ticket.userId === sessionUser?.id)
          );
        } else {
          setTickets(tickets);
        }
      });
    }

    if (sessionUser?.role === "ADMIN") {
      getAllUsers((err, users) => setUsers(users));
    }
  }, [sessionUser]);

  useEffect(() => {
    if (tickets.length > 0) {
      setFormattedTickets(formatTickets(tickets, sessionUser));
    } else {
      setFormattedTickets([getEmptyDataTable()]);
    }
  }, [sessionUser, tickets, formatTickets, getEmptyDataTable]);
  return (
    <div>
      <DataTable
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
                <Button onClick={() => setCreateModalOpen(true)}>
                  Create Ticket
                </Button>
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
      <Pagination
        page={currentPage}
        pageSize={pageSize}
        pageSizes={[5, 10, 20, 40, 50]}
        itemsPerPageText="Items per page:"
        totalItems={formattedTickets.length}
      />
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
    </div>
  );
};

export default TicketDataTable;
