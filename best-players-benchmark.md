# Best Player Benchmark

Benchmark of the best player in each department (draft pool, historical squads).

| Department | Player            | Year | Rating | Positions |
| ---------- | ----------------- | ---- | ------ | --------- |
| ST         | Pelé              | 1970 | 96     | ST/CAM    |
| ST         | Ronaldo           | 2002 | 94     | ST        |
| LW         | Ronaldinho        | 2002 | 93     | LW/CAM    |
| RW         | Messi             | 2014 | 94     | RW/ST/CAM |
| CM         | Xavi              | 2010 | 93     | CM        |
| CM         | Iniesta           | 2010 | 93     | CAM/LW/CM |
| CAM        | Zidane            | 2006 | 94     | CAM/CM    |
| CAM        | Maradona          | 1986 | 94     | CAM/LW/ST |
| CDM        | Lothar Matthäus   | 1990 | 94     | CDM/CM    |
| LB         | Paolo Maldini     | 1994 | 93     | LB/CB     |
| CB         | Franz Beckenbauer | 1974 | 93     | CB/CM     |
| RB         | Cafu              | 2002 | 91     | RB        |
| GK         | Manuel Neuer      | 2014 | 95     | GK        |
| GK         | Oliver Kahn       | 2002 | 95     | GK        |

## Stats

### ST — Pelé 1970 (96)

Positions: ST/CAM
Stats: Finishing 96 · Pace 90 · Dribble 95 · Off Ball 96 · Stamina 92 · Composure 96

### ST — Ronaldo 2002 (94)

Positions: ST
Stats: Finishing 96 · Pace 95 · Dribble 93 · Off Ball 94 · Stamina 80 · Composure 90

### LW — Ronaldinho 2002 (93)

Positions: LW/CAM
Stats: Passing 91 · Pace 91 · Dribble 97 · Work Rate 86 · Stamina 84 · Finishing 90 · Off Ball 88 · Composure 94

### RW — Messi 2014 (94)

Positions: RW/ST/CAM
Stats: Passing 94 · Pace 90 · Dribble 95 · Work Rate 85 · Stamina 87 · Finishing 96 · Off Ball 94 · Composure 94

### CM — Xavi 2010 (93)

Positions: CM
Stats: Passing 96 · Dribble 92 · Work Rate 88 · Stamina 92 · Composure 96

### CM — Iniesta 2010 (93)

Positions: CAM/LW/CM
Stats: Passing 94 · Dribble 95 · Work Rate 88 · Stamina 90 · Composure 94

### CAM — Zidane 2006 (94)

Positions: CAM/CM
Stats: Passing 95 · Dribble 95 · Work Rate 85 · Stamina 88 · Composure 97

### CAM — Maradona 1986 (94)

Positions: CAM/LW/ST
Stats: Passing 94 · Pace 93 · Dribble 97 · Work Rate 91 · Stamina 93 · Finishing 91 · Off Ball 94 · Composure 94

### CDM — Lothar Matthäus 1990 (94)

Positions: CDM/CM
Stats: Passing 91 · Dribble 88 · Work Rate 95 · Stamina 96 · Composure 94

### LB — Paolo Maldini 1994 (93)

Positions: LB/CB
Stats: Tackling 94 · Aerial 86 · Passing 91 · Pace 91 · Work Rate 90 · Stamina 94 · Composure 96

### CB — Franz Beckenbauer 1974 (93)

Positions: CB/CM
Stats: Tackling 93 · Aerial 88 · Passing 97 · Pace 85 · Dribble 91 · Work Rate 92 · Stamina 92 · Off Ball 94 · Composure 98

### RB — Cafu 2002 (91)

Positions: RB
Stats: Tackling 87 · Aerial 76 · Passing 89 · Pace 93 · Dribble 90 · Work Rate 96 · Stamina 97 · Off Ball 93 · Composure 92

### GK — Manuel Neuer 2014 (95)

