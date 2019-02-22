# size-table-webpack-plugin
A webpack plugin to show size and gziped of assets in a table


## How to use

```js
npm i --save-dev size-table-webpack-plugin
```

```js
// webpack.config.js
const SizeTableWebapckPlugin = reuire('size-table-webpack-plugin')

const config = {
  plugins: [
    new SizeTableWebapckPlugin()
  ]
}
```

<img  width="700" align="center" src="./screenshot.png" />


## options
### clear

default `false`

should clear terminal console

### premessage

the message before the size-table

### postmessage

the message after the size-table

### errorSize

default `1024 * 1024 * 500`

when asset's size is bigger than errorSize, the color of the row will be red
