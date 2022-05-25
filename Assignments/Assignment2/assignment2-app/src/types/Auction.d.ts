type Auction = {
    /**
     * Auction id as defined by the database
     */
    auctionId: number,
    /**
     * Title of the auction
     */
    title: string,
    /**
     * The category id of the auction
     */
    categoryId: number,
    /**
     * The auction owner's id (seller of item)
     */
    sellerId: number,
    /**
     * The first name of the auction owner (seller of item)
     */
    sellerFirstName: string,
    /**
     * The last name of the auction owner (seller of item)
     */
    sellerLastName: string,
    /**
     * The reserve price of the auction
     */
    reserve: number,
    /**
     * The number of bids the auction has
     */
    numBids: number,
    /**
     * The highest current bid on the auction
     */
    highestBid: number,
    /**
     * Date and time auction ends
     */
    endDate: string,
    /**
     * Description of the Auction
     */
    description: string
}