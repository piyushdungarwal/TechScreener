import pandas as pd
from nsepy import get_history, get_index_pe_history
from datetime import date
import pandas_datareader.data as web
import datetime
from datetime import date, timedelta
from pymongo import MongoClient
from pprint import pprint
import operator
import csv
import math

fname="/home/payalb/Documents/TechScreener/python/NSE_EQ_LIST.txt"

with open(fname) as f:
    company_list = f.readlines()

company_list = [x.strip() for x in company_list]

#CSV to JSON Conversion
csvfile = open('I_s.csv', 'r')
reader = csv.DictReader( csvfile )
mongo_client = MongoClient()
mongo_client = MongoClient('192.168.0.102', 27017)

db = mongo_client.stocks
sector=db.sector
t1=db.t1

#===================================================================
# Input values
IPDate = datetime.datetime(2017, 9, 4)
IPDateStr = IPDate.strftime('%Y-%m-%d')
IPRange = "3-months"

# Supported range:
#
# daily
# weekly
# monthly
# 3-months
# 6-months
# yearly
#===================================================================

# print("Date: ", IPDateStr)
# print("Top performing sectors/industries for", IPRange)
# print("====================================================")

sectors = list(sector.distinct("Sector"))
industries = list(sector.distinct("Industry"))
company_sorted = {}
company_info = {}

sect_total = {}
sect_count = {}
sect_top_companies = {}
ind_total = {}
ind_count = {}
ind_top_companies = {}

for sect in sectors:
    sect_total[sect] = 0
    sect_count[sect] = 0
    sect_top_companies[sect] = {}

for ind in industries:
    ind_total[ind] = 0
    ind_count[ind] = 0
    ind_top_companies[ind] = {}

for company in company_list:
#company="IOC"
    try:
        if IPRange == "daily":
            fetchgap = 5
            actualgap = 2
            raisePercent = 1.005

        elif IPRange == "weekly":
            fetchgap = 10
            actualgap = 5
            raisePercent = 1.01

        elif IPRange == "monthly":
            fetchgap = 40
            actualgap = 20
            raisePercent = 1.05

        elif IPRange == "3-months":
            fetchgap = 100
            actualgap = 60
            raisePercent = 1.1

        elif IPRange == "6-months":
            fetchgap =200
            actualgap = 120
            raisePercent = 1.15

        elif IPRange == "yearly":
            fetchgap = 300
            actualgap = 240
            raisePercent = 1.3

        # Fetch data from DB into array
        lastDate = IPDate - datetime.timedelta(fetchgap)
        lastDateStr = lastDate.strftime('%Y-%m-%d')

        d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))

        if len(d) > actualgap:
            d = list(reversed(d))

            if d[0]["Close"] > raisePercent*d[actualgap-1]["Close"]:
                sect_total[d[0]["Sector"]] += 1
                sect_top_companies[d[0]["Sector"]][company] = ((d[0]["Close"] - d[actualgap-1]["Close"])*100/d[actualgap-1]["Close"])
                #print(company, d[0]["Close"], d[actualgap-1]["Close"], sect_top_companies[d[0]["Sector"]][company])
                ind_total[d[0]["Industry"]] += 1
                ind_top_companies[d[0]["Industry"]][company] = ((d[0]["Close"] - d[actualgap-1]["Close"])*100/d[actualgap-1]["Close"])

            sect_count[d[0]["Sector"]] += 1
            ind_count[d[0]["Industry"]] += 1

    except Exception as e:
        # print(company, e)
        pass



for key, value in sect_total.items():
    if sect_total[key] > 0:
        sect_total[key] *= math.log(sect_total[key], 2.0)
    if sect_count[key] > 0:
        sect_total[key] /= sect_count[key]
    else:
        # print("Sector:",key, "has no stocks!")


for key, value in ind_total.items():
    if ind_total[key] > 0:
        ind_total[key] *= math.log(ind_total[key], 2.0)
    if ind_count[key] > 0:
        ind_total[key] /= ind_count[key]
    else:
        # print("Industry:",key, "has no stocks!")

sorted_sect = sorted(sect_total.items(), key=operator.itemgetter(1), reverse=True)
sorted_ind = sorted(ind_total.items(), key=operator.itemgetter(1), reverse=True)

# print("============Top performing sectors=============")
for key, val in sorted_sect:
    sorted_comp = sorted(sect_top_companies[key].items(), key=operator.itemgetter(1), reverse=True)
    # print (key, val, sorted_comp)

# print("============Top performing industries=============")
for key, val in sorted_ind:
    sorted_comp = sorted(ind_top_companies[key].items(), key=operator.itemgetter(1), reverse=True)
    # print (key, val, sorted_comp)

#pprint(sorted_sect)
#pprint(sorted_ind)
