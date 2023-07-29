import { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  TextInput,
  DatePicker,
  DatePickerInput,
  RadioButtonGroup,
  RadioButton,
  Dropdown,
  TimePicker,
  TimePickerSelect,
  SelectItem,
} from "@carbon/react";
import { useAuthContext } from "../../context/AuthContext";
import { createNewTicket, parkingSlots } from "../../utils/tickets";
// CSS
import "./CreateTicketModal.scss";
import { convertTimeStringToTimeStamp } from "../../utils/formatDate";

export const CreateTicketModal = ({ isOpen, onClose }) => {
  const [carNo, setCarNo] = useState("");
  const [parkingFrom, setParkingFrom] = useState("");
  const [parkingFromTime, setParkingFromTime] = useState("");
  const [parkingTo, setParkingTo] = useState("");
  const [parkingToTime, setParkingToTime] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [forWhom, setForWhom] = useState("self");
  const [userName, setUserName] = useState("");
  const { user: sessionUser } = useAuthContext();
  const [error, setError] = useState("");

  const timeFromRef = useRef();
  const timeTillRef = useRef();
  const carNoRegex = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$");
  const timeRegex = new RegExp("^(1[0-2]|0?[1-9]):[0-5][0-9]$");

  const handleCreateTicket = () => {
    const timeFrom = convertTimeStringToTimeStamp(
      `${parkingFromTime} ${timeFromRef.current.value}`,
      parkingFrom
    );

    const timeTill = convertTimeStringToTimeStamp(
      `${parkingToTime} ${timeTillRef.current.value}`,
      parkingTo
    );

    if (timeFrom >= timeTill) {
      setError("Parking To Time should be greater than Parking From Time");
      return;
    }

    let ticket = {
      carNo,
      parkingFrom,
      timeFrom,
      parkingTo,
      timeTill,
      parkingSlot,
      createdBy: {
        userId: sessionUser?.id,
      },
      status: {
        type: "Ready for Review",
        sendToReview: false,
        isReviewed: false,
        reviewSuccess: null,
        sendToApproval: false,
        isApproved: false,
        approveSuccess: null,
      },
    };
    if (forWhom !== "self") {
      ticket = {
        ...ticket,
        createdFor: {
          name: userName,
        },
      };
    }
    createNewTicket(ticket, (err, status) => {
      if (err) {
        return;
      }
      if (status === 201) {
        onClose();
      }
    });
  };

  return (
    <Modal
      aria-label="Modal"
      size="sm"
      open={isOpen}
      onRequestSubmit={handleCreateTicket}
      onRequestClose={onClose}
      modalHeading="Create New Ticket"
      primaryButtonText="Create and Send to Review"
      secondaryButtonText="Cancel Ticket"
      primaryButtonDisabled={
        !carNo ||
        !parkingFrom ||
        !parkingFromTime ||
        !parkingTo ||
        !parkingToTime ||
        !parkingSlot
      }
      hasScrollingContent={true}
    >
      <RadioButtonGroup
        legendText="Select one option"
        name="radio-button-group"
        value={forWhom}
        valueSelected={forWhom}
      >
        <RadioButton
          labelText="For Self"
          value="self"
          id="radio-1"
          onClick={(e) => setForWhom(e.target.value)}
        />
        <RadioButton
          labelText="For Someone Else"
          value="not-self"
          id="radio-2"
          onClick={(e) => setForWhom(e.target.value)}
        />
      </RadioButtonGroup>
      {forWhom === "not-self" && (
        <>
          <TextInput
            id="userName"
            className="input"
            labelText="User Name"
            placeholder="Enter User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </>
      )}
      <TextInput
        id="carNo"
        className="input"
        labelText="Car No"
        placeholder="Enter car No"
        value={carNo}
        onChange={(e) => setCarNo(e.target.value)}
        invalid={carNo !== "" && !carNoRegex.test(carNo)}
        invalidText={"Invalid Format"}
      />

      <DatePicker
        className="input"
        datePickerType="single"
        minDate={new Date().toLocaleDateString()}
        onChange={(date) => setParkingFrom(date[0].toISOString())}
        value={parkingFrom}
      >
        <DatePickerInput
          id="parkingFrom"
          size="md"
          labelText="Parking From Date"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>
      <DatePicker
        className="input"
        datePickerType="single"
        minDate={new Date(parkingFrom).toLocaleDateString()}
        onChange={(date) => setParkingTo(date[0].toISOString())}
        value={parkingTo}
      >
        <DatePickerInput
          id="parkingTo"
          size="md"
          labelText="Parking To Date"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>

      <div className="time-picker">
        <TimePicker
          id="fromTime"
          labelText="Select Time From"
          onChange={(e) => setParkingFromTime(e.target.value)}
          value={parkingFromTime}
          invalid={parkingFromTime !== "" && !timeRegex.test(parkingFromTime)}
          invalidText={"The time should be 12 Hr Format"}
        >
          <TimePickerSelect id="time-picker-from-date" ref={timeFromRef}>
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>
        <TimePicker
          id="toTime"
          labelText="Select Time To"
          onChange={(e) => setParkingToTime(e.target.value)}
          value={parkingToTime}
          invalid={parkingToTime !== "" && !timeRegex.test(parkingToTime)}
          invalidText={"The time should be 12 Hr Format"}
        >
          <TimePickerSelect id="time-picker-to-date" ref={timeTillRef}>
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>
      </div>
      <Dropdown
        id="parkingSlot"
        selectedItem={parkingSlot}
        items={parkingSlots}
        label="Select Parking Slot"
        titleText="Parking Slot"
        onChange={(e) => setParkingSlot(e.selectedItem.label)}
        required
      />
      {error && <p className="error">{error}</p>}
    </Modal>
  );
};

CreateTicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTicketModal;
