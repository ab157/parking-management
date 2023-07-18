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
} from "@carbon/react";
import { Edit } from "@carbon/icons-react";
import CreateTicketModal from "../CreateTicketModal/CreateTicketModal";
import { useEffect, useState, useContext, useCallback } from "react";
import { format } from "date-fns";
import TicketDetailsModal from "../TicketDetailsModal/TicketDetailsModal";
import "./TicketDataTable.scss";
import EditTicketModal from "../EditTicketModal/EditTicketModal";
import { AuthContext } from "../../context/AuthContext";
import { getTickets } from "../../utils/tickets";

function getHeadersForTicketsTable(userRole) {
  let headers = [
    {
      key: "id",
      header: "Ticket ID",
    },
    {
      key: "carNo",
      header: "Car No",
    },
    {
      key: "parkingFrom",
      header: "Parking From",
    },
    {
      key: "parkingTo",
      header: "Parking To",
    },
    {
      key: "parkingSlot",
      header: "Parking Slot",
    },
    {
      key: "actions",
      header: "",
    },
  ];

  if (userRole !== "USER") {
    headers = [
      ...headers.slice(0, headers.length - 1),
      {
        key: "userName",
        header: "User Name",
      },
      headers[headers.length - 1],
    ];
  }
  return headers;
}

const TicketDataTable = () => {
  const [tickets, setTickets] = useState([]);
  const [formattedTickets, setFormattedTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(undefined);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user: sessionUser } = useContext(AuthContext);

  const handleTicketClick = (ticketId) => {
    const ticket = tickets.filter((item) => item.id === ticketId)[0];
    setSelectedTicket(ticket);
    setDetailsModalOpen(true);
  };

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
                  setSelectedTicket(item.id);
                  setEditModalOpen(true);
                }}
              >
                <Edit />
              </Button>
            </div>
          ),
        };
      });

      if (user?.role === "USER") {
        modifiedTickets = modifiedTickets.filter(
          (item) => item.userId === user.id
        );
      } else {
        modifiedTickets = modifiedTickets.map((item) => {
          const user = users.find((user) => user.id === item.userId);
          const userName = user ? `${user?.first_name} ${user?.last_name}` : "";
          return {
            ...item,
            userName,
          };
        });
      }

      return modifiedTickets;
    },
    [users]
  );

  useEffect(() => {
    if (sessionUser) {
      // fetch("http://localhost:3031/tickets")
      //   .then((res) => res.json())
      //   .then((data) => setTickets(data));
      getTickets((err, data) => setTickets(data));
    }
  }, [sessionUser]);

  useEffect(() => {
    if (sessionUser) {
      fetch("http://localhost:3031/users")
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
  }, [sessionUser]);

  useEffect(() => {
    setFormattedTickets(formatTickets(tickets, sessionUser));
  }, [sessionUser, tickets, formatTickets]);

  console.log(getHeadersForTicketsTable(sessionUser?.role));

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
                <TableToolbarSearch onChange={(evt) => onInputChange(evt)} />
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
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
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
