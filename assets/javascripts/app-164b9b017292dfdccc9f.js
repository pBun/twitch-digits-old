webpackJsonp([0,1],[function(e,f,a){e.exports=a(1)},function(e,f,a){"use strict";var c=a(2),d=a(3),t=a(5),b=a(8),r=a(9),i=a(14),s=c.module("twitchDigits",[t.name,d.name]);s.controller("MainController",b),s.service("Games",r),s.directive(i.DIRECTIVE_NAME,i),c.bootstrap(document.body,[s.name])},function(e,f){e.exports=angular},function(e,f,a){"use strict";var c=a(2),d=a(4),t=c.module("TwitchModule",[]);t.service("Twitch",d),e.exports=t},function(e,f,a){"use strict";var c=a(2),d=function(e,f){this.domain="https://api.twitch.tv/kraken/",this._http=e,this._q=f,this._twitchAppID="3m7g6nmmmaat5ftz9tyldgqfepk817f"};d.$inject=["$http","$q"],d.prototype.buildQueryString=function(e){e=e||{};var f=Object.keys(e).map(function(f){return e[f]?f+"="+e[f]:void 0});return"?"+f.join("&")},d.prototype.fixQueryString=function(e){var f=e.split("?"),a=f.shift();return f&&f.length&&(e=a+"?"+f.join("&")),e},d.prototype.get=function(e,f){var a=this._q.defer(),d={client_id:this._twitchAppID,callback:"JSON_CALLBACK"};f=c.extend({},f||{},d),"streams"===e&&(f.client_id=null);var t=this.buildQueryString(f),b=this.domain+e+t;return b=this.fixQueryString(b),this._http.jsonp(b).success(function(e){if(e.error){var f={};f.type="api",f.msg="",e.status&&(f.msg+=e.status+" "),e.error&&(f.msg+=e.error+": "),e.message&&(f.msg+=e.message+" "),f.msg+="("+b+")",a.reject(f)}a.resolve(e)}).error(a.reject),a.promise},e.exports=d},function(e,f,a){"use strict";var c=a(2),d=a(6),t=a(7),b=c.module("CustomFilters",[]);b.filter("percent",d),b.filter("bgImage",t),e.exports=b},function(e,f){"use strict";var a=function(e){return function(f,a){return e("number")(100*f,a||0)+"%"}};a.$inject=["$filter"],e.exports=a},function(e,f){"use strict";var a=function(){return function(e){return e?"background-image: url("+e+");":""}};a.$inject=[],e.exports=a},function(e,f){"use strict";var a=function(e){this.scope=e,this.scope.chart={},this.scope.chart.gameOffset=0,this.scope.chart.gameLimit=25,this.scope.chart.streamLimit=100,this.scope.chart.gameName="",this.scope.chart.efficiency=.1,this.scope.chart.refresh=!1,this.scope.chart.error="",this.scope.chart.ready,this.scope.calcRequests=this.calcRequests.bind(this)};a.$inject=["$scope"],a.prototype.calcRequests=function(){var e=this.scope.chart,f=e.gameLimit||e.streamLimit?1:0,a=e.gameLimit<=0?1e3:e.gameLimit<100?1:Math.ceil(e.gameLimit/100),c=e.streamLimit<=0?5*e.gameLimit:e.gameLimit;return f+a+c},e.exports=a},function(e,f,a){"use strict";var c=a(2),d=a(10),t=a(12),b=a(13),r=function(e,f){this._twitch=f,this._q=e,this.streams,this.games};r.$inject=["$q","Twitch"],r.prototype.sumViewers=function(e){return null==e?0:e.reduce(function(e,f){return null==f.viewers?e:e+f.viewers},0)},r.prototype.getGames=function(e,f,a){var d=this._q.defer();a=a||"",f=f||0,e=a?0:e;var b=e?Math.min(e-f,100):100;return this._twitch.get("games/top",{limit:b,offset:f}).then(function(r){var i=[];c.forEach(r.top,function(e){if(-1!==e.game.name.toLowerCase().indexOf(a.toLowerCase().trim())){var f=new t(e);f.name&&i.push(f)}});var s=f+b;r._total>s&&(!e||e>s)?this.getGames(e,s,a).then(function(e){i=i.concat(e),d.resolve(i)}):d.resolve(i)}.bind(this),d.reject),d.promise},r.prototype.getGameStreams=function(e,f,a){var d=this._q.defer();a=a||0;var t=f?Math.min(f-a,100):100;return this._twitch.get("streams",{limit:t,offset:a,game:e}).then(function(r){var i=[];c.forEach(r.streams,function(e){var f=new b(e);i.push(f)});var s=a+t;r._total>s&&(!f||f>s)?this.getGameStreams(e,f,s).then(function(e){i=i.concat(e),d.resolve(i)}):d.resolve(i)}.bind(this),d.reject),d.promise},r.prototype.getSnapshot=function(e){e=e||{};var f=e.gameOffset||0,a=e.gameLimit,t=0,b=e.streamLimit,r=e.gameName,i=!b,s=i&&!a&&!r,n=this._q.defer();return this.root=new d({name:"games"}),this.root.renderedViewers=0,this.getGames(f+a,f,r).then(function(e){this.root.children=e;var f=e.length;if(s||this._twitch.get("streams/summary").then(function(e){this.root.viewers=e.viewers}.bind(this),n.reject),!e||!e.length){var a={msg:"No games found.",type:"other"};n.reject(a)}c.forEach(e,function(e){this.getGameStreams(e.getEncodedName(),t+b,t).then(function(a){var c=this.sumViewers(a);e.renderedViewers=c,e.viewers=i?c:Math.max(e.viewers,c),this.root.renderedViewers+=c,s&&(this.root.viewers+=c),e.children=a,--f<=0&&n.resolve(this.root)}.bind(this),n.reject)}.bind(this))}.bind(this),n.reject),n.promise},e.exports=r},function(e,f,a){"use strict";function c(e){d.call(this,e),this.type=d.TYPES.ROOT,this.children=[]}var d=a(11);c.prototype=Object.create(d.prototype),c.prototype.constructor=c,e.exports=c},function(e,f){"use strict";var a=function(e){e=e||{},this.name=e.name||"",this.viewers=e.viewers||0};a.TYPES={ROOT:"root",STREAM:"stream",GAME:"game"},a.prototype.getEncodedName=function(){return encodeURIComponent(this.name)},e.exports=a},function(e,f,a){"use strict";function c(e){d.call(this),this.type=d.TYPES.GAME,this.name=e.game.name,this.viewers=e.viewers,this.image=e.game.box&&e.game.box.large?e.game.box.large:c.DEFAULT_IMAGE,this.children=[],this.url=c.GAME_URL_PREF+this.getEncodedName()}var d=a(11);c.prototype=Object.create(d.prototype),c.prototype.constructor=c,c.URL_PREF="http://twitch.tv/directory/game/",c.DEFAULT_IMAGE="/assets/images/404_boxart-272x380-ae5145b4.jpg",e.exports=c},function(e,f,a){"use strict";function c(e){d.call(this),this.type=d.TYPES.STREAM,this.name=e.channel.name,this.viewers=e.viewers,this.image=e.channel.logo||c.DEFAULT_IMAGE,this.url=e.channel.url}var d=a(11);c.prototype=Object.create(d.prototype),c.prototype.constructor=c,c.DEFAULT_IMAGE="/assets/images/404_user_300x300-e307234d.png",e.exports=c},function(e,f,a){"use strict";var c=a(2),d=a(15),t=a(17),b=function(e){return{restrict:"EA",scope:{refresh:"=?",ready:"=?",gameLimit:"=?",gameOffset:"=?",streamLimit:"=?",gameName:"=?",efficiency:"=?",error:"=?"},controller:d,link:function(e,f,a,d){d.init(f),c.element(window).on("resize",d.handleWindowResize.bind(d))},replace:!0,template:t}};b.$inject=["$window"],b.DIRECTIVE_NAME="games",e.exports=b},function(e,f,a){"use strict";var c=a(16),d=function(e,f){this.scope=e,this._games=f};d.$inject=["$scope","Games"],d.prototype.init=function(e){var f=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;this.scope.isMobile=f.test(navigator.userAgent),this.scope.gameData={},this.scope.chart=this.chart={},this.initChart(e),this.refreshChartData(),this.scope.$watch("refresh",function(e){e&&this.scope.ready&&(this.refreshChartData(),this.scope.refresh=!1)}.bind(this))},d.prototype.refreshChartData=function(){this.scope.error="",this.scope.ready=!1,this._games.getSnapshot({gameOffset:this.scope.gameOffset,gameLimit:this.scope.gameLimit,streamLimit:this.scope.streamLimit,gameName:this.scope.gameName}).then(function(e){this.scope.gameData=e,this.buildChart(e),this.scope.ready=!0}.bind(this),function(e){this.scope.error=e,this.scope.ready=!0}.bind(this))},d.prototype.handleWindowResize=function(e){this.initChart(),this.buildChart(this.scope.gameData)},d.prototype.initChart=function(e){var f=this.chart;f.wrapper=e&&e.length?e[0]:f.wrapper;var a=f.wrapper.parentNode,d=Math.min(a.offsetWidth,a.offsetHeight);f.width=d,f.height=d,f.radius=d/2,f.x=d3.scale.linear().range([0,2*Math.PI]),f.y=d3.scale.sqrt().range([0,f.radius]),f.colors=f.colors||d3.scale.ordinal().range(c.Spectral[11]),f.visWrapper=(f.visWrapper||d3.select(f.wrapper).append("svg:svg")).attr("class","chart").attr("width",f.width).attr("height",f.height),f.vis=(f.vis||f.visWrapper.append("svg:g")).attr("id","container").attr("transform","translate("+f.width/2+","+f.height/2+")"),f.partition=(f.partition||d3.layout.partition()).value(function(e){return e.renderedViewers||e.viewers}),f.arc=(f.arc||d3.svg.arc()).startAngle(function(e){return Math.max(0,Math.min(2*Math.PI,f.x(e.x)))}).endAngle(function(e){return Math.max(0,Math.min(2*Math.PI,f.x(e.x+e.dx)))}).innerRadius(function(e){return Math.max(0,f.y(e.y))}).outerRadius(function(e){return Math.max(0,f.y(e.y+e.dy))}),f.bounds=(f.bounds||f.vis.append("svg:circle")).attr("r",f.radius).style("opacity",0)},d.prototype.buildChart=function(e){var f=this.chart,a=this.scope;f.root=e,f.totalViewers=e.viewers;var c=f.partition.nodes(f.root).filter(function(f){if("root"===f.type)return!0;var c=("number"==typeof a.efficiency?a.efficiency:.01)/100;return"stream"===f.type?f.viewers/f.parent.viewers>c&&f.parent.viewers/e.viewers>c:f.viewers/e.viewers>c}),d=function(e){var f=[];return e.forEach(function(e){-1===f.indexOf(e.name)&&f.push(e.name)}),f}(c);f.colors.domain(d),f.path=f.vis.data([e]).selectAll("path").data(c),f.path.exit().remove(),f.path.enter().append("svg:path").on("mouseover",this.mouseoverHandler.bind(this)).on("click",this.clickHandler.bind(this)).each(function(e){e.x0=e.x,e.dx0=e.dx}),f.path.attr("display",function(e){return e.depth?null:"none"}).attr("d",f.arc).attr("fill-rule","evenodd").attr("class",function(e){return e.type}).style("fill",function(e){return f.colors(e.name)}),f.vis.on("mouseleave",this.mouseleaveHandler.bind(this))},d.prototype.setCurrentNode=function(e){var f=this.chart,a=this.scope;if(!e)return void this.removeCurrentNode();a.chart.current=e,a.chart.currentGame="stream"===e.type?e.parent:e,a.$apply();var c=this.getAncestors(e);f.visWrapper.classed("active",!0).selectAll("path").classed("current",!1).filter(function(f){var a=c.indexOf(f)>=0,d=c.indexOf(f.parent)>=0,t="stream"===e.type?a:a||d;return t}).classed("current",!0)},d.prototype.removeCurrentNode=function(){var e=this.chart,f=this.scope;return e.zoomed?(e.current=e.currentGame,void f.$apply()):(e.current=null,e.currentGame=null,f.$apply(),void e.visWrapper.classed("active",!1).selectAll("path").classed("current",!1))},d.prototype.mouseoverHandler=function(e){this.setCurrentNode(e)},d.prototype.mouseleaveHandler=function(e){this.removeCurrentNode()},d.prototype.clickHandler=function(e){var f=this.chart,a=this.scope;if(a.isMobile&&("stream"===e.type||"game"===e.type)&&e!==f.activeMobile)return void(f.activeMobile=e);if("stream"===e.type)return void window.open(e.url);f.root=f.root===e&&e.parent?e.parent:e;var c="root"!=f.root.type;clearTimeout(this.chart.zoomTimeout),f.zoomed=c,a.$apply(),this.chart.zoomTimeout=setTimeout(function(){f.visWrapper.classed("zoomed",c)},c?0:800),f.path.transition().duration(1e3).attrTween("d",this.arcTweenZoom(f.root))},d.prototype.getAncestors=function(e){for(var f=[],a=e;a.parent;)f.unshift(a),a=a.parent;return f},d.prototype.arcTweenZoom=function(e){var f=this.chart,a=d3.interpolate(f.x.domain(),[e.x,e.x+e.dx]),c=d3.interpolate(f.y.domain(),[e.y,1]);return function(e,d){return d?function(a){return f.arc(e)}:function(d){return f.x.domain(a(d)),f.y.domain(c(d)),f.arc(e)}}},e.exports=d},function(e,f){"use strict";var a={YlGn:{3:["#f7fcb9","#addd8e","#31a354"],4:["#ffffcc","#c2e699","#78c679","#238443"],5:["#ffffcc","#c2e699","#78c679","#31a354","#006837"],6:["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],7:["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],8:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],9:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]},YlGnBu:{3:["#edf8b1","#7fcdbb","#2c7fb8"],4:["#ffffcc","#a1dab4","#41b6c4","#225ea8"],5:["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],6:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],7:["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],8:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],9:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]},GnBu:{3:["#e0f3db","#a8ddb5","#43a2ca"],4:["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],5:["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],6:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],7:["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],8:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],9:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]},BuGn:{3:["#e5f5f9","#99d8c9","#2ca25f"],4:["#edf8fb","#b2e2e2","#66c2a4","#238b45"],5:["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],6:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],7:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],8:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],9:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]},PuBuGn:{3:["#ece2f0","#a6bddb","#1c9099"],4:["#f6eff7","#bdc9e1","#67a9cf","#02818a"],5:["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],6:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],7:["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],8:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],9:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]},PuBu:{3:["#ece7f2","#a6bddb","#2b8cbe"],4:["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],5:["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],6:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],7:["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],8:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],9:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]},BuPu:{3:["#e0ecf4","#9ebcda","#8856a7"],4:["#edf8fb","#b3cde3","#8c96c6","#88419d"],5:["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],6:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],7:["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],8:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],9:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]},RdPu:{3:["#fde0dd","#fa9fb5","#c51b8a"],4:["#feebe2","#fbb4b9","#f768a1","#ae017e"],5:["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],6:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],7:["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],8:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],9:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]},PuRd:{3:["#e7e1ef","#c994c7","#dd1c77"],4:["#f1eef6","#d7b5d8","#df65b0","#ce1256"],5:["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],6:["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],7:["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],8:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],9:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]},OrRd:{3:["#fee8c8","#fdbb84","#e34a33"],4:["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],5:["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],6:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],7:["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],8:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],9:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]},YlOrRd:{3:["#ffeda0","#feb24c","#f03b20"],4:["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],5:["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],6:["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],7:["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],8:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],9:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]},YlOrBr:{3:["#fff7bc","#fec44f","#d95f0e"],4:["#ffffd4","#fed98e","#fe9929","#cc4c02"],5:["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],6:["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],7:["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],8:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],9:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]},Purples:{3:["#efedf5","#bcbddc","#756bb1"],4:["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],5:["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],6:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],7:["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],8:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],9:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]},Blues:{3:["#deebf7","#9ecae1","#3182bd"],4:["#eff3ff","#bdd7e7","#6baed6","#2171b5"],5:["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],6:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],7:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],8:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],9:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]},Greens:{3:["#e5f5e0","#a1d99b","#31a354"],4:["#edf8e9","#bae4b3","#74c476","#238b45"],5:["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],6:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],7:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],8:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],9:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]},Oranges:{3:["#fee6ce","#fdae6b","#e6550d"],4:["#feedde","#fdbe85","#fd8d3c","#d94701"],5:["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],6:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],7:["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],8:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],9:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]},Reds:{3:["#fee0d2","#fc9272","#de2d26"],4:["#fee5d9","#fcae91","#fb6a4a","#cb181d"],5:["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],6:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],7:["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],8:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],9:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]},Greys:{3:["#f0f0f0","#bdbdbd","#636363"],4:["#f7f7f7","#cccccc","#969696","#525252"],5:["#f7f7f7","#cccccc","#969696","#636363","#252525"],6:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],7:["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],8:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],9:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]},PuOr:{3:["#f1a340","#f7f7f7","#998ec3"],4:["#e66101","#fdb863","#b2abd2","#5e3c99"],5:["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],6:["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],7:["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],8:["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],9:["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],10:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],11:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]},BrBG:{3:["#d8b365","#f5f5f5","#5ab4ac"],4:["#a6611a","#dfc27d","#80cdc1","#018571"],5:["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],6:["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],7:["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],8:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],9:["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],10:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],11:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]},PRGn:{3:["#af8dc3","#f7f7f7","#7fbf7b"],4:["#7b3294","#c2a5cf","#a6dba0","#008837"],5:["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],6:["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],7:["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],8:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],9:["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],10:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],11:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]},PiYG:{3:["#e9a3c9","#f7f7f7","#a1d76a"],4:["#d01c8b","#f1b6da","#b8e186","#4dac26"],5:["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],6:["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],7:["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],8:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],9:["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],10:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],11:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]},RdBu:{3:["#ef8a62","#f7f7f7","#67a9cf"],4:["#ca0020","#f4a582","#92c5de","#0571b0"],5:["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],6:["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],7:["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]},RdGy:{3:["#ef8a62","#ffffff","#999999"],4:["#ca0020","#f4a582","#bababa","#404040"],5:["#ca0020","#f4a582","#ffffff","#bababa","#404040"],6:["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],7:["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],8:["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],9:["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],10:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],11:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]},RdYlBu:{3:["#fc8d59","#ffffbf","#91bfdb"],4:["#d7191c","#fdae61","#abd9e9","#2c7bb6"],5:["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],6:["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],7:["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],8:["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],9:["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]},Spectral:{3:["#fc8d59","#ffffbf","#99d594"],4:["#d7191c","#fdae61","#abdda4","#2b83ba"],5:["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],6:["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],7:["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],8:["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],9:["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],10:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],11:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]},RdYlGn:{3:["#fc8d59","#ffffbf","#91cf60"],4:["#d7191c","#fdae61","#a6d96a","#1a9641"],5:["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"],6:["#d73027","#fc8d59","#fee08b","#d9ef8b","#91cf60","#1a9850"],7:["#d73027","#fc8d59","#fee08b","#ffffbf","#d9ef8b","#91cf60","#1a9850"],8:["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850"],9:["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"],10:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],11:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]},Accent:{3:["#7fc97f","#beaed4","#fdc086"],4:["#7fc97f","#beaed4","#fdc086","#ffff99"],5:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0"],6:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f"],7:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17"],8:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]},Dark2:{3:["#1b9e77","#d95f02","#7570b3"],4:["#1b9e77","#d95f02","#7570b3","#e7298a"],5:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e"],6:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"],7:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d"],8:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"]},Paired:{3:["#a6cee3","#1f78b4","#b2df8a"],4:["#a6cee3","#1f78b4","#b2df8a","#33a02c"],5:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99"],6:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c"],7:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f"],8:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00"],9:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"],10:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a"],11:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99"],12:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]},Pastel1:{3:["#fbb4ae","#b3cde3","#ccebc5"],4:["#fbb4ae","#b3cde3","#ccebc5","#decbe4"],5:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6"],6:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc"],7:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd"],8:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec"],9:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},Pastel2:{3:["#b3e2cd","#fdcdac","#cbd5e8"],4:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4"],5:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9"],6:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"],7:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc"],8:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"]},Set1:{3:["#e41a1c","#377eb8","#4daf4a"],4:["#e41a1c","#377eb8","#4daf4a","#984ea3"],5:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00"],6:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33"],7:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628"],8:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"],9:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]},Set2:{3:["#66c2a5","#fc8d62","#8da0cb"],4:["#66c2a5","#fc8d62","#8da0cb","#e78ac3"],5:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854"],6:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"],7:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494"],8:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"]},Set3:{3:["#8dd3c7","#ffffb3","#bebada"],4:["#8dd3c7","#ffffb3","#bebada","#fb8072"],5:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3"],6:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"],7:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69"],8:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"],9:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9"],10:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"],11:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5"],12:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]}};e.exports=a},function(e,f){e.exports='<div class=chart-wrapper data-ng-class="{\'chart-zoomed\': chart.zoomed}"><div class=explanation style={{chart.current.image|bgImage}}><div class="info stream-wrapper" data-ng-show="chart.current.type === \'stream\'"><p class=inner-info><span class=stat>{{ chart.current.viewers / chart.currentGame.viewers | percent : 2}}</span> of all <strong>{{chart.currentGame.name}}</strong> viewers are currently watching <strong>{{chart.current.name}}</strong></p></div><div class="info game-wrapper" data-ng-show="chart.current.type === \'game\'"><p class=inner-info><span class=stat>{{ chart.current.viewers / gameData.viewers | percent : 2}}</span> of all viewers are currently watching <strong>{{chart.current.name}}</strong></p></div><span class=back-info>click to go back</span></div></div>'}]);