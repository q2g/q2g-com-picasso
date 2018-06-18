# Picasso Widget Component
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d6a7d3f94e2249c0b315e18cb51d8bf2)](https://app.codacy.com/app/konne/q2g-com-picasso?utm_source=github.com&utm_medium=referral&utm_content=q2g/q2g-com-picasso&utm_campaign=badger)
[![Downloads](https://m.sense2go.net/downloads.svg?q2g-com-picasso)](https://m.sense2go.net/extension-package)

This is a component, developed for the widget editor of Qlik Sense. The goal of this component is to enable developer to create their own Picasso.js charts in the Widget Editor. The huge advantage of this approach is, that you can easily user the property panes to customize styling of your picasso.js chart without the effort of building a complete extension.


## Intro

![teaser](./docs/teaser.PNG "Short teaser")

## Example

``` html
<q2g-com-picasso model="data.model" settings="settings">
<!--
var settingsChart = {
	scales: {
		x: {
			data: {
				extract: {
				    field: 'qDimensionInfo/0'
				},
			},
			padding: 0.4
		},
		y: {
			data: {
				field: 'qMeasureInfo/0'
			},
			expand: 0.1,
			invert: true
		}
	},
	components: [{
		type: 'axis',
		scale: 'y',
		dock: 'left'
	}, {
		type: 'axis',
		scale: 'x',
		dock: 'bottom'
	}, {
	    key: "bar",
	    type: "box",
	    data: {
	        extract: {
	            field: "qDimensionInfo/0",
    	        props: {
    	            start: 0,
    	            end: {
    	                field: "qMeasureInfo/0"
    	            }
    	        }
	        },
	    },
	    settings: {
	        major: {
	            scale: "x"
	        },
	        minor: {
	            scale: "y"
	        },
	        box: {
              fill: settings.setCol
            }
	    }
	}]
};

let chart = picasso.chart({
	element: element,
	data: data,
	settings: settingsChart
});

console.log("CHART", chart);
-->
</q2g-com-picasso>
```

## Install

### binary

1. [Download the ZIP](https://m.sense2go.net/extension-package) and unzip
2. Qlik Sense Desktop
   Copy it to: %homeptah%\Documents\Qlik\Sense\Extensions and unzip
3. Qlik Sense Entripse
   Import in the QMC

Make sure, that you have activate the new component in our widget

### source

1. Clone the Github Repo into extension directory
2. Install [nodejs](https://nodejs.org/)
3. Open Node.js command prompt
4. npm install
5. npm run build