# Solid Profile Viewer Demo App


## About Solid


Solid is a concept [introduced by Tim Berners-Lee](https://www.inrupt.com/blog/one-small-step-for-the-web) to return control over personal data back to their rightful owners (instead of in the hands of big digital corporations):

> Solid is how we evolve the web in order to restore balance - by giving every one of us complete control over data, personal or not, in a revolutionary way.
>
> Solid is a platform, built using the existing web. It gives every user a choice about where data is stored, which specific people and groups can access select elements, and which apps you use. It allows you, your family and colleagues, to link and share data with anyone. It allows people to look at the same data with different apps at the same time.

From [solid/solid repo](https://github.com/solid/solid):

> Re-decentralizing the web.
>
> **Solid** (derived from "**so**cial **li**nked **d**ata") is a proposed set of conventions and tools for building *decentralized Web applications* based on [Linked Data](http://www.w3.org/DesignIssues/LinkedData.html) principles. Solid is modular and extensible. It relies as much as possible on existing [W3C](http://www.w3.org/) standards and protocols."

From [how it works](https://solid.inrupt.com/how-it-works):

> Within the Solid ecosystem, you decide where you store your data. Photos you take, comments you write, contacts in your address book, calendar events, how many miles you run each day from your fitness tracker… they’re all stored in your **Solid POD**.

## About this demo app


This demo app is based upon [Make a Solid app on your lunch break](https://solid.inrupt.com/docs/app-on-your-lunch-break) which retrieves the full name information from a user's solid POD, identified by their unique WebID.

In addition to the base app, this demo app:
* displays home page, image and friends information
 - with parallel Promises implementation for the friends retrieval
* has a few WebID profile presets

***Note:*** *As I was implementing the friends retrieval, many WebIDs came back with fetch errors. I don't know if there is a way around this (different fetch implementations for different POD notation styles maybe?) so I decided to show the successful friend retrievals as well as the fetch errors.*


### Installation
Clone this repo.

View the app with any local web server. If you don't have one already you can install:

`npm install -g local-web-server`

Next go to the directory where the app's index.html file is located and simply run:

`ws`

(the server will start up and tell you how to access the demo page - most likely at http://localhost:8000/)
