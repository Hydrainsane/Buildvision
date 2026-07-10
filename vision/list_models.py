from google import genai

API_KEY = "AIzaSyCyfgy8AgrK1u4e5T3p6DH27jMQFKM8ff0"

client = genai.Client(api_key=API_KEY)

for model in client.models.list():
    print(model.name)