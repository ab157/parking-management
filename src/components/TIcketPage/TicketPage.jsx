import "./TicketPage.scss";
import TicketDataTable from "../TicketDataTable/TicketDataTable";
import { PageHeader } from "@carbon/ibm-products/lib/components";
import { Column, Grid } from "@carbon/react";
import { fetchTickets } from "../../features/tickets";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const TicketPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTickets()).then((data) => console.log(data));
  }, [dispatch]);

  return (
    <>
      <PageHeader
        className="ticketsPage"
        title={{ text: "Parking Ticket Dashboard" }}
      />
      <Grid fullWidth>
        <Column lg={16}>
          <TicketDataTable />
        </Column>
      </Grid>
    </>
  );
};

export default TicketPage;
