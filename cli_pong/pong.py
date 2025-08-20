import os

def draw_pong_game(state):
    """
    Draws a Pong game representation in the terminal based on the game state.

    :param state: The game state, containing:
        - "players": List of players with attributes: playerName, paddleY, paddleX, score.
        - "ball": Dictionary with ball position (x, y) and size.
    """
    # Canvas dimensions
    canvas_width = 800
    canvas_height = 600

    # Terminal dimensions (adjust as needed for legibility)
    term_width = 80
    term_height = 24

    # Helper function to scale coordinates to fit terminal size
    def scale(value, max_original, max_terminal):
        return int(value * max_terminal / max_original)

    # print(state)
    # Create an empty canvas (2D array of spaces)
    canvas = [[" " for _ in range(term_width)] for _ in range(term_height)]

    # Draw ball
    ball_x = scale(state["ball"]["x"], canvas_width, term_width)
    ball_y = scale(state["ball"]["y"], canvas_height, term_height)
    # print("still here")
    if 0 <= ball_x < term_width and 0 <= ball_y < term_height:
        canvas[ball_y][ball_x] = "O"  # Represent the ball as "O"

    # print("still here")

    # Draw paddles and scores
    for player in state["players"]:
        # Scale paddle position
        # print("still here 2 in loop", player)

        paddle_x = scale(player["paddleX"], canvas_width, term_width)
        paddle_y = scale(player["paddleY"], canvas_height, term_height)
        paddle_height = scale(100, canvas_height, term_height)  # Assume paddle height is 100 in original coordinates

        # Draw paddle as a vertical line
        for i in range(-paddle_height // 2, paddle_height // 2):
            # print("this one goes wrong, 2")
            if 0 <= paddle_y + i < term_height:
                # print(paddle_y)
                # print(paddle_x)
                # print(i)
                canvas[paddle_y + i][paddle_x - 1] = "|"

        # Display score above each paddle
        if paddle_x < term_width // 2:  # Left player
            score_x = 2
        else:  # Right player
            score_x = term_width - len(f"{player['playerName']}: {player['score']}") - 2

        # print("this one goes wrong, 3")
        score_text = f"{player['playerName']}: {player['score']}"
        for j, char in enumerate(score_text):
            # print("this one goes wrong")
            if 0 <= score_x + j < term_width:
                canvas[0][score_x + j] = char

    # Clear the terminal and print the canvas
    os.system("cls" if os.name == "nt" else "clear")  # Clear the terminal
    # print("yes")
    for row in canvas:
        # print("noo")
        print("".join(row))