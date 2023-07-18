## Parking Management

### To start the app

- open split terminal
- in one terminal run
  `npm run dev`
- in another run
  `npx json-server --watch data/db.json --port 3031`

### Functionalities

- Register as a new user
- Login as an existing user
- If user is ADMIN, then they can view and manage all tickets from users
- if the user is a USER, then they can only view and manage their Tickets
