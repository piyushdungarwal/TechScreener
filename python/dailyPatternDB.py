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
import pprint
import json


fname="NSE_EQ_LIST.txt"

with open(fname) as f:
    company_list = f.readlines()
# you may also want to remove whitespace characters like `\n` at the end of each line
company_list = [x.strip() for x in company_list] 

start_day = datetime.datetime(2016, 1, 1)
end_day = datetime.datetime(2017, 7, 5)

client = MongoClient()
client = MongoClient('localhost', 27017)

db = client.stocks
t1=db.t1
'''
cursor = db["t1"].find()
f=pd.DataFrame(list(cursor))

f["Date"] = pd.to_datetime(f["Date"])
print(f["Date"] + timedelta(days=30))
'''
#company=company_list[0]
for company in company_list:
    try:
        
        f = get_history(symbol=company,
                    start=start_day, 
                    end=end_day)
        
        f["Date"] = f.index.astype(str)
        #f["Date"] = pd.to_datetime(f.index)
        #f["Date"] = datetime.datetime.strptime(f["Date"], "%Y/%m/%d")
        
        
        #print(f)
        
        records = json.loads(f.T.to_json()).values()
        
        #print(records)
        #for row in records:
        #    row["Date"] = datetime.datetime.strptime(row["Date"], "%Y/%m/%d")
        
        result = db.t1.insert_many(records)
        
    except Exception as e:
        print(e)
        pass
