## general
### api info

Data is scraped once a week, on Sundays at noon(12pm) PST.  

### response info

Responses will always:
- be JSON
- have a "status" field
- use `null` to represent a blank field  

## root endpoint
### whatever.nofrills/getmesomedata

Append the route representing the data you would like to receive, to the above endpoint.

## get /stores
### description

This request returns store information and flyers for all the stores.  

### response

```
{
  "status": 200,
  "data": {
    "stores": [{
      // see /store/:storeID response below for details of the store objects
      },
      ...
    ]
  }
}
```

## get /stores/provinceCode/:province
### description

This request returns store information and flyers for all stores in the province identified in the two letter `province` parameter.  
Province availability may vary, but typically at least 'BC'(_British Columbia_), 'AB'(_Alberta_), and 'ON'(_Ontario_) are available. Note that the province is identified by its two letter abbreviation, while in the next query, cities are identified by their full names.  

### response

```
{
  "status": 200,
  "data": {
    "stores": [{
      // see /store/:storeID response below for details of the store objects
      },
      ...
    ]
  }
}
```

## get /stores/city/:city
### description

This request returns store information and flyers for all stores in the city identified in the `city` parameter.  

### response

```
{
  "status": 200,
  "data": {
    "stores": [{
      // see /store/:storeID response below for details of the store objects
      },
      ...
    ]
  }
}
```

## get /stores/:store_id
### description

This request returns store information and flyers for the store identified by the `store_id` parameter.  
The data.store.hours field represents the store's operating hours for this week; if any day's hours are affected by a holiday, that day will be listed in hours.holidays.  
The owner is the person's name found in the store name, ex. "Bob's NOFRILLS".  

### response

```
{
  "status": 200,
  "data": {
    "store": {
      "id": "3410",
      "owner": "Bob",
      "manager": null,
      "address": {
        "street_address": "621 Fairville Blvd",
        "city": "Vancouver",
        "province": "British Columbia",
        "postal_code": "V6E 3T7"
      },
      "hours": {
        "holidays": ["Monday"];
        "sunday": "11:00 AM - 6:00 PM",
        "monday": "Closed",
        ...
      },
      "phone_number": "111-111-1111",
      "departments": ["Pharmacy", "Produce", "Gift Cards", ...],
      "flyers": [{
        // see /store/:store_id/flyers/:flyer_id response below
        // for details of the flyer objects
        },
        ...
      ]
    }
  }
}
```

## get /stores/:store\_id/flyers
### description

This request returns only flyers for the store identified by the `store_id` parameter.  

### response

```
{
  "status": 200,
  "data": {
    "flyers": [{
        // see /store/:store_id/flyers/:flyer_id response below
        // for details of the flyer objects
      },
    ...
    ]
  }
}
```

## get /stores/:store\_id/flyers/:flyer\_id
### description

This request returns the flyer identified by the `flyer_id` parameter for the store identified by the `store_id` parameter.  

### response

```
{
  "status": 200,
  "data": {
    "flyer": {
      "id": 2,
      "store_id": "3410",
      "start_date": "Thursday September 29",
      "end_date": "Wednesday October 05",
      "products": [{
        "productTitle": "CATELLI HEALTHY HARVEST, BISTRO or SMART PASTA",
        "priceString": "0.97",
        "priceSavings": "$1.00",
        "description": "300-375 g\nselected varieties",
        "correctionNotice": null,
        "img": "http://content.flyerservices.com/xmlpublicationservice.svc/lcl/NOFR/images/30f23534-5dd4-4df6-a81d-00cd38eba750/214x214",
        "french": "pâtes"
        },
        ...
      ]
    }
  }
}
```

## errors
### description

This is the response object you might receive if there is a problem with your request. There will be a status code and an accompanying message. 

### response

```
{
  "status": 404,
  "message": "The requested resource was not found."
}
```

## halp!

If you are new to this, it may all be a little confusing. I know it was for me. So let me break it down as much as I can.  

_Tip: Change any word in the address prefaced with ":" (ex, ":province" -> "BC") to specify what you want._   

1. Open a new file; call it: `nofrillsExample.js`.
2. Add an HTTP request to this nofrills api, using the fetch api:

```javascript
// nofrillsExample.js

fetch('whatever.nofrills/getmesomedata/stores/3410/flyers/2')
  .then(function(data) {
    console.log('we got some data! here it is: ' + data);
});
```
3. Make sure you have [node installed](https://nodejs.org/en/download/).
4. Run the file from your terminal / command line (note: you must be in the directory where `nofrillsExample.js` is! [use cd](http://www.digitalcitizen.life/command-prompt-how-use-basic-commands) to do this) : 

```bash
node nofrillsExample.js
```
This will retrieve a single flyer, identified by the number "2" in the URL, from the store identified by the number "3410" in the URL. To get a flyer from a different store, change the number after "/stores/" (make sure that your new number is a valid store id though!). To get a different flyer from the same store, change the number after "/flyers/" (again, making sure the new number is also a valid flyer id - "1" is always a safe bet).  
[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is an awesome, super simple way to make HTTP requests. It takes care of a lot of the details for you. For example, we don't need to specify that we want to use the `GET` method to access the data - it is simply the default.  
The fetch call is followed by `.then()` which takes a callback which itself takes an argument, "data". There are a few things to know about this:
- "data" is not a special word; you could use any word - "information", "stuff", "whoKnowsWhatThisIsEvenGonnaBe", etc.
- fetch returns a [promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise): this means that it "promises" to do something which might take a long time; in this case, because it is going across the interwebs to get the nofrills data, it might be slow. once it's done, it hands over the data it retrieved to the callback function specified in the `.then()`.
- anything you put in the callback will only happen once the data has been retrieved
- anything you put outside of the `.then()` callback may happen at any time in relation to what is contained within it

So if we write:

```javascript
var importantThings = 'alphaghetti';

fetch('whatever.nofrills/getmesomedata/stores/3410/flyers/2')
  .then(function(stuff) {
    importantThings = stuff;
    console.log('these are really important things: ', importantThings);
});

console.log('check out these important things: ', importantThings);
```
It might look like the output should be `stuff` printed twice, since you change it before logging it. But actually, most likely first it will print "alphaghetti" and then `stuff`, because the request will be sent off to get "stuff", then the `console.log` after the fetch call will happen, then once the response comes back, fetch will have completed its promise and the callback which changes importantThings will happen.  

A small detail: make sure you don't put a semicolon between the fetch call and the .then(), or the .then() wont have access to whatever information the fetch call is getting!

#### Good luck!
