import {
  Modal,
  ModalBody,
  DatePicker,
  DatePickerInput,
  TextInput,
  Dropdown,
  // TimePicker,
} from "@carbon/react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { editTicket, parkingSlots } from "../../utils/tickets";

export const EditTicketModal = ({ ticket, isOpen, onClose }) => {
  const [ticketToUpdate, setTicketToUpdate] = useState();

  useEffect(() => {
    setTicketToUpdate({
      ...ticket,
    });
  }, [ticket]);

  function handleChange(field, value) {
    setTicketToUpdate((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function handleParkingSlotChange(e) {
    setTicketToUpdate((prev) => {
      return {
        ...prev,
        parkingSlot: e.selectedItem.label,
      };
    });
  }

  function handleEditTicket() {
    editTicket(ticketToUpdate, (err, ticket) => {
      if (err) return;
      console.log(ticket);
      onClose();
    });
  }

  return (
    <Modal
      size="md"
      open={isOpen}
      onRequestClose={onClose}
      modalHeading="Edit Ticket"
      primaryButtonText="Update"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleEditTicket}
    >
      <ModalBody>
        <TextInput
          id="carNo"
          name="carNo"
          className="input"
          labelText="Car No"
          placeholder="Enter car No"
          value={ticketToUpdate?.carNo}
          onChange={(e) => handleChange("carNo", e.target.value)}
        />
        <DatePicker
          className="input"
          datePickerType="single"
          name="parkingFrom"
          minDate={ticketToUpdate?.parkingFrom}
          onChange={(date) => handleChange("parkingFrom", date[0])}
          value={ticketToUpdate?.parkingFrom}
        >
          <DatePickerInput
            id="parkingFrom"
            labelText="Parking from"
            placeholder="mm/dd/yy"
            size="md"
          />
        </DatePicker>
        <DatePicker
          className="input"
          name="parkingTo"
          datePickerType="single"
          minDate={ticketToUpdate?.parkingFrom}
          onChange={(date) => handleChange("parkingTo", date[0])}
          value={ticketToUpdate?.parkingTo}
        >
          <DatePickerInput
            id="parkingTo"
            labelText="Parking Till"
            placeholder="mm/dd/yy"
            size="md"
          />
        </DatePicker>
        {/* <div className="time-picker">
          <TimePicker
            id="fromTime"
            name="timeFrom"
            labelText=""
            value={ticketToUpdate?.parkingFromTime}
            timeFormat="12"
          />
          <TimePicker
            id="toTime"
            name="timeTo"
            labelText=""
            value={ticketToUpdate?.parkingToTime}
            timeFormat="12"
          />
        </div> */}
        <Dropdown
          id="parkingSlot"
          name="parkingSlot"
          selectedItem={ticketToUpdate?.parkingSlot}
          items={parkingSlots}
          label="Select Parking Slot"
          titleText="Parking Slot"
          onChange={handleParkingSlotChange}
        />
      </ModalBody>
    </Modal>
  );
};

EditTicketModal.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    carNo: PropTypes.string,
    parkingFrom: PropTypes.string,
    parkingFromTime: PropTypes.string,
    parkingTo: PropTypes.string,
    parkingToTime: PropTypes.string,
    parkingSlot: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EditTicketModal;
