# -*- coding: utf-8 -*-
"""
Created on Mon Jul  3 22:03:40 2017

@author: i308327
"""
import pandas as pd
from nsepy import get_history, get_index_pe_history
from datetime import date
import pandas_datareader.data as web
import datetime
from datetime import date, timedelta
from pymongo import MongoClient
import json


fname="NSE_EQ_LIST.txt"

with open(fname) as f:
    company_list = f.readlines()
# you may also want to remove whitespace characters like `\n` at the end of each line
company_list = [x.strip() for x in company_list] 

#=============================================================
#start_day = date.today() 
#end_day = date.today() 
start_day = datetime.datetime(2017, 8, 1)
end_day = datetime.datetime(2017, 8, 25)
#=============================================================

# Check if end-dates provided have stock data else decrement 
while (1):
    try:
        f = get_history(symbol="SBIN",
                    start=start_day, 
                    end=start_day)
        if f.empty:
            start_day = start_day - datetime.timedelta(1)
        else:
            break
    except Exception as e:
        start_day = start_day - datetime.timedelta(1)

print("Start date: ", start_day)

while (1):
    try:
        f = get_history(symbol="SBIN",
                    start=end_day, 
                    end=end_day)
        if f.empty:
            end_day = end_day - datetime.timedelta(1)
        else:
            break
    except Exception as e:
        end_day = end_day - datetime.timedelta(1)

print("End date: ", end_day)


client = MongoClient()
client = MongoClient('localhost', 27017)

db = client.stocks
t1=db.t1

#company = company_list[0]
for company in company_list:
    try:
        
        f = get_history(symbol=company,
                    start=start_day, 
                    end=end_day)
        
        f["Date"] = f.index.astype(str)
        
        records = json.loads(f.T.to_json()).values()
        
        #print(records)
        result = db.t1.insert(records)
        #print(result)
        print(company)
        
        for x in t1.find({"Symbol":company,"Date":end_day}):
            print(x)

    except Exception as e:
        print(company, e)
        pass

