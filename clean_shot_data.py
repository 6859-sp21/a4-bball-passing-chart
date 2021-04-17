import json


with open("src/shot_pct.json") as json_file:
    print("Loading data from {}".format(json_file))
    data = json.load(json_file)

new_dict = {}
for k1, v1 in data.items():
    new_dict[k1] = {}
    for k2, v2 in v1.items():
        arr = []
        for team, val in v2.items():
            if val != None:
                arr.append({"name": team, "val": val})
            else: 
                arr.append({"name": team, "val": 0})
        new_dict[k1][k2] = arr

with open("src/shot_pct_cleaned.json", "w") as outfile:
    json.dump(new_dict, outfile)
