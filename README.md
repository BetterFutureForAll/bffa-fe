## Better Future For All
***
#### Can you remember the first time you thought to yourself:  I want to leave the world a better place than I found it? <br />

Maybe it was something personal and easy.  More likely it was a big task involving yourself and your community and aimed at creating a [Better Future For All (BFFA)](https://bffa.org/). <br />

How do you approach creating a BFFA without defining and measuring what matters to people? Especially without going down the rabbit hole of economics, jobs, and GDP.  Big task.<br />

A Better Future For All framework (called SPI) exists that has measurable outcomes that are actionable, can make a difference, inspire people to think positively, and has been proven to be useful.  It works, because it measures  the capacity of a community, or society, to provide for the dimensions of: Basic Human Needs, the Foundations of Well Being, and Opportunity.  
<br />

This app is for displaying and viewing data from [Social Progress Imperative](https://www.socialprogress.org)  


---
## View it Live

  > Homepage: [Better Future For All, https://bffa.org/](https://bffa.org/)

  > Standalone: [https://betterfutureforall.netlify.app/](https://betterfutureforall.netlify.app/)

---

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

  - Installation:

    `npm install`  
  - To Run Test Suite:  

    `npm test`  

  - To Start Server:

    `npm start`  

  - To Visit App:

    `localhost:3000`  

---



## Reflection
>This project was commissioned by Better Future For All and is available as a tool for enabling social progress.
>Tools used are React, D3.js, TopoJSON, CSS, and a lot of vanilla JavaScript.
>- D3.js is great for rendering data into graphic representations. It is very good at applying accurate projections to scale datasets in custom ways. The freedom to generate custom SVGs allowed for the artistic creativity this project required. React seemed the natural framework to hold it all together, as it is easy to make modular and embed in other websites. 

---
### Goals

>The goal of this project is to provide visual representations of data gathered by Social Progress Imperative with a aim to make it easily accessible and understood by users. Rendering visualizations will help people in leadership roles to identify needs and strengths of their community in order to help improve the quality of life for the communities in meaningful and impactful ways.
---
### Road Map
  >This process was started with using the `create-react-app` boilerplate, then adding `d3` and `topojson-client`. A topoJSON map was created from the [Natural Earth Data project](https://www.naturalearthdata.com/), and then matched up to ISO identifiers that line up with the [Social Progress Imperative](https://www.socialprogress.org)'s data sets. Those data sets are originally `.xlsx` format and had to be converted to JSON exports in order for D3 to quickly parse them as we change user selections. 
---
### Challenges

> One of the main challenges was DOM manipulation. 
>- D3 wants to create real DOM objects and manipulate them directly, 
>- React wants to have virtual references and only render changes. <br />
>The first step is to use react's `useRef` as a way for React to keep a reference of the DOM created by D3. This creates a challenge for Testing as Jest will not be able to access these refs or even load in the D3 scripts properly. 

>Other challenges are in running the D3 code as a `useEffect` hook that is called to adjust the DOM as changes are needed. Often this lead to tearing it down and reconstructing it, but fortunately the math is handled quickly as the references can be Memoized. 

>At the end of the day, the technologies implemented in this project are React, D3, and a significant amount of VanillaJS, JSX, and CSS. We opted for the `create-react-app` boilerplate to minimize initial setup and invest more time in diving into creative and technological rabbit holes. 
---
### Moving Forward
>Next iterations 
>- implementing `redux` would allow the handling of state in a much cleaner way. Dispatching actions would probably allow the fight for DOM control to be handled much smoother. Rapidly prototyping new concepts in conception proved difficult to know the full state. 
>- Finding a valid testing solution to ensure stability is another needed next step. `Jest` will not properly address D3 rendered svg's