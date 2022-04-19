type User = {
    /**
     * User id as defined by the database
     */
    user_id: number,
    /**
     * Users username as entered when created
     */
    username: string
}

type Conversation = {
    /**
     * Conversation name as defined by the database
     */
    convo_name: string,
    /**
     * Conversation id as defined by the database
     */
    convo_id: number,
    /**
     * Date conversation created on
     */
    created_on: string
}