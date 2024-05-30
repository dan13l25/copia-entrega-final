import ticketModel from "../models/ticket.js";

const ticketRepositorie = {
    createTicket: async (ticketData) => {
        const ticket = new ticketModel(ticketData);
        return await ticket.save();
    }
}

export default ticketRepositorie;