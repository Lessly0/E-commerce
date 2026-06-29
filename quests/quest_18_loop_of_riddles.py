# Quest 18: The Loop of Riddles
# Concept: while loop with user-input condition

secret_number = 7
guess = None

while guess != secret_number:
    guess = int(input("Guess the secret number: "))
    if guess != secret_number:
        print("Wrong! Try again.")

print("You guessed it! The secret number was", secret_number)
