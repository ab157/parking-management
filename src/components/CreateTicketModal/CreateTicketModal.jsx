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
  TimePicker,
  TimePickerSelect,
  SelectItem,
} from "@carbon/react";
import { useAuthContext } from "../../context/AuthContext";
import { createNewTicket, parkingSlots } from "../../utils/tickets";
import { redirect } from "react-router-dom";
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
  const [carNoError, setCarNoError] = useState("");
  const { user: sessionUser } = useAuthContext();

  const handleCreateTicket = () => {
    const timeFrom = convertTimeStringToTimeStamp(
      `${parkingFromTime.time} ${parkingFromTime.label}`,
      parkingFrom
    );

    const timeTill = convertTimeStringToTimeStamp(
      `${parkingToTime.time} ${parkingToTime.label}`,
      parkingTo
    );

    console.log(timeFrom);
    console.log(timeTill);

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
      isReviewed: false,
      isApproved: false,
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
    redirect("/tickets");
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
        onChange={handleCarNoChange}
        invalid={!!carNoError}
        invalidText={carNoError}
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
        minDate={new Date().toLocaleDateString()}
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
          onChange={(e) =>
            setParkingFromTime((prev) => {
              return { ...prev, time: e.target.value };
            })
          }
          value={parkingFromTime.time}
        >
          <TimePickerSelect
            id="time-picker-from-date"
            onChange={(e) =>
              setParkingFromTime((prev) => {
                return { ...prev, label: e.target.value };
              })
            }
          >
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>

        <TimePicker
          id="toTime"
          labelText="Select Time To"
          onChange={(e) =>
            setParkingToTime((prev) => {
              return { ...prev, time: e.target.value };
            })
          }
          value={parkingToTime.time}
        >
          <TimePickerSelect
            id="time-picker-to-date"
            onChange={(e) =>
              setParkingToTime((prev) => {
                return { ...prev, label: e.target.value };
              })
            }
          >
            <SelectItem value="AM" text="AM" />
            <SelectItem value="PM" text="PM" />
          </TimePickerSelect>
        </TimePicker>
      </div>
      <Dropdown
        id="parkingSlot"
        selectedItem={parkingSlot}
        onChange={(e) => setParkingSlot(e.selectedItem.label)}
        items={parkingSlots}
        label="Select Parking Slot"
        titleText="Parking Slot"
        required
      />
    </Modal>
  );
};

CreateTicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateTicketModal;
