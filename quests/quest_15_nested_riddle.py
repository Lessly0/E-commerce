# Quest 15: The Nested Riddle
# Concept: Nested if Statements

direction = input("Do you go left or right? ").lower()

if direction == "left":
    action = input("Do you swim or wait? ").lower()
    if action == "swim":
        print("You found a hidden treasure chest underwater!")
    else:
        print("You wait... and a friendly merchant gives you a map.")
else:
    print("You wander into the forest and get lost for hours.")
