import {
  Modal,
  ModalBody,
  DatePicker,
  DatePickerInput,
  TextInput,
  Dropdown,
  TimePicker,
} from "@carbon/react";
import PropTypes from "prop-types";

const parkingSlots = [
  {
    label: "P1A",
    value: "P1A",
  },
  {
    label: "P1B",
    value: "P1B",
  },
  {
    label: "P1C",
    value: "P1C",
  },
  {
    label: "P1D",
    value: "P1D",
  },
  {
    label: "P1E",
    value: "P1E",
  },
  {
    label: "P1F",
    value: "P1F",
  },
  {
    label: "P1G",
    value: "P1G",
  },
  {
    label: "P1I",
    value: "P1I",
  },
];

export const EditTicketModal = ({ ticket, isOpen, onClose }) => {
  return (
    <Modal
      size="md"
      open={isOpen}
      onRequestClose={onClose}
      modalHeading="Edit Ticket"
      primaryButtonText="Update"
      secondaryButtonText="Cancel"
    >
      <ModalBody>
        <TextInput
          id="carNo"
          className="input"
          labelText="Car No"
          placeholder="Enter car No"
          value={ticket.carNo}
        />
        <DatePicker className="input" datePickerType="range">
          <DatePickerInput
            labelText="Parking from date"
            placeholder="mm/dd/yyyy"
            size="md"
            value={ticket.parkingFrom}
          />
          <DatePickerInput
            labelText="Parking from date"
            placeholder="mm/dd/yyyy"
            size="md"
            value={ticket.parkingTo}
          />
        </DatePicker>
        <div className="time-picker">
          <TimePicker
            id="fromTime"
            labelText=""
            value={ticket.parkingFromTime}
            timeFormat="12"
          />
          <TimePicker
            id="toTime"
            labelText=""
            value={ticket.parkingToTime}
            timeFormat="12"
          />
        </div>
        <Dropdown
          id="parkingSlot"
          selectedItem={ticket.parkingSlot}
          items={parkingSlots}
          label="Select Parking Slot"
          titleText="Parking Slot"
          required
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