Positions: GK
Stats: Reflexes 96 · Positioning 94 · Distribution 96 · Composure 94

### GK — Oliver Kahn 2002 (95)

Positions: GK
Stats: Reflexes 96 · Positioning 96 · Distribution 88 · Composure 96

## How Positions Are Ordered

- `positions` array is sorted by preference: primary role first, alternatives after (e.g. Messi 2014 = `RW/ST/CAM`, best position `RW`)
- `bestPosition` always equals the first element — it is the role used for the rating and for slot assignment

## How Rating Is Calculated

Rating = weighted average of the player's stats using the weights of his **best position** (`roleRating`, `src/lib/draft/roles.ts`).

1. Take the player's `bestPosition` → look up `ROLE_WEIGHTS[bestPosition]` (e.g. CAM = passing 0.3, dribble 0.25, finishing 0.15, workRate 0.15, composure 0.15)
2. For each weighted stat: `value × weight`, sum them
3. Missing stat → defaults to the player's composure
4. Clamp result to 50–99, round to nearest integer

## Examples per Position

Pelé 1970: finishing .45×96 + offBall .2×96 + composure .2×96 + aerial .15×96 (missing → composure) = 96.0 → 96
Ronaldinho 2002: pace .3×91 + dribble .3×97 + finishing .2×90 + composure .2×94 = 93.2 → 93
Messi 2014: pace .3×90 + dribble .3×95 + finishing .2×96 + composure .2×94 = 93.5 → 94
Xavi 2010: passing .35×96 + workRate .2×88 + stamina .15×92 + dribble .15×92 + composure .15×96 = 93.2 → 93
Zidane 2006: passing .3×95 + dribble .25×95 + finishing .15×97 (missing → composure) + workRate .15×85 + composure .15×97 = 94.1 → 94
Lothar Matthäus 1990: tackling .3×94 (missing → composure) + passing .25×91 + workRate .2×95 + stamina .15×96 + composure .1×94 = 93.75 → 94
Paolo Maldini 1994: pace .3×91 + tackling .25×94 + passing .2×91 + stamina .15×94 + composure .1×96 = 92.7 → 93
Franz Beckenbauer 1974: tackling .35×93 + aerial .3×88 + passing .15×97 + composure .2×98 = 93.1 → 93
Cafu 2002: pace .3×93 + tackling .25×87 + passing .2×89 + stamina .15×97 + composure .1×92 = 91.2 → 91
Manuel Neuer 2014: reflexes .4×96 + positioning .3×94 + distribution .15×96 + composure .15×94 = 95.1 → 95

# Prompt:

Evaluate and update the stats for the provided list of players. Be strictly objective, ungenerous, and unbiased in your rating. Assign stats based solely on merit and proven performance, avoiding any inflated scores. And you will use this listed players above for benchmark and a refarence point. You may add importand or good players if you feel necessary, no need to add a player if he is not thet important. Use proper position names and incluse all the position the player can be played mentioned in ## How Positions Are Ordered this section (Only use GK, CB, LB, RB, CDM, CM, CAM, LM, RM, ST, LW, RW. Avoide CF,SS) [You will do web search for each team for accurate information as your taining data can give incorrect data]. A player will have all the necessary stats for all the positions he can play, like if a st is capable of cdm, he will have st and cdm stats as well.

## Output:

(No complementary text, just the expected output, if there is a major flaw or error you will mention it here)

## Nation (Year)

Franz Beckenbauer (93) - [CB/CM] (to indicate any change you will calculate the avg rating and whoe before after like this: 93 -> 9x)
Stats: Tackling 93 · Aerial 88 · Passing 97 · Pace 85 · Dribble 91 · Work Rate 92 · Stamina 92 · Off Ball 94 · Composure 98

Maradona (94) - [CAM/LW/ST]
Stats: Passing 94 · Pace 93 · Dribble 97 · Work Rate 91 · Stamina 93 · Finishing 91 · Off Ball 94 · Composure 94

....
....
