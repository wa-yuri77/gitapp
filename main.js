import './style.css';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';

import { generateClient } from 'aws-amplify/api';
import { createTodo } from './src/graphql/mutations';
import { listTodos } from './src/graphql/queries';
import { onCreateTodo } from './src/graphql/subscriptions';

Amplify.configure(amplifyconfig);

const client = generateClient();

const MutationButton = document.getElementById('MutationEventButton');
const MutationResult = document.getElementById('MutationResult');
const QueryResult = document.getElementById('QueryResult');
const SubscriptionResult = document.getElementById('SubscriptionResult');
const PrintButton = document.getElementById("PrintDataEvent");
const PrintResult=document.getElementById("DataResult");


async function addTodo() {
    const todo = {
        name: 'Use AppSync',
        description: `Realtime and Offline (${new Date().toLocaleString()})`
    };

    return await client.graphql({
        query: createTodo,
        variables: {
            input: todo
        }
    });
}

// async function fetchTodos() {
//     try {
//         const response = await client.graphql({
//             query: listTodos
//         });

//         response.data.listTodos.items.map((todo, i) => {
//             console.log('name:', todo.name);
//             console.log('description:', todo.description);
//             QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>-${i}`;
//         });
//     } catch (e) {
//         console.log('aaSomething went wrong', e);
//     }
// }
// // グラフの中身
async function fetchCountTodos() {
    try {
        var values = {
            'bottle': 1,
            'can': 1,
            'glass': 1,
            'burnable': 1,
            'other': 1
        };
        for(var key in values){
            // alert(key);
            console.log(key);
            if(key=='other'){
                const response = await client.graphql({
                    query: `
                        query MyQuery {
                            listTodos {
                                items {
                                    label
                                }
                            }
                        }
                    `,
                });
                // alert(response);
                const items = response.data.listTodos.items;
                values[key]=items.length;
                // alert(values[key]);
            }
            else{
                const response = await client.graphql({
                    query: `
                        query MyQuery($key: String) {
                            listTodos(filter: { label: { eq: $key } }) {
                                items {
                                    label
                                }
                            }
                        }
                    `,
                    variables: {
                        key: key, // "Bottle" に対応する変数を宣言することで、この変数をクエリ内で利用できるようになります
                    },
     
                });
                const items = response.data.listTodos.items;
                // alert(response.data.listTodos.items.length);
                values[key]=items.length;
                // alert(values[key]);
            }
        }
        values['other']=values['other']-values['bottle']-values['can']-values['glass']-values['burnable'];
        
        console.log(values);
        return values;
        
    } catch (e) {
        console.log('aSomething went wrong', e);
    }
}


function subscribeToNewTodos() {
    client.graphql({ query: onCreateTodo }).subscribe({
        next: (evt) => {
            const todo = evt.data.onCreateTodo;
            SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
        }
    });
}

function Printfunction(Data) {
    for(var key in Data){
        var names = {
            'bottle': 'ペットボトル',
            'can': 'カン',
            'glass': 'ビン',
            'burnable': '可燃ごみ',
            'other': 'その他'
        };
        PrintResult.innerHTML+=`<div class="square_${key}"><br>${names[key]}<br>${Data[key]}個</div>`;
    }
}

console.log('0');
const val = fetchCountTodos();
val.then(result => {
    // console.warn('変数 value の値は:', result);
    const sum=result["bottle"]+result["can"]+result["glass"]+result["burnable"]+result["other"]
    var pieData = [
        {
            value: Math.round(result["bottle"]/sum*100),
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "ペットボトル"
        },
        {
            value: Math.round(result["can"]/sum*100),
            color: "#41C44E",
            highlight: "#6CD173",
            label: "カン"
        },
        {
            value: Math.round(result["glass"]/sum*100),
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "ビン"
        },
        {
            value: Math.round(result["burnable"]/sum*100),
            color: "#AA49B8",
            highlight: "#C583CF",
            label: "可燃ごみ"
        },
        {
            value: Math.round(result["other"]/sum*100),
            color: "#4D5360",
            highlight: "#616774",
            label: "その他"
        }
    ];
    console.log(pieData);
    function DrawPieChart() {
    var ctx = document.getElementById("graph-area").getContext("2d");
    window.myPie = new Chart(ctx).Pie(pieData);
    };      
    DrawPieChart();
    Printfunction(result);
    
    
}).catch(error => {
    console.error('Errorghjkl;:', error);
    
});
// reloadの基本的な使い方
function doReload() {

    // reloadメソッドによりページをリロード
    // window.location.reload();
    val = fetchCountTodos();
}
 
window.addEventListener('load', function () {

    // ページ表示完了した5秒後にリロード
    setTimeout(doReload, 60000);
});


// document.addEventListener('DOMContentLoaded', function() {
//     var windowWidth = $(window).width();
//     console.log(windowWidth);
//     var windowSm = 640;
//     var appBody = document.querySelector('.app-body');

//     if (windowWidth <= windowSm) {
//         //横幅640px以下のとき（つまりスマホ時）に行う処理を書く
//         appBody.style.width = "400px";
//     } else {
//         //横幅640px超のとき（タブレット、PC）に行う処理を書く
//         appBody.style.width = '1200px';
//     }
// });

// document.addEventListener("'DOMContentLoaded'", function() {
//     var windowSm = 640;
//     var appBody = document.querySelector('.app-body');

//     var canvas = document.getElementById('graph-area');

//     // スタイルをクリア
//     canvas.style.width = '';
//     canvas.style.height = '';

//     function updateWidth() {
//         var windowWidth = window.outerWidth;

//         if (windowWidth <= windowSm) {
//             // 横幅640px以下のとき（つまりスマホ時）に行う処理を書く
//             if (appBody) {
//                 appBody.style.width = "400px";
//             }
//         } else {
//             // 横幅640px超のとき（タブレット、PC）に行う処理を書く
//             if (appBody) {
//                 appBody.style.width = '1200px';
//             }
//         }
//     }

//     // 初回実行
//     updateWidth();

//     // ウィンドウのリサイズ時にも実行
//     window.addEventListener('resize', updateWidth);
// });
// let canvasParent = document.getElementById("canvasParent");
// let canvas = document.getElementById("canvas");

// let resize = () => {
//     canvas.width = canvasParent.clientWidth;
//     canvas.height = canvasParent.clientHeight;
// };

// setInterval(() => resize(), 0);


subscribeToNewTodos();
// fetchCountTodos();
// fetchTodos();

// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'
//
// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `
//
// setupCounter(document.querySelector('#counter'))