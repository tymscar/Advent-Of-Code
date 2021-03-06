def part_1():
    file = open('input.txt', 'r')
    ingredient_appearance = {}
    possible_allergens_in = {}
    finished_ingredients = {}
    finished_allergens = {}
    allergens = []
    ingredients = []

    for line in file:
        line = line.strip('\n')

        ingredients_list = line.split(" (contains ")[0].split(" ")
        allergens_list = line.split(" (contains ")[1][:-1].split(", ")

        for ingredient in ingredients_list:
            if ingredient not in ingredient_appearance:
                ingredient_appearance[ingredient] = 0
            if ingredient not in possible_allergens_in:
                possible_allergens_in[ingredient] = []

            ingredient_appearance[ingredient] += 1

            possible_allergens_in[ingredient] += allergens_list

        ingredients += ingredients_list
        allergens += allergens_list

    allergens = list(set(allergens))
    ingredients = list(set(ingredients))

    while len(finished_allergens) < len(allergens):
        for allergen in allergens:
            if allergen not in finished_allergens:
                found_equal = False
                max_amount= -1
                max_ingredient = None
                for ingredient in ingredients:
                    if ingredient not in finished_ingredients:
                        in_current = 0
                        for allergen_in_ingredient in possible_allergens_in[ingredient]:
                            if allergen_in_ingredient == allergen:
                                in_current+=1
                        if in_current == max_amount:
                            found_equal = True
                        if in_current > max_amount:
                            found_equal = False
                            max_amount = in_current
                            max_ingredient = ingredient
                if found_equal == False:
                    finished_ingredients[max_ingredient] = True
                    finished_allergens[allergen] = True

    good_ingredients = []

    for ingredient in ingredients:
        if ingredient not in finished_ingredients:
            good_ingredients.append(ingredient)

    answer = 0
    for good_ingredient in good_ingredients:
        answer += ingredient_appearance[good_ingredient]

    return answer

print(part_1())