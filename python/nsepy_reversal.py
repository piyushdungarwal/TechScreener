# -*- coding: utf-8 -*-

import pandas as pd
import collections
import operator
from nsepy import get_history, get_index_pe_history
from datetime import date

#
# Improvements:
# 1. dating: Collect last 30 days data
# 2. Use EMAs
# 3. Use indicators: MACD, RSI
# 4. Write functions to get last low/high point

import pandas_datareader.data as web
import datetime
from datetime import date, timedelta
import sys
import fix_yahoo_finance

# File containing list of all companies
fname="NSE_EQ_LIST.py"

with open(fname) as f:
    company_list = f.readlines()
# you may also want to remove whitespace characters like `\n` at the end of each line
company_list = [x.strip() for x in company_list] 

#=====================================================
# Start and end date
day_0 = datetime.datetime(2017, 7, 30)
day_n100 = day_0 - datetime.timedelta(100)
#=====================================================

# Check if end-dates provided have stock data else decrement 
while (1):
    try:
        f = get_history(symbol="SBIN",
                    start=day_0, 
                    end=day_0)
        if f.empty:
            day_0 = day_0 - datetime.timedelta(1)
        else:
            break
    except Exception as e:
        day_0 = day_0 - datetime.timedelta(1)

print("Start date: ", day_0)

while (1):
    try:
        f = get_history(symbol="SBIN",
                    start=day_n100, 
                    end=day_n100)
        if f.empty:
            day_n100 = day_n100 - datetime.timedelta(1)
        else:
            break
    except Exception as e:
        day_n100 = day_n100 - datetime.timedelta(1)

print("End date: ", day_n100)

company_score = {}

