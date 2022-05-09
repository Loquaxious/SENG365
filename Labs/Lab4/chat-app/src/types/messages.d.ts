type Message = {
    /**
     * Message id as defined by the database
     */
    message_id: number,
    /**
     * Conversation id of conversation the message belongs to
     */
    convo_id: number,
    /**
     * User id of sent message
     */
    user_id: number,
    /**
     * Timestamp of created message
     */
    time_sent : string,
    /**
     * Text of the message
     */
    message: string
}