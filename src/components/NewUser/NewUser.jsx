import { useState } from "react";
import { TextInput, Button, DatePicker } from "@carbon/react";
const NewUser = () => {
  const [carNumber, setCarNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userContact, setUserContact] = useState("");
  const [parkingFrom, setParkingFrom] = useState(null);
  const [parkingTo, setParkingTo] = useState(null);
  const [parkingSlot, setParkingSlot] = useState("");

  const handleSubmit = (e) => {
    e.preventdefault();

    setCarNumber("");
    setUserEmail("");
    setUserName("");
    setUserContact("");
    setParkingFrom(null);
    setParkingTo(null);
    setParkingSlot("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id="carNumber"
        labelText="Car Number"
        value={carNumber}
        onChange={(e) => setCarNumber(e.target.value)}
      />

      <TextInput
        id="userName"
        labelText="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <TextInput
        id="userEmail"
        labelText="User Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />

      <TextInput
        id="userContact"
        labelText="Contact No."
        value={userContact}
        onChange={(e) => setUserContact(e.target.value)}
      />

      <DatePicker
        datePickerType="simple"
        labelText="Parking from date"
        value={parkingFrom}
        onChange={(e) => setParkingFrom(e.target.value)}
      />

      <DatePicker
        datePickerType="simple"
        labelText="Parking To date"
        value={parkingTo}
        onChange={(e) => setParkingTo(e.target.value)}
      />

      <TextInput
        id="parkingSlot"
        labelText="Parking Slot"
        value={parkingSlot}
        onChange={(e) => setParkingSlot(e.target.value)}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default NewUser;
