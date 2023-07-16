""" backend OpenAI API for chatbot application"""

import os
import json
from typing import Optional
import logging
from urllib.parse import urlparse
import redis


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from langchain.memory.chat_message_histories import RedisChatMessageHistory
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
)
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory

logging.basicConfig(level=logging.INFO)


if os.environ.get("OPENAI_API_KEY") is not None:
    os.getenv("OPENAI_API_KEY")
else:
    logging.error("OPENAI_API_KEY is not set.")
    raise ValueError("OPENAI_API_KEY is not set.")

openai_model = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo-0613')
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
logging.info("redis_url: %s", redis_url)
parsed_url = urlparse(redis_url)
logging.info("parsed_url: %s", parsed_url)
HOSTNAME = str(parsed_url.hostname)
logging.info("redis host: %s", HOSTNAME)
PORT = int(str(parsed_url.port))
logging.info("redis port: %s", PORT)

REDIS_TTL = 604800  # 7 days
redis_messages = redis.Redis(host=HOSTNAME, port=PORT, db=0)
redis_conversations = redis.Redis(host=HOSTNAME, port=PORT, db=1)


app = FastAPI()

origins = [
    "http://localhost:3000",  # React app's address
    # "*"
    # other origins if any
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    """A message sent by a user."""
    text: str
    sender: str
    conversationId: Optional[str] = None
    chatHistory: Optional[list] = []


class ResponseMessage(BaseModel):
    """A response generate from OpenAI."""
    text: str
    sender: str


class OpenAIError(Exception):
    """An error occurred while querying the OpenAI API."""


class RedisConnectionError(Exception):
    """An error occurred while connecting to Redis."""


# pylint: disable=too-few-public-methods
class ChatService:
    """A service for interacting with the AI model."""
    @staticmethod
    def get_response(user_message: str,
                     message_history: RedisChatMessageHistory
                     ) -> str:
        """Get a response from the AI model."""
        # Make sure the user message is not empty
        if not user_message:
            raise ValueError("The message is empty.")

        try:

            memory = ConversationBufferMemory(
                memory_key="message_history",
                chat_memory=message_history,
                return_messages=True
            )

            prompt = ChatPromptTemplate.from_messages([
                SystemMessagePromptTemplate.from_template(
                    "You are a helpful assistant that "
                    "responds in markdown format."
                ),
                MessagesPlaceholder(variable_name="message_history"),
                HumanMessagePromptTemplate.from_template("{input}")
            ])

            llm = ChatOpenAI(model=openai_model, temperature=0)

            conversation = ConversationChain(memory=memory,
                                             prompt=prompt,
                                             llm=llm)

            response = conversation.predict(input=user_message)

        except redis.ConnectionError as err:
            logging.error("Failed to connect to Redis: %s", str(err))
            raise RedisConnectionError("Failed to connect to Redis") from err

        except Exception as err:
            logging.error("An error occurred while querying"
                          "the OpenAI API: %s", str(err))
            raise OpenAIError("An error occurred while querying"
                              " the OpenAI API") from err

        return response


class SaveChat(BaseModel):
    """A request to save a chat."""
    conversationId: str
    name: str


@app.post("/saveChat/")
async def save_chat(request: SaveChat):
    """Save a chat."""
    try:
        # redis_conv_history = redis.Redis(host='localhost', port=6379, db=1)
        # redis_conv_history.set(request.conversationId, request.name)
        logging.info("saveChat: %s with ID %s",
                     request.name,
                     request.conversationId)

        redis_conversations.set(request.conversationId,
                                request.name,
                                ex=REDIS_TTL)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err)) from err

    return {"status": "success"}


@app.post("/message/", response_model=ResponseMessage)
async def create_message(message: Message):
    """Create a new message."""
    try:
        logging.info("message: %s", message.text)
        logging.info("sender: %s", message.sender)
        # chatHistory is not used, was just for testing
        logging.info("chatHistory: %s", message.chatHistory)
        logging.info("conversationId: %s", message.conversationId)

        history = RedisChatMessageHistory(
            url=f"{redis_url}/0",
            ttl=REDIS_TTL,
            session_id=str(message.conversationId)
        )
        response_text = ChatService.get_response(message.text, history)
        # history is managed by LangChain
        # history.add_user_message(message.text)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except OpenAIError as err:
        raise HTTPException(status_code=503, detail=str(err)) from err
    except RedisConnectionError as err:
        raise HTTPException(status_code=500, detail=str(err)) from err

    response_message = ResponseMessage(text=response_text, sender='chatGpt')
    # history is managed by LangChain
    # history.add_ai_message(response_text)
    # logging.info("add_ai_message history: %s", history.messages)
    return response_message


@app.get("/conversations")
async def get_conversations():
    """Get a list of conversations."""

    try:
        keys = redis_conversations.keys('*')
        result = {key.decode('utf-8'): redis_conversations.get(key).decode(
                 'utf-8') for key in keys}
        logging.info("conversations: %s", result)
        return {"conversations": result}
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err)) from err
    except OpenAIError as err:
        raise HTTPException(status_code=503, detail=str(err)) from err
    except RedisConnectionError as err:
        raise HTTPException(status_code=500, detail=str(err)) from err


@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get a conversation."""

    # redis_con = redis.Redis(host='localhost', port=6379, db=0)
    # create a cursor for scanning keys
    scan_cursor = 0

    # prefix pattern for the keys
    pattern = f'message_store:{conversation_id}*'
    logging.info("pattern: %s", pattern)

    messages = []
    records = []
    while True:
        scan_cursor, keys = redis_messages.scan(cursor=scan_cursor,
                                                match=pattern, count=10)
        logging.info("scan_cursor: %s", scan_cursor)
        if not keys:
            logging.info("No keys found. Breaking loop.")
            break
        for key in keys:
            logging.info("key: %s", key)
            key_value = list(reversed(redis_messages.lrange(key, 0, -1)))
            logging.info("key_value: %s", key_value)

            if isinstance(key_value, list) and all(isinstance(
                          item, (str, bytes)) for item in key_value):
                records = []

                for item in key_value:
                    try:
                        records.append(json.loads(item))
                    except json.JSONDecodeError:
                        logging.error("JSONDecodeError: Failed to decode %s",
                                      item)

            # create a new dictionary with the desired fields
            for record in records:
                logging.info("record: %s", record)
                message = {}

                logging.info("record type: %s", record['type'])
                if record['type'] == 'human':
                    message['sender'] = 'user'
                else:
                    message['sender'] = 'chatGpt'

                message['text'] = record['data']['content']
                logging.info("message: %s", message)
                messages.append(message)
            logging.info("Finished processing key: %s", key)

        if scan_cursor == 0:
            logging.info("scan_cursor is 0. Breaking loop.")
            try:
                logging.info("Exiting loop. Preparing to return messages.")
                logging.info("messages: %s", messages)
                return {"messages": messages}
            except Exception as err:
                logging.error("Error when trying to return messages: %s",
                              str(err))
                raise err
        else:
            logging.info("Continuing the loop.")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
