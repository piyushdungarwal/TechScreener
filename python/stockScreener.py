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
import pprint

# Checks if 2 values are nearby
# Returns true/false
# Params:
# val1, val2, % error
def closeBy(val1, val2, perc):
    if val1 <= ((100+perc)/100)*val2 and val1 >= ((100-perc)/100)*val2:
        return True
    else:
        return False

# Finds last high point
# Returns index in array
# Params:
# d: Stock data array (recent data first), day: Start day index
# price: Type of closing price, error: error in comparison 
def getLastHigh(d, day, price, error):
    length = len(d)
    startDay = day
    
    while day < length-1 and (d[day+1][price] >= d[day][price]):
        day += 1
        
    if day == startDay or closeBy(d[startDay][price], d[day][price], error):
        return getLastHigh(d, day+1, price, error)
    else:
        return day
    
# Finds last low point
# Returns index in array
# Params:
# d: Stock data array (recent data first), day: Start day index
# price: Type of closing price, error: error in comparison
def getLastLow(d, day, price, error):
    length = len(d)
    startDay = day
    
    while day < length-1 and (d[day+1][price] <= d[day][price]):
        day += 1
    
    if day == startDay or closeBy(d[startDay][price], d[day][price], error):
        return getLastLow(d, day+1, price, error)
    else:
        return day

def getLastLow2(d, day, price, error):
    length = len(d)
    
    lowDays = []
    SMA = [0]*(length-1)
    SMA_day = 5
    
    i = length - 2
    sum = 0
    avg = 0
    while i >= day:
        sum += d[i][price]
        
        if (i + SMA_day) < (length - 1):
            sum -= d[i+SMA_day][price]
            #print(d[i]["Date"], d[i+5]["Date"])
            avg = sum/SMA_day
        else:
            avg = sum/(length - i)
       
        SMA[i] = avg
        print(d[i]["Date"], SMA[i])
        i -= 1
        
    i = 1
    while i < (length - 2):
        if SMA[i-1] > SMA [i]:            
            while SMA[i] == SMA[i+1] and i < (length - 2):
                i += 1
            if SMA[i+1] > SMA[i]:
                    #if (not closeBy(SMA[i-2], SMA[i-1], error)) and (not closeBy(SMA[i-1], SMA[i], error)):
                    lowDays.append(i+1)
        i += 1
    
    return lowDays

# Finds reversal points
# Returns list of points
# Params:
# d: Stock data array (recent data first), day: Start day index
# price: Type of closing price, error: error in comparison 
def getReversals(d, day, price, error):
    length = len(d)
    
    r = []
    
    startDay = day    

    # get lows
    while day < length-1:
        lastLow = getLastLow(d, day, price, error)
        r.append(lastLow)
        day = lastLow
        
    # get highs
    day = startDay
    while day < length-1:
        lastHigh = getLastHigh(d, day, price, error)
        r.append(lastHigh)
        day = lastHigh
        
    return r

fname="NSE_EQ_LIST.txt"

with open(fname) as f:
    company_list = f.readlines()

company_list = [x.strip() for x in company_list] 

start_day = date.today() 
end_day = date.today() 

# Create Mongo client
client = MongoClient()
client = MongoClient('localhost', 27017)

# 'stocks' is our DB and 't1' is collection containing stock data
# Index: <Company symbol, Date>
db = client.stocks
t1=db.t1

# Input values
IPDate = datetime.datetime(2017, 7, 28)
IPDateStr = IPDate.strftime('%Y-%m-%d')
IPPattern = "DeliveryRise"

# Supported pattern list: 
#    
# TrendReversal
# LastHigh
# LastLow
# DoubleBottom
# Reversals
# Supports
# Resistances

company_sorted = {}
company_info = {}

