import {
  Modal,
  DatePicker,
  DatePickerInput,
  TextInput,
  Dropdown,
  TimePicker,
  TimePickerSelect,
  SelectItem,
} from "@carbon/react";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { editTicket, parkingSlots } from "../../utils/tickets";
import {
  convertTimeStampToAMPM,
  convertTimeStringToTimeStamp,
} from "../../utils/formatDate";

export const EditTicketModal = ({ ticket, isOpen, onClose }) => {
  const [ticketToUpdate, setTicketToUpdate] = useState(ticket);
  const [timeFrom, setTimeFrom] = useState(
    convertTimeStampToAMPM(ticketToUpdate.timeFrom).split(" ")
  );
  const [timeTill, setTimeTill] = useState(
    convertTimeStampToAMPM(ticketToUpdate.timeTill).split(" ")
  );

  const [error, setError] = useState("");
  const timeFromRef = useRef();
  const timeTillRef = useRef();
  const carNoRegex = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$");
  const timeRegex = new RegExp("^(1[0-2]|0?[1-9]):[0-5][0-9]$");

  function handleChange(field, value) {
    setTicketToUpdate((prev) => {
      return {
        ...prev,
        [field]: value,
      };
    });
  }

  function handleTimeChange(timeString, date, timeField) {
    const timeStamp = convertTimeStringToTimeStamp(`${timeString}`, date);
    handleChange(timeField, timeStamp);
  }

  function handleEditTicket() {
    handleTimeChange(
      timeFrom.join(" "),
      ticketToUpdate.parkingFrom,
      "timeFrom"
    );
    handleTimeChange(timeTill.join(" "), ticketToUpdate.parkingTo, "timeTill");

    if (ticketToUpdate.timeFrom >= ticketToUpdate.timeTill) {
      setError("Parking To Time should be greater than Parking From Time");
      return;
    } else {
      setError("");
    }

    if (!error) {
      editTicket(ticketToUpdate, (err) => {
        if (err) {
          return;
        } else {
          setError("");
          onClose();
        }
      });
    }
  }

  return (
    <Modal
      aria-label="Modal"
      size="sm"
      open={isOpen}
      onRequestSubmit={handleEditTicket}
      onRequestClose={onClose}
      modalHeading="Edit Ticket"
      primaryButtonText="Update Ticket"
      secondaryButtonText="Cancel"
    >
      <TextInput
        id="carNo"
        name="carNo"
        className="input"
        labelText="Car No"
        placeholder="Enter car No"
        value={ticketToUpdate?.carNo}
        onChange={(e) => handleChange("carNo", e.target.value)}
        invalid={
          ticketToUpdate.carNo !== "" && !carNoRegex.test(ticketToUpdate.carNo)
        }
        invalidText={"Invalid Format"}
      />
      <DatePicker
        className="input"
        datePickerType="single"
        name="parkingFrom"
        minDate={ticketToUpdate?.parkingFrom}
        onChange={(date) => handleChange("parkingFrom", date[0].toISOString())}
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
        onChange={(date) => handleChange("parkingTo", date[0].toISOString())}
        value={ticketToUpdate?.parkingTo}
      >
        <DatePickerInput
          id="parkingTo"
          labelText="Parking Till"
          placeholder="mm/dd/yy"
          size="md"
        />
      </DatePicker>
      <div>
        <TimePicker
          id="fromTime"
          labelText="Select Time From"
          onChange={(e) => {
            setTimeFrom((prev) => [e.target.value, prev[1]]);
          }}
          onBlur={() =>
            handleTimeChange(
              timeFrom.join(" "),
              ticketToUpdate.parkingFrom,
              "timeFrom"
            )
          }
          value={timeFrom[0]}
          invalid={timeFrom[0] !== "" && !timeRegex.test(timeFrom[0])}
          invalidText={"The time should be 12 Hr Format"}
        >
          <TimePickerSelect
            id="time-picker-from-date"
            ref={timeFromRef}
            defaultValue={timeFrom[1]}
            onChange={(e) => setTimeFrom((prev) => [prev[0], e.target.value])}
          >
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>

        <TimePicker
          id="toTime"
          labelText="Select Time To"
          onChange={(e) => {
            setTimeTill((prev) => [e.target.value, prev[1]]);
          }}
          onBlur={() =>
            handleTimeChange(
              timeTill.join(" "),
              ticketToUpdate.parkingTo,
              "timeTill"
            )
          }
          value={timeTill[0]}
          invalid={timeTill[0] !== "" && !timeRegex.test(timeTill[0])}
          invalidText={"The time should be 12 Hr Format"}
        >
          <TimePickerSelect
            id="time-picker-to-date"
            ref={timeTillRef}
            defaultValue={timeTill[1]}
            onChange={(e) => setTimeTill((prev) => [prev[0], e.target.value])}
          >
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>
      </div>
      <Dropdown
        id="parkingSlot"
        selectedItem={ticketToUpdate?.parkingSlot}
        items={parkingSlots}
        label="Select Parking Slot"
        titleText="Parking Slot"
        onChange={(e) => handleChange("parkingSlot", e.selectedItem.label)}
        required
      />
      {error && <p className="error">{error}</p>}
    </Modal>
  );
};

EditTicketModal.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string,
    createdBy: PropTypes.shape({
      userId: PropTypes.string,
    }),
    createdFor: PropTypes.shape({
      name: PropTypes.string,
    }),
    carNo: PropTypes.string,
    parkingFrom: PropTypes.string,
    timeFrom: PropTypes.number,
    parkingTo: PropTypes.string,
    timeTill: PropTypes.number,
    parkingSlot: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EditTicketModal;
