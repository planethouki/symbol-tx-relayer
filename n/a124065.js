(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1515:function(e,t,n){"use strict";n.r(t);n(8),n(5),n(6),n(3),n(7),n(39);var r=n(0);function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var h={data:function(){return{server:{mosaicId:"fetching...",restUrl:"fetching...",generationHash:"fetching...",signAddress:"fetching...",signAddressBalance:"fetching...",networkName:"fetching..."},client:{nodeUrl:"https://dg0nbr5d1ohfy.cloudfront.net:443",generationHash:"fetching...",networkName:"fetching..."}}},mounted:function(){var e=this;fetch("".concat("https://5kxe60w7r6.execute-api.ap-northeast-1.amazonaws.com/relayer","/info"),{mode:"cors",cache:"no-cache"}).then((function(e){return e.json()})).then((function(t){return e.server=o(o({},e.server),t),fetch("".concat(e.server.restUrl,"/network/properties"),{mode:"cors",cache:"no-cache"})})).then((function(e){return e.json()})).then((function(t){return e.server=o(o({},e.server),{},{mosaicId:t.chain.currencyMosaicId,generationHash:t.network.generationHashSeed,networkName:t.network.identifier}),fetch("".concat(e.server.restUrl,"/accounts/").concat(e.server.signAddress),{mode:"cors",cache:"no-cache"})})).then((function(e){return e.json()})).then((function(t){e.server=o(o({},e.server),{},{signAddressBalance:JSON.stringify(t.account.mosaics)})})),fetch("".concat("https://dg0nbr5d1ohfy.cloudfront.net:443","/node/info"),{mode:"cors",cache:"no-cache"}).then((function(e){return e.json()})).then((function(t){return e.client=o(o({},e.client),{},{generationHash:t.networkGenerationHashSeed}),fetch("".concat("https://dg0nbr5d1ohfy.cloudfront.net:443","/network"),{mode:"cors",cache:"no-cache"})})).then((function(e){return e.json()})).then((function(t){e.client=o(o({},e.client),{},{networkName:t.name})}))}},v=n(186),component=Object(v.a)(h,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container"},[n("section",[n("h1",[e._v("Symbol Transaction Relayer Client Sample")]),e._v(" "),n("p",[e._v("トランザクション手数料を肩代わりするサービスを使ったサンプルクライアント。")]),e._v(" "),n("b-button",{attrs:{to:"/metadata",variant:"primary"}},[e._v("Get started")])],1),e._v(" "),n("section",{staticClass:"mt-5"},[n("h4",[e._v("クライアント情報")]),e._v(" "),n("div",[e._v("使用ノード "+e._s(e.client.nodeUrl))]),e._v(" "),n("div",[e._v("ジェネレーションハッシュ "+e._s(e.client.generationHash))]),e._v(" "),n("div",[e._v("ネットワーク "+e._s(e.client.networkName))])]),e._v(" "),n("section",{staticClass:"mt-5"},[n("h4",[e._v("サーバー情報")]),e._v(" "),n("div",[e._v("使用ノード "+e._s(e.server.restUrl))]),e._v(" "),n("div",[e._v("代理署名アドレス "+e._s(e.server.signAddress))]),e._v(" "),n("div",[e._v("代理署名アドレス残高 "+e._s(e.server.signAddressBalance))]),e._v(" "),n("div",[e._v("手数料モザイクID "+e._s(e.server.mosaicId))]),e._v(" "),n("div",[e._v("ジェネレーションハッシュ "+e._s(e.server.generationHash))]),e._v(" "),n("div",[e._v("ネットワーク "+e._s(e.server.networkName))])]),e._v(" "),e._m(0)])}),[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"mt-5"},[n("a",{attrs:{target:"_blank",href:"https://github.com/planethouki/symbol-tx-relayer"}},[e._v("\n      GitHub\n    ")])])}],!1,null,null,null);t.default=component.exports}}]);