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

fname="NSE_EQ_LIST.py"

with open(fname) as f:
    company_list = f.readlines()
# you may also want to remove whitespace characters like `\n` at the end of each line
company_list = [x.strip() for x in company_list] 

day_0 = datetime.datetime(2017, 5, 15)
day_n1 = datetime.datetime(2017, 5, 12)
day_n2 = datetime.datetime(2017, 5, 11)
day_n3 = datetime.datetime(2017, 5, 10)
day_n4 = datetime.datetime(2017, 5, 9)
day_n5 = datetime.datetime(2017, 5, 8)
day_n1m = datetime.datetime(2017, 3, 15)
day_n2m = datetime.datetime(2017, 2, 15)
day_n3m = datetime.datetime(2017, 1, 13)
day_n6m = datetime.datetime(2016, 10, 2)
day_n1y = datetime.datetime(2016, 4, 2)

pastdays = [day_n5, day_n4, day_n3, day_n2, day_n1]

#today = date.today()
#today = datetime.datetime(2017, 3, 31)
#yesterday = today - timedelta(1)
#d = today - timedelta(2)

for company in company_list:
    try:
        
        #f_n1y = web.DataReader(company+'.NS', 'yahoo', day_n1y, day_0)
        #f_n6m = web.DataReader(company+'.NS', 'yahoo', day_n6m, day_0)
        #f_n3m = web.DataReader(company+'.NS', 'yahoo', day_n3m, day_0)
        #print("Started", company)
        #f = web.DataReader(company+'.NS', 'google', day_n5, day_0)
        print("jj")
        f = web.get_data_yahoo("NSE:SBIN") 
        
        print(f)
        exit()
        
        #print("Started", company)
        #print(f)
    
        d_0 = f.ix[day_0]
        d_n1 = f.ix[day_n1]
        d_n2 = f.ix[day_n2]
        d_n3 = f.ix[day_n3]
        d_n4 = f.ix[day_n4]
        d_n5 = f.ix[day_n5]
        
        
        pat1 = 0
        pat2 = 0
        pat3 = 0
                
        
        # Pattern: 3-day Bearish trend reversal (Gap-up) with Volume
        if(d_0['Adj Close'] > 50               
           and d_0['Open'] < d_0['Adj Close']
           #and d_n1['Open'] > d_n1['Adj Close']
           and d_n2['Open'] > d_n2['Adj Close']
           #and d_n3['Open'] > d_n3['Adj Close']
           and d_0['Open'] > d_n1['Adj Close']
           and d_n1['Adj Close'] < d_n2['Adj Close']
           #and d_n2['Adj Close'] < d_n3['Adj Close']
           and d_0['Adj Close'] < 1.05*d_0['Open']
           and d_n1['Volume'] < d_n2['Volume']
           and d_0['Volume'] > 1.5*d_n1['Volume']):
            potential_profit = d_n3['High'] - d_0['High']
            potential_profit = potential_profit*100/d_0['Adj Close']
            print("Bearish trend reversal (Long): ", company, potential_profit)
            pat1 = 1
           
        if(d_0['Adj Close'] > 50               
           and d_0['Open'] > d_0['Adj Close']
           and d_n1['Open'] < d_n1['Adj Close']
           and d_n2['Open'] < d_n2['Adj Close']
           and d_0['Open'] < d_n1['Adj Close']
           #and d_0['Open'] > d_n1['Adj Close']
           and d_n1['Adj Close'] > d_n2['Adj Close']
           #and d_0['Adj Close'] > 1.05*d_0['Open']
           and d_n1['Volume'] > d_n2['Volume']
           and d_0['Volume'] < 1.5*d_n1['Volume']):
            print("Bullish trend reversal (Short): ", company)
            pat1 = 1
        
        
        # Pattern: 4-day always growing
        if(d_0['Adj Close'] < 70 and d_0['Adj Close'] > 40 
           and d_n1['Adj Close'] < d_0['Adj Close']
           and d_n2['Adj Close'] < d_n1['Adj Close']
           and d_n3['Adj Close'] < d_n2['Adj Close']
           and d_n4['Adj Close'] < d_n3['Adj Close']
           and d_n5['Adj Close'] < d_n4['Adj Close']
           and d_0['Adj Close'] > d_0['Open']
           and d_n1['Adj Close'] > d_n1['Open']):
            print("4-day growing: ", company)
            pat2 = 1
        
        
        # Pattern: Pullback complete
        # Check Volume pattern
        if(d_0['Adj Close'] > 50):
            maxClose = 0
            for day in pastdays:
                if(f.ix[day]['Adj Close'] > maxClose):
                    maxClose = f.ix[day]['Adj Close']
            
            noMatch = 0
            lastClose = 0
            foundMax = 0
            for day in pastdays:
                curClose = f.ix[day]['Adj Close']
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
                if(d_0['Adj Close'] > d_n1['Open'] and d_0['Adj Close'] > d_0['Open']):
                    height = (maxClose - d_n5['Open'])
                    pullback = (d_n1['Adj Close'] - d_n5['Open'])
                    target = (maxClose - d_0['Adj Close'])
                    if(height > 0 and pullback > 0 and height > 2 * pullback and target > 0.5*(height-pullback)):
                        print("Pullback complete: ", company, height, pullback)
                        pat3 = 1
                    #print(f)
        
        '''     
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
        print(e)
        pass
