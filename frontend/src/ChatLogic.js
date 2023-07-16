
import { sendMessageToApi, SEND_URL_ERROR_MESSAGE } from './MessageApi';

const MAX_RETRIES = 3;
const DELAY_MS = 2000;
const SEND_ERROR_MESSAGE = "Failed to send the message after multiple attempts. Please check your connection and try again.";

const handleSendMessage = async (userMessage, setMessages, setAlert, setInput, apiUrl, messages, conversationId) => {
  try {
    
    console.log(`handleSendMessage apiUrl: ${JSON.stringify(apiUrl)}`);
    console.log(`handleSendMessage messages: ${JSON.stringify(messages)}`);

    const aiResponse = await sendMessageToApi(userMessage, apiUrl, MAX_RETRIES, DELAY_MS, conversationId, messages);
    setMessages(prevMessages => [
      ...prevMessages,
      { text: userMessage, sender: 'user' },
      aiResponse,
    ]);
    setInput('');
    return false;  // The operation was successful, so we're not retrying.
  } catch (error) {
    if (error.message === SEND_URL_ERROR_MESSAGE) {
      setAlert({ open: true, message: SEND_URL_ERROR_MESSAGE});
      return false;
    }
    setAlert({ open: true, message: SEND_ERROR_MESSAGE });
    return false;
  }
};

export { handleSendMessage };