for company in company_list:
#company="IOC"
    try:
        if IPPattern == "TrendReversal":
            
            # Fetch data from DB into array
            gap = 3
            
            lastDate = IPDate - datetime.timedelta(gap)
            lastDateStr = lastDate.strftime('%Y-%m-%d')
            
            d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
            
            # Pattern filter
            if len(d) == (gap+1):
                d = list(reversed(d))
                if(d[0]['Close'] > 50               
                   and d[0]['Open']*1.01 < d[0]['Close']
                   and d[2]['Open'] > d[2]['Close']
                   and d[0]['Open'] > d[1]['Close']
                   and d[1]['Close'] < d[2]['Close']
                   and d[1]['Volume'] < d[2]['Volume']):
                    potential_profit = d[3]['High'] - d[0]['High']
                    potential_profit = potential_profit*100/d[0]['Close']
                    print("Bearish trend reversal (Long): ", company, "Potential profit: ", potential_profit)
        
        elif IPPattern == "DeliveryRise":
            
            # Fetch data from DB into array
            gap = 3
            
            lastDate = IPDate - datetime.timedelta(gap)
            lastDateStr = lastDate.strftime('%Y-%m-%d')
            
            d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
            
            # Pattern filter
            if len(d) == (gap+1):
                d = list(reversed(d))
               
                if(d[0]['Close'] > d[1]['Close'] and d[1]['Close'] > d[2]['Close']
                and d[0]['Volume'] > d[1]['Volume'] and d[1]['Volume'] > d[2]['Volume']
                and d[0]['%Deliverble'] > d[1]['%Deliverble'] and d[1]['%Deliverble'] > d[2]['%Deliverble']):            
                    print("Price-Vol-Delivery rising (3-day): ", company)
                    
        elif IPPattern == "LastHigh":
            
            # Fetch data from DB into array
            gap = 200
            error = 2
            
            lastDate = IPDate - datetime.timedelta(gap)
            lastDateStr = lastDate.strftime('%Y-%m-%d')
            
            d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
            
            # Pattern filter
            if len(d) > 2:
                d = list(reversed(d))
            
                lastHigh = getLastHigh(d, 0, 'Close', error)
                print("Last high for: ", company, "is on: ", d[lastHigh]['Date'])
    
        elif IPPattern == "LastLow":
            
            # Fetch data from DB into array
            gap = 200
            error = 1
            
            lastDate = IPDate - datetime.timedelta(gap)
            lastDateStr = lastDate.strftime('%Y-%m-%d')
            
            d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
            
            # Pattern filter
            if len(d) > 2:
                d = list(reversed(d))
            
                lastLows = getLastLow2(d, 0, 'Close', error)
                lowDates = []
                for x in lastLows:
                    lowDates.append(d[x]["Date"])
                print("Last lows for: ", company, "are on: ", lowDates)
    
        elif IPPattern == "DoubleBottom":
          
            gap = 200
            error = 4
            score = 0
            
            # Fetch data from DB into array
            lastDate = IPDate - datetime.timedelta(gap)
            lastDateStr = lastDate.strftime('%Y-%m-%d')
            
            d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
            
            # Pattern filter
            bottomGap = 4
            
            if len(d) > 2:
                d = list(reversed(d))
            
                lastLow = getLastLow(d, 0, 'Close', error)
                if lastLow != 0 and lastLow > bottomGap:
                    if closeBy(d[0]['Close'], d[lastLow]['Close'], 1):
                        lastHighOfLastLow = getLastHigh(d, lastLow, 'Close', error)
                        if lastHighOfLastLow - lastLow > 4:
                            print("Double bottom for: ", company, "Last bottom:", d[lastLow]["Date"])
                            
                            # Score: 
                            # Difference of each point in double bottom wrt bottom
                            # Today's price movement
                            i = 0
                            while i < lastHighOfLastLow:
                                score += (d[i]['Close'] - d[0]['Close'])*100/d[0]['Close']
                                i += 1
                            score += i*(d[0]['Close'] - d[0]['Open'])*100/d[0]['Open']
                            
                            company_sorted[company] = score 
                            company_info[company] = "last bottom at: "+ str(d[lastLow]["Date"])
                            
        elif IPPattern == "Reversals":
            
            # Fetch data from DB into array
            gap = 100
            error = 2
            
            lastDate = IPDate - datetime.timedelta(gap)
            lastDateStr = lastDate.strftime('%Y-%m-%d')
            
            d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
            
            # Pattern filter            
            if len(d) > 2:
                d = list(reversed(d))
                
                r = getReversals(d, 0, 'Close', error)
        
                print("Reversal points for: ", company)
                for x in r:
                    print(d[x]["Date"])
        
    except Exception as e:
        print(company, e)
        pass    
    
values = sorted(company_sorted.items(), key=operator.itemgetter(1))
for c in values:
    print(c[0], "Score:", c[1], company_info[c[0]])
