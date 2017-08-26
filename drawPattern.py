# -*- coding: utf-8 -*-
"""
Created on Mon Jul  3 22:03:40 2017

@author: i308327
"""
import sys
import pandas as pd
from nsepy import get_history, get_index_pe_history
from datetime import date
import pandas_datareader.data as web
import datetime
from datetime import date, timedelta
from pymongo import MongoClient
import json
import pprint


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

def getRelativePrices(SMA, r, gap):
    
    rPrices = [0]*(int(r/gap))
    
    print(SMA)
    # calculate price differences
    i = 0
    minDiff = 1000000
    day = 0
    nextday = gap
    while nextday <= r:
        rPrices[i] = SMA[nextday] - SMA[day]
        
        if rPrices[i] < minDiff:
            minDiff = rPrices[i]
        day = nextday
        nextday += gap
        i+=1
    
    print(rPrices)
    return rPrices

# Normalize array to fit max height
def normalize(arr, maxHeight):
    print("normalize:",arr)
    
    # Find Low and High point
    sum = 0
    low = sum
    high = sum
    i = 0
    while i < len(arr):
        sum += arr[i]
        if sum < low:
            low = sum
        if sum > high:
            high = sum
        i+=1
    
    height = high - low
    
    i = 0
    while i < len(arr):
        arr[i] *= (maxHeight/height)
        arr[i] = int(arr[i])
        i+=1
        
    print("normalize:xx",arr)
    return arr

def closeBy(val1, val2, error):
    if val1 <= ((100+error)/100)*val2 and val1 >= ((100-error)/100)*val2:
        return True
    else:
        return False

def comparePricePattern(SMA, r, rSlopes, gap, IPPattern, priceError, slopeError):
    #print(rSlopes, IPPattern)    
    # Compare price slopes to input pattern
    i = 0
    error = 0
    while i < len(rSlopes):
        if not(rSlopes[i] <= IPPattern[i]+slopeError and rSlopes[i] >= IPPattern[i]-slopeError):
            return False
        else:
            if rSlopes[i] > IPPattern[i]:
                error += rSlopes[i] - IPPattern[i]
            else:
                error += IPPattern[i] - rSlopes[i]
        i+=1
    
    if error > slopeError*len(IPPattern)/2:
        return False
    
    #print("cc")
    
    # Check if daily SMA price does not vary much beyond slope line
    i = 0
    slopeIndex = 0
    while i < r:
        slopeIndex = int(i/gap)
        # y1 = y2 - slope * (x2-x1)
        #print(slopeIndex, gap, r)
        expectedVal = SMA[slopeIndex*int(gap)] - rSlopes[slopeIndex] * (slopeIndex*gap - i)
        if not closeBy(SMA[i], expectedVal, priceError):
            #print(i, SMA[i], expectedVal, SMA[slopeIndex*int(gap)], SMA[(slopeIndex+1)*int(gap)], gap)
            return False
        i+=1 
        
    return True
    
    
def getSlopes(SMA, r, gap):
    rSlopes = [0]*(int(r/gap))
        
    day = 0
    nextday = gap
    i = 0
    while nextday <= r:
        #print(SMA[day], SMA[nextday], gap)
        rSlopes[i] = (SMA[day] - SMA[nextday])/gap
        i+=1
        day = nextday
        nextday += gap
    
    return rSlopes

def patternSearch(SMA, r, gap, IPPattern, IPPatternHeight, priceError, slopeError):
    rSlopes = getSlopes(SMA, r, int(gap))
    if comparePricePattern(SMA, r, rSlopes, gap, IPPattern, priceError, slopeError):
        return True
    else:
        return False

# Input values
IPDate = datetime.datetime(2017, 7, 31) #Start date
IPDateStr = IPDate.strftime('%Y-%m-%d') #String format of start date
IPPattern = [-1, -1, 0, 1, 1]             #Relative distance between input points
IPPatternLen = len(IPPattern)                        #Length of input pattern
IPPatternHeight = 5                     # Max height of pettern 
IPRange = 200                            #Last days to search pattern in
SMARange = 3                                 #Moving average of stock closing price
priceError = 7                            #Percent error when comparing stock prices
slopeError = 1                            #Percent error when comparing slopes

# Calculate different ranges to search pattern in
if IPRange == 5:
    rangeDays = [5]
elif IPRange == 10:
    rangeDays = [5, 10]
elif IPRange == 50:
    rangeDays = [5, 10, 20, 30, 40, 50]
elif IPRange == 100:
    rangeDays = [5, 10, 20, 40, 60, 80, 100]
elif IPRange == 200:
    rangeDays = [5, 10, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]
    
maxRange = rangeDays[len(rangeDays)-1]

company_sorted = {}
company_info = {}

print("Pattern search started for date:", IPDate)

for company in company_list:
    #company="ONGC"
    try:
        
        # Fetch data from DB into array
        lastDate = IPDate - datetime.timedelta(500)
        lastDateStr = lastDate.strftime('%Y-%m-%d')
        d = list(t1.find({"Symbol":company,"Date":{"$lte" : IPDateStr, "$gte" : lastDateStr}}))
        d = list(reversed(d))   #Most recent day first
        length = len(d)
        
        # Total range of stock prices needed
        rangeLen = maxRange + SMARange
        
        if (length < rangeLen):
            continue
            #raise ValueError('Unsufficient stock data compared to range of pattern!')
            
        # Calculate moving averages
        SMA = [0]*(maxRange+1)
        
        i = rangeLen - 1
        sum = 0
        while i > rangeLen - SMARange - 1:
            sum += d[i]['Close']
            i-=1
            
        SMA[i+1] = sum/SMARange
        
        while i >= 0:
            sum += d[i]['Close']
            sum -= d[i+SMARange]['Close']
            SMA[i] = sum/SMARange
            i -= 1
        
        #print(SMA)
        
        for r in rangeDays:
            # Gap between days based on range to search
            gap = r/IPPatternLen
            
            #print(r, "======================")
            # Search for pattern
            if patternSearch(SMA, r, gap, IPPattern, IPPatternHeight, priceError, slopeError):
                print("Pattern match:", company, ",", r, "days, ", "Start day:", IPDate, "End day:", d[r]['Date'])
                #break
    
        
    except Exception as e:
        print(company, e)
        pass    
        