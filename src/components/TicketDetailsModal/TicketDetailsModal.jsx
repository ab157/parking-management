import { Modal, ModalBody } from "@carbon/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export const TicketDetailsModal = ({ ticket, isOpen, onClose }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    if (ticket) {
      fetch(`http://localhost:3031/users/${ticket.userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, [ticket]);

  const parkingFromDate = format(new Date(ticket?.parkingFrom), "dd/MM/yy");
  const parkingToDate = format(new Date(ticket?.parkingTo), "dd/MM/yy");

  return (
    <Modal
      size="sm"
      open={isOpen}
      onRequestClose={onClose}
      modalHeading="Ticket Details"
      passiveModal={true}
    >
      <ModalBody>
        <h5>Ticket Information</h5>
        <p>Car No : {ticket?.carNo}</p>
        <p>
          Parking From : {parkingFromDate} {ticket?.parkingFromTime}
        </p>
        <p>
          Parking To : {parkingToDate} {ticket?.parkingToTime}
        </p>
        <p>Parking Slot : {ticket?.parkingSlot}</p>
        <br />
        <h5>User Information : </h5>
        {user && (
          <>
            <p>
              Name : {user.first_name} {user.last_name}
            </p>
            <p>Email : {user.email}</p>
            <p>Contact : {user.contact}</p>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

TicketDetailsModal.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    carNo: PropTypes.string,
    parkingFrom: PropTypes.string,
    parkingTo: PropTypes.string,
    parkingFromTime: PropTypes.string,
    parkingToTime: PropTypes.string,
    parkingSlot: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TicketDetailsModal;
