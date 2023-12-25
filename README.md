# Advent of Code🌲

**Advent of Code** is an Advent calendar of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language you like. There's **a puzzle** each day with **two parts**. For each part you resolve, you get one **one star**, so by the end of the 25 days, if you do all the 25 puzzles with both parts you get **50 stars**.

## My story in 2023 🦀
Another year, another Advent of Code! I was quite hyped for this one because 2023 wasn't my best year in general.

The challenge for this year was to use Rust. I have read Rust code before, and I have played with some small CLI programs, but I have never used it in anger for as long as this.

There were some amazing problems this year that I enjoyed very much, such as day 19 and day 25, and some that I didn't enjoy like 24, and 21 because either I needed to use third party crates, like Z3 for 24, or there were hidden assumptions in the input such as day 21.

I got very confident in my Rust skills, and I can't wait to use it more for other projects! I was afraid at first that I will get stuck with rust's borrow checker when the problems would get harder, but that has never been the case, and it's a much easier task than I have expected. I only really got stuck with lifetimes once, but I managed to solve the issue quite quickly with the help of the compiler.

Here is a nice table for all the problems of this year, I have generated it in rust too! (It looks better in the terminal with a monospace emoji font)

```
╔════════════════════════════════════════════════════════════════════════════════════════════╗
║                                 🦀 Advent of Code 2023 🦀                                 ║
╠═════════════════════════════════════════╦══════════════════╦═════════════════════╦═════════╣
║ Day                                     ║ Part 1           ║ Part 2              ║ Time    ║
╠═════════════════════════════════════════╬════════════╦═════╬═══════════════╦═════╬═════════╣
║ Day 01: Trebuchet?!                     ║ 55538      ║ ✅ ║ 54875          ║ ✅ ║  402 μs ║
║ Day 02: Cube Conundrum                  ║ 2600       ║ ✅ ║ 86036          ║ ✅ ║  141 ms ║
║ Day 03: Gear Ratios                     ║ 527369     ║ ✅ ║ 73074886       ║ ✅ ║   15 ms ║
║ Day 04: Scratchcards                    ║ 23028      ║ ✅ ║ 9236992        ║ ✅ ║  433 μs ║
║ Day 05: If You Give A Seed A Fertilizer ║ 157211394  ║ ✅ ║ 50855035       ║ ✅ ║   76 μs ║
║ Day 06: Wait For It                     ║ 393120     ║ ✅ ║ 36872656       ║ ✅ ║   66 ms ║
║ Day 07: Camel Cards                     ║ 248422077  ║ ✅ ║ 249817836      ║ ✅ ║    6 ms ║
║ Day 08: Haunted Wasteland               ║ 13301      ║ ✅ ║ 7309459565207  ║ ✅ ║   14 ms ║
║ Day 09: Mirage Maintenance              ║ 1696140818 ║ ✅ ║ 1152           ║ ✅ ║  459 μs ║
║ Day 10: Pipe Maze                       ║ 6923       ║ ✅ ║ 529            ║ ✅ ║    4 ms ║
║ Day 11: Cosmic Expansion                ║ 9545480    ║ ✅ ║ 406725732046   ║ ✅ ║   82 ms ║
║ Day 12: Hot Springs                     ║ 7771       ║ ✅ ║ 10861030975833 ║ ✅ ║   28 ms ║
║ Day 13: Point of Incidence              ║ 32723      ║ ✅ ║ 34536          ║ ✅ ║    6 ms ║
║ Day 14: Parabolic Reflector Dish        ║ 112048     ║ ✅ ║ 105606         ║ ✅ ║   17 ms ║
║ Day 15: Lens Library                    ║ 511257     ║ ✅ ║ 239484         ║ ✅ ║  344 μs ║
║ Day 16: The Floor Will Be Lava          ║ 7472       ║ ✅ ║ 7716           ║ ✅ ║  238 ms ║
║ Day 17: Clumsy Crucible                 ║ 817        ║ ✅ ║ 925            ║ ✅ ║  262 ms ║
║ Day 18: Lavaduct Lagoon                 ║ 50603      ║ ✅ ║ 96556251590677 ║ ✅ ║   83 μs ║
║ Day 19: Aplenty                         ║ 476889     ║ ✅ ║ 132380153677887║ ✅ ║  600 μs ║
║ Day 20: Pulse Propagation               ║ 812721756  ║ ✅ ║ 233338595643977║ ✅ ║   56 ms ║
║ Day 21: Step Counter                    ║ 3773       ║ ✅ ║ 625628021226274║ ✅ ║  441 ms ║
║ Day 22: Sand Slabs                      ║ 403        ║ ✅ ║ 70189          ║ ✅ ║   12 ms ║
║ Day 23: A Long Walk                     ║ 2250       ║ ✅ ║ 6470           ║ ✅ ║    4 s  ║
║ Day 24: Never Tell Me The Odds          ║ 11246      ║ ✅ ║ 716599937560103║ ✅ ║    2 s  ║
║ Day 25: Snowverload                     ║ 507626     ║ ✅ ║                ║ ✅ ║  221 ms ║
╚═════════════════════════════════════════╩════════════╩═════╩═══════════════╩═════╩═════════╝
```

In the end, **I succeeded 🎉!**!

### What I ended up with

- I finished **all 25 days** with **both parts** for each!
- I learned Rust, and I have managed to write quick and correct programs
- I had a lot of fun and learned a bunch!

## My story in 2022 💽
By this point Advent of Code and getting 50 stars has become a clear tradition for me.

