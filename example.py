# Uses beautifulSoup to extract city names from nofrills html pages.
from bs4 import BeautifulSoup
import re
import json


citySoup = BeautifulSoup(open('example.html'), "lxml")

storeLinks = citySoup.find_all(href=re.compile('store-list-page\..{2}\.'))
locations = {}

for link in storeLinks:
  alist = []
  for child in link.descendants:
    alist.append(child)
  if len(alist) == 1: 
    cityAndProvince = re.search('\..{2}\..+?\.', link['href'])
    if cityAndProvince:
      province = cityAndProvince.group(0)[1:3]
      city = cityAndProvince.group(0)[4:-1]
      locations.setdefault(province, []).append(city)

print(json.dumps(locations))
