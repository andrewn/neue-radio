from soapbox.speech import Speech
from soapbox.message import Message


class MessageHandler:
    def __init__(self):
        self.speech = Speech()

    def handle_message(self, message):
        if message.topic == 'speech.command.speak':
            print(message.payload['utterance'])
            self.speech.speak(message.payload['utterance'])
            return Message(
                'speech.event.spoken',
                {'utterance': message.payload['text']}
            )

    def close(self):
        self.speech.destroy()
