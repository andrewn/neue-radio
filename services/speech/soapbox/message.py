import json


class Message:
    @staticmethod
    def from_json(raw):
        try:
            data = json.loads(raw)
            return Message(data['topic'], data['payload'])
        except:
            message = {}

    def __init__(self, topic, payload={}):

        self.topic = topic
        self.payload = payload

        if self.topic == None:
            raise ValueError('Not a valid topic')

    def to_json(self):
        return json.dumps({'topic': self.topic, 'payload': self.payload})