# Loop over all companies
for company in company_list:
    try:
        # Fetch stock data
        f = get_history(symbol=company,
                    start=day_n100, 
                    end=day_0)
        
        # Set date
        f["Date"] = pd.to_datetime(f.index)
        
        # Get stock data from dataframe into array
        d = []
        sizeOfData = ctr = f.index.values.size - 1   
        
        i = 0
        while ctr >= 0:
            d.append(f.iloc[ctr])
            i += 1
            ctr -= 1
            
        #print(d[0])
        #print(d[sizeOfData])
        
        pat1 = 0
        pat2 = 0
        pat3 = 0
        
        # Pattern: 3-day Bearish trend reversal (Gap-up) with Volume
        if(d[0]['Close'] > 50               
           and d[0]['Open']*1.01 < d[0]['Close']
           
           and d[2]['Open'] > d[2]['Close']
           
           and d[0]['Open'] > d[1]['Close']
           and d[1]['Close'] < d[2]['Close']
           and d[1]['Volume'] < d[2]['Volume']):
            potential_profit = d[3]['High'] - d[0]['High']
            potential_profit = potential_profit*100/d[0]['Close']
            print("Bearish trend reversal (Long): ", company, potential_profit)
            pat1 = 1
            
        if(d[0]['Close'] > 50               
           and d[0]['Open'] > d[0]['Close']
           and d[1]['Open'] < d[1]['Close']
           and d[2]['Open'] < d[2]['Close']
           and d[0]['Open'] < d[1]['Close']
           #and d_0['Open'] > d_n1['Adj Close']
           and d[1]['Close'] > d[2]['Close']
           #and d_0['Adj Close'] > 1.05*d_0['Open']
           and d[1]['Volume'] > d[2]['Volume']
           and d[0]['Volume'] < 1.5*d[1]['Volume']):
            print("Bullish trend reversal (Short): ", company)
            pat1 = 1
        
        # Flat pullback
        
        # Double bottom
        gap = 10
        if(d[0]['Close'] >= 0.99*d[10]['Close'] and d[0]['Close'] <= 1.01*d[10]['Close'] 
        and d[5]['Close'] > 1.1*d[0]['Close']
        and d[15]['Close'] > 1.1*d[0]['Close']):
            print("Double bottom: ", company, d[0]['Close'], d[5]['Close'], d[10]['Close'], d[20]['Close'])
        
        # 20-day Uptrend
        score = 4*(d[10]['Close'] - d[20]['Close'])/d[20]['Close'] + 5*(d[0]['Close'] - d[10]['Close'])/d[10]['Close']
        
        company_score[company] = score
        
        # 3-Day rising Price-Volume-%delivery             
        if(d[0]['Close'] > d[1]['Close'] and d[1]['Close'] > d[2]['Close']
        and d[0]['Volume'] > d[1]['Volume'] and d[0]['Volume'] > d[1]['Volume']
        and d[0]['%Deliverable'] > d[1]['%Deliverable'] and d[0]['%Deliverable'] > d[1]['%Deliverable']):            
            print("Price-Vol_delivery:",company)
            
        #print(company, score)
        '''
        # Pattern: 4-day always growing
        if(d_0['Close'] < 70 and d_0['Close'] > 40 
           and d_n1['Close'] < d_0['Close']
           and d_n2['Close'] < d_n1['Close']
           and d_n3['Close'] < d_n2['Close']
           and d_n4['Close'] < d_n3['Close']
           and d_n5['Close'] < d_n4['Close']
           and d_0['Close'] > d_0['Open']
           and d_n1['Close'] > d_n1['Open']):
            print("4-day growing: ", company)
            pat2 = 1
        
        print("gg")  
        # Pattern: Pullback complete
        # Check Volume pattern
        if(d_0['Close'] > 50):
            maxClose = 0
            for day in pastdays:
                if(f.ix[day]['Close'] > maxClose):
                    maxClose = f.ix[day]['Close']
            
            noMatch = 0
            lastClose = 0
            foundMax = 0
            for day in pastdays:
                curClose = f.ix[day]['Close']
                if(curClose == maxClose):
                    foundMax = 1
                    lastClose = curClose
                    continue
                if(foundMax == 1):
                    if(curClose > lastClose):
                        noMatch = 1
                        break
                elif(curClose < lastClose):
                        noMatch = 1
                        break
                lastClose = curClose
                    
            if(noMatch == 0):
                if(d_0['Close'] > d_n1['Open'] and d_0['Close'] > d_0['Open']):
                    height = (maxClose - d_n5['Open'])
                    pullback = (d_n1['Close'] - d_n5['Open'])
                    target = (maxClose - d_0['Close'])
                    if(height > 0 and pullback > 0 and height > 2 * pullback and target > 0.5*(height-pullback)):
                        print("Pullback complete: ", company, height, pullback)
                        pat3 = 1
                    #print(f)
        print("gd")
    
        # Pattern: Broke high
        highest_1y = f_n1y.loc[f_n1y['High'].idxmax()]
        highest_6m = f_n6m.loc[f_n6m['High'].idxmax()]
        highest_3m = f_n3m.loc[f_n3m['High'].idxmax()]
        #print(company, highest_1y['High'], highest_6m['High'], highest_3m['High'], d_0['Adj Close'])
        if(highest_1y['High'] <= d_0['Adj Close']
           and highest_1y['High'] > d_n5['Adj Close']):
            print("Broke 1-year high: ", highest_1y['High'], company)
        elif(highest_6m['High'] <= d_0['Adj Close']
           and highest_6m['High'] > d_n5['Adj Close']):
            print("Broke 6-month high: ", highest_6m['High'], company)
        elif(highest_3m['High'] <= d_0['Adj Close']
           and highest_3m['High'] > d_n5['Adj Close']):
            print("Broke 3-month high: ", highest_3m['High'], company)
        
        
        # Pattern: 3 month Growth Rate
        d_n1m = f_n6m.ix[day_n1m]
        d_n2m = f_n6m.ix[day_n2m]
        d_n3m = f_n6m.ix[day_n3m]
        
        if(d_0['Adj Close']<50 and d_0['Adj Close']>20
           and (d_0['Adj Close']-d_n1m['Adj Close'])*100/d_n1m['Adj Close'] > 50):
            print(company, (d_0['Adj Close']-d_n5['Adj Close'])*100/d_n5['Adj Close'], (d_0['Adj Close']-d_n1m['Adj Close'])*100/d_n1m['Adj Close'], (d_0['Adj Close']-d_n2m['Adj Close'])*100/d_n2m['Adj Close'], (d_0['Adj Close']-d_n3m['Adj Close'])*100/d_n3m['Adj Close'])
        
        if(d_0['Adj Close']<30):
            print(company, d_0['Adj Close'])
        '''

    except Exception as e:
        #print(e)
        pass


values = sorted(company_score.items(), key=operator.itemgetter(1))
print(values)
#y=collections.OrderedDict(sorted(company_score.items()))
#for k, v in y.items(): 
#    print(k, v)