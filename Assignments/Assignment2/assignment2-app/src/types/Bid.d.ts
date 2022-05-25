type Bid = {
    /**
     * Bidder id as defined by the database
     */
    bidderId: number,
    /**
     * Amount of the bid
     */
    amount: number,
    /**
     * The first name of the bidder
     */
    firstName: string,
    /**
     * The last name of the bidder
     */
    lastName: string,
    /**
     * Date and time of when the bid was placed
     */
    timestamp: string
}