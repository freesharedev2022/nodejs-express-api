export const formatResponse = (status: number, message: any, data= {}) => {
    if(message.details && Array.isArray(message.details) && message.details[0]) message = message.details[0].message
    return {status, message, data}
}
