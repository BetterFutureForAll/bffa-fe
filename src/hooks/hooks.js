import { useState, useEffect, useRef, useCallback } from 'react';
import { 
        makeYearsArray,
        getSpiDataByYear, 
        makeCountriesArray, 
        getSpiDataByCountry 
      } 
from '../services/SocialProgress';
import * as d3 from 'd3';

export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useClicked = () => {
  let [clicked, setClicked] = useState('World');
  return [clicked, setClicked];
}

export const useMouse = () => {
  let [mouse, setMouse] = useState('World');
  return [mouse, setMouse];
}

export const useScore = () => {
  let [score, setScore] = useState({ name: '', score: '' });
  return [score, setScore];
};

export const useYears = () => {
  let [years, setYears] = useState([]);
  useEffect(() => {
    if (years.length < 1 || !years) {
      makeYearsArray()
        .then(parsedYears => setYears(parsedYears));
    }
  }, [years]);
  return [years, setYears];
};

export const useHandleYearChange = () => {
  let [yearValue, setYearValue] = useState('2020');
  let handleYearChange = (e) => {
    setYearValue(e.target.value);
  };
  useEffect(() => {
    setYearValue(yearValue);
  }, [yearValue]);
  return [yearValue, handleYearChange];
};

export const useCountries = () => {
  let [countries, setCountries] = useState(["World"]);
  useEffect(() => {
    if(countries.length < 2 || !countries) {
      makeCountriesArray()
        .then(parsedCountries => setCountries(parsedCountries));
    }
  }, [countries]);
  return [countries, setCountries];
};
export const useHandleCountryChange = () => {
  let [countryValue, setCountryValue] = useState('World');
  let handleCountryChange = (e) => {
    setCountryValue(e.target.value);
  };
  useEffect(() => {
    setCountryValue(countryValue);
  }, [countryValue]);
  return [countryValue, handleCountryChange];
};

export const useDataByYear = (yearValue) => {
  let [spiByYear, setSpiByYear] = useState([]);
  useEffect(() => {
    getSpiDataByYear(yearValue)
      .then(d => setSpiByYear(d));
  }, [yearValue]);
  return [spiByYear, setSpiByYear];
};

export const useDataByCountry = (spiByYear, countryValue) => {
  let [spiByCountry, setSpiByCountry] = useState([]);
  useEffect(() => {
    if(spiByYear && countryValue) {
      getSpiDataByCountry(spiByYear, countryValue)
        .then(d => setSpiByCountry(d));
    }
    }, [spiByYear, countryValue]);
  return [spiByCountry, setSpiByCountry];
};

export const useLoopAnimator = (yearsArr) => {
  let [animatedYears, setAnimatedYears] = useState('2020');
  
  let loopWrapper = useCallback(() => {
    function yearLoop() {
      var i = 1;
      setTimeout(function () {
        //  increment the counter
        i++;
        if (i < yearsArr.length) {
          yearLoop();
        }
        //  ..  setTimeout()
      }, 1500);
    }
    yearLoop();
  }, [yearsArr]);
  
  useEffect(() => {
    let handleAnimationChange = () => {
      loopWrapper(yearsArr);
      setAnimatedYears(loopWrapper);
    };
    handleAnimationChange(animatedYears);
  }, [animatedYears, loopWrapper, yearsArr]);
  return [animatedYears];
};

export const useD3 = (renderFn, dependencies) => {
  const ref = useRef();
  useEffect(() => {
    console.log('ref', ref.current);
    console.log('dependencies', dependencies[0].data);
    if(dependencies[0].data === null) {
      return;
    }
    console.log('renderFn', renderFn(d3.select(ref.current)));
    renderFn(d3.select(ref.current));
    return () => {};
  }, dependencies);
return ref;
};

export const useFlowers = (data, svgRef, petalSize) => {
  const [flowers, setFlowers] = useState({});
  // let svgRef = useRef(null);

  useEffect(() => {

    let drawFlower = () => {
      const update = d3.select(svgRef.current)
        .selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('id', d=>{ return d.name })
        .attr('transform', (d, i) => `translate(${petalSize + (i % 10) * 100},${Math.floor(i / 10) * 100 + petalSize})`);

      //outer circle
      update
        .append('circle')
        .attr('id', 'outer')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', petalSize)
        .style('fill', '#c4c2c4');
  
      //inner circle
      update
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', d => petalSize * d.spiScale)
        .style('fill', d => { return scoreToColor(d.spi) })
  
      //individual petals
      update
        .selectAll('path')
        .data(d => d.petals)
        .enter()
        .append('path')
        .attr('d', d => d.petalPath)
        .attr('transform', d => `rotate(${d.angle}) scale(${d.petSize})`)
        .style('stroke', 'black')
        .style('fill', d => { return scoreToColor(d.colorRef) })
  
      // Add a rectangle to display name/numerics
      update
        .append('rect')
        .attr("width", petalSize * 2)
        .attr("height", petalSize * .25)
        .attr('transform', `translate(-${(petalSize)},-${petalSize})`)
        .style('fill', 'white')
  
      //name
      update
        .append('text')
        .attr('class', 'name')
        .attr('transform', (d, i) => `translate(-${(petalSize)},-${petalSize * .75})`)
        .text(d => { return d.name });
  
      //add score to inner circle
      update
        .append('text')
        .attr('class', 'score')
        .attr('transform', `translate(0,-${petalSize}) scale(${petalSize / 100})`)
        // .attr('transform', (d,i) => `scale(${petalSize / 100})`) 
        .text(d => { return d.spi });
  
        return svgRef.current;
    };

        drawFlower();
        console.log('useFlowers data', data);
        console.log('svgRef', svgRef.current);
        setFlowers(svgRef.current)
        // console.log('flowers', flowers);
    }, [data, svgRef]);

    return [flowers, setFlowers];
};


