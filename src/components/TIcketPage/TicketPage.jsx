import "./TicketPage.scss";
import TicketDataTable from "../TicketDataTable/TicketDataTable";
import { PageHeader } from "@carbon/ibm-products/lib/components";
import { Column, Grid } from "@carbon/react";

const TicketPage = () => {
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
