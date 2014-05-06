"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.multicall import CheckiORefereeMulti

import random
from collections import Counter
from functools import partial

"""
def score_run(n, score, aces, die):
    cs = Counter(die)
    if cs.get("AS", 0) >= n:
        return aces
    elif max(cs.values()) >= n:
        return score
    else:
        return 0

def score_two_runs(n, score, aces, die):
    cs = Counter(die).most_common()
    if cs[0][1] >= n + 2 or (len(cs) >= 2 and cs[0][1] >= n and cs[1][1] >= 2):
        if cs[0][0] == "AS":
            return aces
        else:
            return score
    else:
        return 0

def score_straight(die):
    cs = Counter(die)
    if cs == Counter(["9S", "TH", "JS", "QH", "KH"]) or cs == Counter(["TH", "JS", "QH", "KH", "AS"]):
        return 25
    else:
        return 0

def score_flush(die):
    cs = Counter(die)
    if (cs & Counter(["9S", "JS", "AS"]) == Counter()) or (cs & Counter(["TH", "QH", "KH"]) == Counter()):
        return 15
    else:
        return 0

score_fns = {
    "one pair": partial(score_run, 2, 2, 3),
    "two pair": partial(score_two_runs, 2, 4, 5),
    "three of a kind": partial(score_run, 3, 6, 8),
    "four of a kind": partial(score_run, 4, 50, 60),
    "five of a kind": partial(score_run, 5, 200, 240),
    "full house": partial(score_two_runs, 3, 25, 30),
    "straight": score_straight,
    "flush": score_flush
}

die = ["9S", "TH", "JS", "QH", "KH", "AS"]

def roll(n):
    out = []
    for i in range(n):
        out.append(die[random.randrange(6)])
    return out

def invalid_move(msg):
    return {
        "result": False,
        "result_text": msg
    }

def next_hand(state, cat, score):
    hands = state["hands_completed"] + 1
    games = state["games_completed"]
    total = state["total_score"]
    scores = state["input"][1]
    scores.update({cat: score})

    if hands >= 8:
        hands = 0
        games += 1
        total += sum(scores.values())
        scores = {}
        if games >= 10 and total < 1000:
            return invalid_move("Game over. You didn't get enough points to win the tournament.")

    state.update({
        "input": [[roll(5)], scores],
        "hands_completed": hands,
        "games_completed": games,
        "total_score": total
    })
    return state

def next_roll(state, dice):
    prev = state["input"][0]
    scores = state["input"][1]
    if len(prev) >= 3:
        return invalid_move("You can only roll three times per hand.")

    prev.append(dice + roll(5 - len(dice)))
    state.update({
        "input": [prev, scores]
    })
    return state

def verify_dice(state, dice):
    prev = state["input"][0][-1]
    return Counter(prev) & Counter(dice) == Counter(dice)

def initial_referee(_):
    return {
        "result": True,
        "result_text": "",
        "total_score": 0,
        "games_completed": 0,
        "hands_completed": 0,
        "input": [[roll(5)], {}]
    }

def process_referee(state, action):
    if isinstance(action, str):
        die = state["input"][0][-1]
        scores = state["input"][1]
        action = action.lower()
        if action in score_fns.keys():
            return next_hand(state, action, score_fns[action](die))
        else:
            return invalid_move("Invalid category name: " + action)
    else:
        if not verify_dice(state, action):
            return invalid_move("You must choose which dice to keep from the list of dice you rolled.")
        else:
            return next_roll(state, action)

def is_win_referee(state):
    return state["games_completed"] == 10 and state["total_score"] >= 1000
"""

def initial_referee(_):
    return {
        "result": True,
        "result_text": ""
    }

def process_referee(state, action):
    return {
        "result": False,
        "result_text": "Testing"
    }

def is_win_referee(state):
    return False

api.add_listener(
    ON_CONNECT,
    CheckiORefereeMulti(
        tests={"GO": [{}]},
        initial_referee=initial_referee,
        process_referee=process_referee,
        is_win_referee=is_win_referee,
    ).on_ready)
