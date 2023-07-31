import { useState, useRef, useContext } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import { createNewTicket, parkingSlots } from "../../utils/tickets";
import "./CreateTicketModal.scss";
import { convertTimeStringToTimeStamp } from "../../utils/formatDate";

export const CreateTicketModal = ({ isOpen, onClose, occupiedSlots }) => {
  const [carNo, setCarNo] = useState("");
  const [parkingFrom, setParkingFrom] = useState("");
  const [parkingFromTime, setParkingFromTime] = useState("");
  const [parkingTo, setParkingTo] = useState("");
  const [parkingToTime, setParkingToTime] = useState("");
  const [parkingSlot, setParkingSlot] = useState("");
  const [forWhom, setForWhom] = useState("self");
  const [userName, setUserName] = useState("");
  const { user: sessionUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTill, setTimeTill] = useState("");

  const timeFromRef = useRef();
  const timeTillRef = useRef();
  const carNoRegex = new RegExp("^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$");
  const timeRegex = new RegExp("^(1[0-2]|0?[1-9]):[0-5][0-9]$");

  const [slotIsOccupied, setSlotIsOccupied] = useState(false);

  function isSlotAvailable(parkingSlot, timeFrom, timeTill) {
    for (let slot of occupiedSlots) {
      if (String(slot.label) === String(parkingSlot)) {
        if (slot.occupiedFrom <= timeFrom && slot.occupiedTill >= timeTill) {
          setSlotIsOccupied(true);
        } else if (
          slot.occupiedFrom >= timeFrom &&
          slot.occupiedFrom <= timeTill
        ) {
          setSlotIsOccupied(true);
        }
        return;
      } else {
        setSlotIsOccupied(false);
      }
    }
  }

  const handleCreateTicket = () => {
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
      status:
        sessionUser?.role === "USER"
          ? {
              type: "Ready for Review",
              sendToReview: false,
              isReviewed: false,
              reviewSuccess: null,
              sendToApproval: false,
              isApproved: false,
              approveSuccess: null,
            }
          : {
              type: "Under Review",
              sendToReview: true,
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
        !parkingSlot ||
        slotIsOccupied
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
        onBlur={() => {
          if (parkingFromTime) {
            setTimeFrom(
              convertTimeStringToTimeStamp(
                `${parkingFromTime} ${timeFromRef.current.value}`,
                parkingFrom
              )
            );
          }
        }}
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
        onBlur={() => {
          if (parkingToTime) {
            setTimeTill(
              convertTimeStringToTimeStamp(
                `${parkingToTime} ${timeTillRef.current.value}`,
                parkingTo
              )
            );
          }
        }}
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
          onBlur={() =>
            setTimeFrom(
              convertTimeStringToTimeStamp(
                `${parkingFromTime} ${timeFromRef.current.value}`,
                parkingFrom
              )
            )
          }
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
          onBlur={() =>
            setTimeTill(
              convertTimeStringToTimeStamp(
                `${parkingToTime} ${timeTillRef.current.value}`,
                parkingTo
              )
            )
          }
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
        onChange={(e) => {
          setParkingSlot(e.selectedItem.label);
          isSlotAvailable(e.selectedItem.label, timeFrom, timeTill);
        }}
        invalid={slotIsOccupied}
        invalidText={"The slot for this date and time is not available"}
        required
      />
      {error && <p className="error">{error}</p>}
    </Modal>
  );
};

CreateTicketModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  occupiedSlots: PropTypes.array,
};

export default CreateTicketModal;