export function scoreToColor(score) {
  // console.log('data = ' + data['Social Progress Index']);
  // console.log('Score = ' + score);
  let scoreColor = d3.scaleLinear()
    .domain([0, 20, 40, 60, 80, 100])
//     .range(
// ["#f7fbff","#f6faff","#f5fafe","#f5f9fe","#f4f9fe","#f3f8fe","#f2f8fd","#f2f7fd","#f1f7fd","#f0f6fd","#eff6fc","#eef5fc","#eef5fc","#edf4fc","#ecf4fb","#ebf3fb","#eaf3fb","#eaf2fb","#e9f2fa","#e8f1fa","#e7f1fa","#e7f0fa","#e6f0f9","#e5eff9","#e4eff9","#e3eef9","#e3eef8","#e2edf8","#e1edf8","#e0ecf8","#e0ecf7","#dfebf7","#deebf7","#ddeaf7","#ddeaf6","#dce9f6","#dbe9f6","#dae8f6","#d9e8f5","#d9e7f5","#d8e7f5","#d7e6f5","#d6e6f4","#d6e5f4","#d5e5f4","#d4e4f4","#d3e4f3","#d2e3f3","#d2e3f3","#d1e2f3","#d0e2f2","#cfe1f2","#cee1f2","#cde0f1","#cce0f1","#ccdff1","#cbdff1","#cadef0","#c9def0","#c8ddf0","#c7ddef","#c6dcef","#c5dcef","#c4dbee","#c3dbee","#c2daee","#c1daed","#c0d9ed","#bfd9ec","#bed8ec","#bdd8ec","#bcd7eb","#bbd7eb","#b9d6eb","#b8d5ea","#b7d5ea","#b6d4e9","#b5d4e9","#b4d3e9","#b2d3e8","#b1d2e8","#b0d1e7","#afd1e7","#add0e7","#acd0e6","#abcfe6","#a9cfe5","#a8cee5","#a7cde5","#a5cde4","#a4cce4","#a3cbe3","#a1cbe3","#a0cae3","#9ec9e2","#9dc9e2","#9cc8e1","#9ac7e1","#99c6e1","#97c6e0","#96c5e0","#94c4df","#93c3df","#91c3df","#90c2de","#8ec1de","#8dc0de","#8bc0dd","#8abfdd","#88bedc","#87bddc","#85bcdc","#84bbdb","#82bbdb","#81badb","#7fb9da","#7eb8da","#7cb7d9","#7bb6d9","#79b5d9","#78b5d8","#76b4d8","#75b3d7","#73b2d7","#72b1d7","#70b0d6","#6fafd6","#6daed5","#6caed5","#6badd5","#69acd4","#68abd4","#66aad3","#65a9d3","#63a8d2","#62a7d2","#61a7d1","#5fa6d1","#5ea5d0","#5da4d0","#5ba3d0","#5aa2cf","#59a1cf","#57a0ce","#569fce","#559ecd","#549ecd","#529dcc","#519ccc","#509bcb","#4f9acb","#4d99ca","#4c98ca","#4b97c9","#4a96c9","#4895c8","#4794c8","#4693c7","#4592c7","#4492c6","#4391c6","#4190c5","#408fc4","#3f8ec4","#3e8dc3","#3d8cc3","#3c8bc2","#3b8ac2","#3a89c1","#3988c1","#3787c0","#3686c0","#3585bf","#3484bf","#3383be","#3282bd","#3181bd","#3080bc","#2f7fbc","#2e7ebb","#2d7dbb","#2c7cba","#2b7bb9","#2a7ab9","#2979b8","#2878b8","#2777b7","#2676b6","#2574b6","#2473b5","#2372b4","#2371b4","#2270b3","#216fb3","#206eb2","#1f6db1","#1e6cb0","#1d6bb0","#1c6aaf","#1c69ae","#1b68ae","#1a67ad","#1966ac","#1865ab","#1864aa","#1763aa","#1662a9","#1561a8","#1560a7","#145fa6","#135ea5","#135da4","#125ca4","#115ba3","#115aa2","#1059a1","#1058a0","#0f579f","#0e569e","#0e559d","#0e549c","#0d539a","#0d5299","#0c5198","#0c5097","#0b4f96","#0b4e95","#0b4d93","#0b4c92","#0a4b91","#0a4a90","#0a498e","#0a488d","#09478c","#09468a","#094589","#094487","#094386","#094285","#094183","#084082","#083e80","#083d7f","#083c7d","#083b7c","#083a7a","#083979","#083877","#083776","#083674","#083573","#083471","#083370","#08326e","#08316d","#08306b"]
//     );
    .range([
      '#c4c2c4',
      // '#f64c5c',
      '#c574fb',
      '#7484fb',
      '#00e4fb',
      '#00eb9b',
      '#20c30f'
    ]);
  return scoreColor(score);
}


//Green: #90eb00
//Blue:#00e4fb
//Red: #f64c5c

// '#c4c2c4',
// '#ffe479',
// // '#ccebc5',
// '#a8ddb5',
// '#7bccc4',
// '#4eb3d3',
// // '#2b8cbe',
// '#08589e',

// #f64c5c,
// #c574fb,
// #7484fb,
// #00e4fb,
// #00eb9b,
// #90eb00