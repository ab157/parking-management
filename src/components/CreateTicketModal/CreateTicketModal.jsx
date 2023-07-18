import { useState } from "react";
import PropTypes from "prop-types";

import {
  Modal,
  TextInput,
  DatePicker,
  DatePickerInput,
  RadioButtonGroup,
  RadioButton,
  Dropdown,
  // TimePicker,
} from "@carbon/react";

// CSS
import "./CreateTicketModal.scss";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "../../context/AuthContext";
import { createNewTicket } from "../../utils/tickets";

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

export const CreateTicketModal = ({ isOpen, onClose }) => {
  const [carNo, setCarNo] = useState("");
  const [parkingFrom, setParkingFrom] = useState("");
  const [parkingTo, setParkingTo] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [forWhom, setForWhom] = useState("");
  const [userName, setUserName] = useState("");
  const [carNoError, setCarNoError] = useState("");
  const { user } = useAuthContext();

  const handleCreateTicket = () => {
    let ticket = {
      id: uuidv4(),
      userId: user.id,
      carNo,
      parkingFrom,
      parkingTo,
      parkingSlot,
    };
    if (forWhom !== "self") {
      ticket = {
        ...ticket,
        user: {
          name: userName,
        },
      };
    }

    createNewTicket(ticket, (err, status) => console.log(status));
  };

  const handleCarNoChange = (e) => {
    const carNoValue = e.target.value;
    setCarNo(carNoValue);

    if (carNoValue.trim() === "") {
      setCarNoError("");
    } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(carNoValue)) {
      setCarNoError("Invalid format");
    } else {
      setCarNoError("");
    }
  };

  return (
    <Modal
      size="sm"
      open={isOpen}
      onRequestSubmit={handleCreateTicket}
      onRequestClose={onClose}
      modalHeading="Create New Ticket"
      primaryButtonText="Create Ticket"
      secondaryButtonText="Cancel Ticket"
      hasScrollingContent={true}
    >
      {/* <Form onSubmit={handleCreateTicket}> */}
      <RadioButtonGroup
        legendText="Select one option"
        name="radio-button-group"
        defaultSelected={"radio-1"}
      >
        <RadioButton
          labelText="For Self"
          value="self"
          id="radio-1"
          defaultChecked={true}
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
        onChange={handleCarNoChange}
        invalid={!!carNoError}
        invalidText={carNoError}
      />
      <DatePicker
        className="input"
        datePickerType="single"
        // minDate={new Date().toISOString()}
        onChange={(date) => {
          setParkingFrom(date[0]);
        }}
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
        // minDate={new Date().toISOString()}
        onChange={(date) => setParkingTo(date[0])}
      >
        <DatePickerInput
          id="parkingTo"
          size="md"
          labelText="Parking To Date"
          placeholder="mm/dd/yyyy"
        />
      </DatePicker>
      {/* <div className="time-picker">
          <TimePicker
            id="fromTime"
            labelText=""
            onChange={(e) => setParkingFromTime(e.target.value)}
            value={parkingFromTime}
            timeFormat="12"
          />
          <TimePicker
            id="toTime"
            labelText=""
            onChange={(e) => setParkingToTime(e.target.value)}
            value={parkingToTime}
            timeFormat="12"
          />
        </div> */}
      <Dropdown
        id="parkingSlot"
        selectedItem={parkingSlot}
        onChange={(e) => setParkingSlot(e.selectedItem.label)}
        items={parkingSlots}
        label="Select Parking Slot"
        titleText="Parking Slot"
        required
      />
      {/* </Form> */}
    </Modal>
  );
};

CreateTicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTicketModal;
