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
} from "@carbon/react";
import { Edit, Add } from "@carbon/icons-react";
import { NoDataEmptyState } from "@carbon/ibm-products/lib/components";
import { AuthContext } from "../../context/AuthContext";
import { getHeadersForTicketsTable, getTickets } from "../../utils/tickets";
import { getAllUsers } from "../../utils/users";
import "./TicketDataTable.scss";

const TicketDataTable = ({
  selectTicket,
  openCreateModal,
  openEditModal,
  openDetailsModal,
}) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [formattedTickets, setFormattedTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user: sessionUser } = useContext(AuthContext);
  const pageSize = 5;

  const handleTicketClick = useCallback(
    (ticketId) => {
      const ticket = tickets.filter((item) => item.id === ticketId)[0];
      selectTicket(ticket);
      openDetailsModal(true);
    },
    [tickets, selectTicket, openDetailsModal]
  );

  const formatTickets = useCallback(
    (tickets, user) => {
      let modifiedTickets = [];
      modifiedTickets = tickets.map((item) => {
        return {
          ...item,
          parkingFrom: format(new Date(item.parkingFrom), "dd/MM/yy"),
          parkingTo: format(new Date(item.parkingTo), "dd/MM/yy "),
          timeFrom: format(new Date(item.timeFrom), "hh:mm a"),
          timeTill: format(new Date(item.timeTill), "hh:mm a"),
          actions: (
            <div>
              <Button
                kind="ghost"
                onClick={() => {
                  selectTicket(item);
                  openEditModal(true);
                }}
              >
                <Edit />
              </Button>
            </div>
          ),
        };
      });

      if (user?.role === "USER") {
        return modifiedTickets.filter(
          (item) => item.createdBy.userId === user.id
        );
      }

      if (user?.role === "REVIEWER") {
        modifiedTickets = modifiedTickets.map((item) => {
          const user = users.find((user) => user.id === item.createdBy.userId);
          if (user) {
            return {
              ...item,
              actions: (
                <div>
                  <Button kind="ghost">Mark as Reviewed</Button>
                  <Button kind="ghost">Send Back to Edit</Button>
                </div>
              ),
              userName: item?.createdFor
                ? `${item?.createdFor?.name}`
                : `${user?.first_name} ${user?.last_name}`,
            };
          }
        });
      }

      if (user?.role === "ADMIN") {
        modifiedTickets = modifiedTickets.map((item) => {
          const user = users.find((user) => user.id === item.createdBy.userId);
          if (user) {
            return {
              ...item,
              actions: (
                <div>
                  <Button kind="ghost">Approve Ticket</Button>
                  <Button kind="ghost">Send Back to Review</Button>
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
    [users, openEditModal, selectTicket]
  );

  const getEmptyDataTable = useCallback(() => {
    return {
      id: "",
      carNo: (
        <NoDataEmptyState
          size="lg"
          className="tickets_noDataState"
          action={{
            onClick: () => openCreateModal(true),
            renderIcon: Add,
            iconDescription: "Add icon",
            text: "Create Ticket",
          }}
          subtitle="Create new Ticket"
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
  }, [openCreateModal]);

  useEffect(() => {
    getTickets((err, tickets) => {
      if (err) {
        return;
      }
      setTickets(tickets);
    });

    return () => {
      setTickets([]);
    };
  }, []);

  useEffect(() => {
    if (sessionUser?.role === "ADMIN" || sessionUser?.role === "REVIEWER") {
      getAllUsers((err, users) => {
        if (err) return;
        setUsers(users);
      });
    }
  }, [sessionUser?.role]);

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
      {/* <Pagination
        page={currentPage}
        pageSize={pageSize}
        pageSizes={[5, 10, 20, 40, 50]}
        itemsPerPageText="Items per page:"
        totalItems={formattedTickets.length}
      /> */}
    </div>
  );
};

TicketDataTable.propTypes = {
  tickets: PropTypes.array,
  users: PropTypes.array,
  selectTicket: PropTypes.func,
  openCreateModal: PropTypes.func,
  openEditModal: PropTypes.func,
  openDetailsModal: PropTypes.func,
};

export default TicketDataTable;