This year I found the puzzle descriptions way easier to understand, something which I know people and I used to struggle with in the past. The difficult puzzles, 16, 19 and 22 were 3 days apart so I never felt burnt out.

One challenge I set up for myself was to finish as many days as I could fully functionally this year with no side effects and mutation (of course, except input and output).

I did 14/25 days fully functionally. Usually the days I chose to do recursively I did so because of performance reasons. For day23 for example I still have part1 written both functionally and iteratively because I needed the speed for part2.
Maybe next year I will pick a language that will help me surpass the speed issues I get with recursion in TS.

In the end, **I succeeded 🎉!**!

### What I ended up with

- I finished **all 25 days** with **both parts** for each!
- I used Typescript for all the puzzles, and I enjoyed it. Made writing code in a functional way quite easy, the only issue I had was the lack of [tail call optimization](https://en.wikipedia.org/wiki/Tail_call).
- I had a lot of fun and learned a bunch!

## My story in 2021 ⌨️
So I got 50/50 stars for the past couple of year, I had to do it now as well!

The pandemic is still not over, but **Advent of Code** was there for me, something you can count on in this ocean of uncertainty.

Overall I found this year's puzzle harder than the past couple of years, and I think that is mostly because all the hard puzzles were next to eachother with no time to relax in-between. I think that if I would've missed a single puzzle post day 18, I probably wouldn't have been able to catch up and finish on time.

In the end, **I succeeded 🎉!**!

### What I ended up with

- I finished **all 25 days** with **both parts** for each!
- I used Javascript for all the puzzles, something I haven't done yet when it comes to programming challenges.
- I had a lot of fun!

## My story in 2020 👨‍💻
Last year I planned on getting **50 stars**, and, I did it. So I had no choice but to do the same this year 😏

This year was not an amazing year in general, but **Advent of Code** was a great end to it. I enjoyed every single puzzle.

This year I participated quite a bit on the subreddit as well with different visualisations of the problems that I've made in Blender.[Day 3](https://www.reddit.com/r/adventofcode/comments/k6588d/2020_day_3_raytraced_visualisation_in_blender_3d/), [Day 4](https://www.reddit.com/r/adventofcode/comments/k6o9zw/2020_day_4_passports_visualised_using_raytracing/), [Day 20](https://www.reddit.com/r/adventofcode/comments/kiyn4c/2020_day_20_after_spending_26_hours_working_on/) and [Day 24](https://www.reddit.com/r/adventofcode/comments/kjnark/2020_day_24_part_2_raytraced_visualisation_of_an/). On the [first day](https://www.reddit.com/r/adventofcode/comments/k4jkc8/2020_day_1_part_3_find_n_numbers_the_sum_up_to/) I even came up with a part 3 to the problem and people started solving it 😁
There's also lessons I've learned this year. For example on day 13 I found out about the [Chinese remainder theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem) and day 19 showed me that I need to brush up on my Regex skills.
Day 20 part 2 took me the longest by far. I tried for 3 days straight to solve it, and in the end, after 7 rewrites, it has proven to be a wrong assumption I made about how you calculate edge values. So that thought me to always question your assumptions when something goes wrong!

In the end, **I succeeded 🎉!**, and it made 2020 a tiny bit better!

### What I ended up with

- I finished **all 25 days** with **both parts** for each!
- I had the opportunity to use Python which I learned last year!
- I had a lot of fun and learned about a few new things such as the *chinese remainder theorem*!

## My story in 2019 🖥️
Last year, in 2018, I proposed to myself to get 25. One of my bucket lists items for 2019 was to get **50 stars** on **Advent of Code**.

To make it even more interesting, I've set out to **learn Python** while doing it as well. This way, I will end up with not only more knowledge of algorithms but with an extra tool in my toolset!
It proved out to be quite challenging, some days (**18** and **22**) taking me up to *12 hours* to complete (😴), while others took me less than *15 minutes*!

In the end, **I succeeded 🎉!**  I'm still not sure what the plan is for next year, but I can't wait to give it another go!

### What I ended up with

- I finished **all 25 days** with **both parts** for each!
- I've learned **Python** to a degree which will help me in the future
- I had a lot of fun and learned about a few new things such as *memoisation*!

## My story in 2018 💻

*In 2017*, when I first heard about **Advent of Code** I've only done the first 7 days and even out of those, two of them I only finished the first part of, ending up with a total of *12 stars*.

Now, in 2018, after finishing university, I started working full time. But I still wanted to keep my promise of getting _at least 25 stars_. It was very hard to keep to that promise with busy schedule but **I succeeded 🎉**. Out of the 25 days, I finished most of them with **2 stars(16/25)**. The only challenge I haven't had time to do at all was *day 24*. Three other days I did not get any star for. Days 15 and 17 work on the example input, there are some edge cases which I found when it comes to the actual input, but I just don't have enough time to debug right now. Day 20 I haven't finished either because even though the **regex** algorithm I wrote for it works, its way too slow on the real input. And we are talking hours here. So there was no reason to finish that challenge before optimising the regex code first. You could still find these "not finished days" here in this repo.

### What I ended up with

- I worked on **24 out of the 25 days**. Only missed *day 24* 😣.
- Out of those 24 (which you can find here on this github repo) **21 worked**.
- Out of those 21 that worked, **16 gave me two stars**.
- I ended up with a total of **37 stars** this year!

### What I wanted
The goal of each day for me was not to do it in the fastest manner or to have the cleanest, or most optimised code, but rather to get it working and have the logic behind of it understood. That's why this might not be the cleanest **C++** code you've seen to date 😬
