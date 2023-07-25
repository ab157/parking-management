import { Modal, ModalBody } from "@carbon/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getUserById } from "../../utils/users";

export const TicketDetailsModal = ({ ticket, isOpen, onClose }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    getUserById(ticket?.createdBy?.userId, (err, user) => {
      if (err) setUser(null);
      setUser(user);
    });
  }, [ticket]);

  const parkingFromDate = format(new Date(ticket?.parkingFrom), "dd/MM/yy");
  const parkingToDate = format(new Date(ticket?.parkingTo), "dd/MM/yy");
  const parkingFromTime = format(new Date(ticket?.timeFrom), "hh:mm a");
  const parkingToTime = format(new Date(ticket?.timeTill), "hh:mm a");

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
        <p>Car No: {ticket?.carNo}</p>
        <p>
          Parking From: {parkingFromDate} {parkingFromTime}
        </p>
        <p>
          Parking To: {parkingToDate} {parkingToTime}
        </p>
        <p>Parking Slot: {ticket?.parkingSlot}</p>
        <br />
        {ticket?.createdFor && (
          <>
            <h5>Created For:</h5>
            <p>Name : {ticket?.createdFor?.name}</p>
          </>
        )}
        {user && (
          <>
            <h5>Created By: </h5>
            <p>
              Name : {user.first_name} {user.last_name}
            </p>
            <p>Email : {user.email}</p>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

TicketDetailsModal.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string,
    createdBy: {
      userId: PropTypes.string,
    },
    createdFor: {
      name: PropTypes.string,
    },
    carNo: PropTypes.string,
    parkingFrom: PropTypes.string,
    parkingTo: PropTypes.string,
    timeFrom: PropTypes.string,
    timeTill: PropTypes.string,
    parkingSlot: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default TicketDetailsModal;
