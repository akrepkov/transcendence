import requests
import urllib3

def readUsername() -> str:
    while True:
        username = input("Please enter your username: ")
        if username:
            return username
        else:
            print("Username cannot be empty. Please try again.")

def readPassword() -> str:
    while True:
        password = input("Please enter your password: ")
        if password:
            return password
        else:
            print("Password cannot be empty. Please try again.")

def loginUser():
    url = "https://localhost:3000/api/auth/login"
    while True:
        username = readUsername()
        password = readPassword()
        data = {"username": username, "password": password}
        try:
            # disabling self signed SLL warnings
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            response = requests.post(url, json=data, verify=False)
            if response.status_code == 200:
                print("Login successful!")
                # print("Response:", response.json())
                return response.json().get("token"), response.json().get("username")
            else:
                print(f"Login failed with status code {response.status_code} with error: {response.json().get('error', 'Unknown error')}. Please try again.")
        except Exception as e:
            print(f"An error occurred: {e}")
            print("Please check your connection and try again.")
            retry = input("Do you want to retry? (yes/no): ").strip().lower()
            if retry != 'yes':
                print("Exiting login process.")
                return None