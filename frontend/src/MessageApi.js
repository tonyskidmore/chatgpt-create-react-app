export const SEND_URL_ERROR_MESSAGE = "REACT_APP_API_URL is not defined. Please set it in the environment variables.";

export const sendMessageToApi = async (userMessage, apiUrl, maxRetries, delayMS, conversationId, chatHistory) => {
  if (apiUrl === undefined || apiUrl === '') {
    throw new Error(SEND_URL_ERROR_MESSAGE);
  }

  console.log(`sendMessageToApi chatHistory: ${JSON.stringify(chatHistory)}`);

  const response = await apiCallWithRetries(`${apiUrl}/message/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: userMessage, sender: 'user', conversationId: conversationId, chatHistory: chatHistory }),
  }, maxRetries, delayMS);

  return { text: response.text, sender: response.sender };
};

export async function apiCallWithRetries(url, options, maxRetries, delayMS) {
  let attempt = 0;
  console.log(`apiCallWithRetries options: ${JSON.stringify(options)}`);
  console.log(`maxRetries: ${maxRetries}`);
  console.log(`delayMS: ${delayMS}`);
  while (attempt < maxRetries) {
    try {
      const response = await apiCall(url, options);
      console.log(`apiCallWithRetries response: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        console.error(error);
        throw error;
      }
      attempt++;
      await new Promise(resolve => setTimeout(resolve, delayMS));
    }
  }
}

export async function apiCall(url, options) {
  console.log('Parsed options.body:', JSON.parse(options.body));
  console.log(`apiCall options: ${JSON.stringify(options)}`);
  
  const response = await fetch(url, options);
  if (!response.ok) {
      let responseBody;
      try {
          responseBody = await response.json();
      } catch (e) {
          responseBody = await response.text();
      }
      throw new Error(`HTTP error! status: ${response.status}, status text: ${response.statusText}, response body: ${JSON.stringify(responseBody)}`);
  }
  return await response.json();
}
