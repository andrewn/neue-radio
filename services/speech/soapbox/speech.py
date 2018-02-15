import speechd


class Speech:
    def __init__(self):
        self.client = speechd.SSIPClient('test')

        self.client.set_output_module('festival')
        self.client.set_language('en')
        self.client.set_punctuation(speechd.PunctuationMode.SOME)

    def speak(self, str):
        self.client.speak(str)

    # Calling this close() causes it not to be
    # found
    def destroy(self):
        self.client.close()
