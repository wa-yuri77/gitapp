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

async function fetchTodos() {
    try {
        const response = await client.graphql({
            query: listTodos
        });

        response.data.listTodos.items.map((todo, i) => {
            QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>-${i}`;
        });
    } catch (e) {
        console.log('Something went wrong', e);
    }
}
// ▼グラフの中身
async function fetchCountTodos() {
    try {
        var values = {
            "Bottle": 0,
            "Bottle": 0,
            "Bottle": 0,
            "Bottle": 0,
            "Bottle": 0
        };

        const promises = Object.keys(values).map(async key => {
            // alert(values[key]);
            // console.log(key);
            const response = await client.graphql({
                query: listTodos,
                variables: {
                    filter: { label: { eq: key } },
                    limit: null,
                    nextToken: null
                }
            });
            const items = response.data.listTodos.items;
            console.log(items.length);
            values[key] = items.length;
            // return items.length; // itemsの長さを返すPromiseを作成
        });

        await Promise.all(promises);
        console.log(values);

        return values;
    } catch (e) {
        console.log('Something went wrong', e);
    }
}

MutationButton.addEventListener('click', (evt) => {
    addTodo().then((evt) => {
        MutationResult.innerHTML += `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
    });
});

// PrintButton.addEventListener('click', (evt) => {
 
//     // ▼グラフの中身
//     var pieData = [
//        {
//           value: 240,            // 値
//           color:"#F7464A",       // 色
//           highlight: "#FF5A5E",  // マウスが載った際の色
//           label: "りんご"        // ラベル
//        },
//        {
//           value: 50,
//           color: "#41C44E",
//           highlight: "#6CD173",
//           label: "メロン"
//        },
//        {
//           value: 100,
//           color: "#FDB45C",
//           highlight: "#FFC870",
//           label: "みかん"
//        },
//        {
//           value: 65,
//           color: "#AA49B8",
//           highlight: "#C583CF",
//           label: "ぶどう"
//        },
//        {
//           value: 75,
//           color: "#4D5360",
//           highlight: "#616774",
//           label: "その他"
//        }
 
//     ];
 
//     // ▼上記のグラフを描画するための記述
//     window.onload = function(){
//        var ctx = document.getElementById("graph-area").getContext("2d");
//        window.myPie = new Chart(ctx).Pie(pieData);
//     };
 

// });

function subscribeToNewTodos() {
    client.graphql({ query: onCreateTodo }).subscribe({
        next: (evt) => {
            const todo = evt.data.onCreateTodo;
            SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
        }
    });
}


async function processData() {
    try {
        const result = await fetchCountTodos();

        var pieData = [
            {
                value: result["Bottle"],
                color: "#F7464A",
                highlight: "#FF5A5E",
                label: "ペットボトル"
            },
            {
                value: result["Can"],
                color: "#41C44E",
                highlight: "#6CD173",
                label: "缶"
            },
            {
                value: result["Bin"],
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "ビン"
            },
            {
                value: result["Burnable"],
                color: "#AA49B8",
                highlight: "#C583CF",
                label: "可燃ゴミ"
            },
            {
                value: result["Other"],
                color: "#4D5360",
                highlight: "#616774",
                label: "その他"
            }

        ];

        console.log(pieData);

        function DrawPieChart() {
            var ctx = document.getElementById("graph-area").getContext("2d");
            window.myPie = new Chart(ctx).Pie(pieData);
        }
        
        DrawPieChart();
    } catch (error) {
        console.error('Error:', error);
    }
}

processData();


// var pieData = [
// {
//     value: 100,            // 値
//     color:"#F7464A",       // 色
//     highlight: "#FF5A5E",  // マウスが載った際の色
//     label: "りんご"        // ラベル
// },
// {
//     value: 100,
//     color: "#41C44E",
//     highlight: "#6CD173",
//     label: "メロン"
// },
// {
//     value: 100,
//     color: "#FDB45C",
//     highlight: "#FFC870",
//     label: "みかん"
// },
// {
//     value: 100,
//     color: "#AA49B8",
//     highlight: "#C583CF",
//     label: "ぶどう"
// },
// {
//     value: 30,
//     color: "#4D5360",
//     highlight: "#616774",
//     label: "その他"
// }

// ];

// window.onload = function () {
// var ctx = document.getElementById("graph-area").getContext("2d");
// window.myPie = new Chart(ctx).Pie(pieData);
// }


// alert(toString.call(ls));
// console.log(toString.call(ls))
// console.log(`ls is ${ls}`)
// console.log(val)
subscribeToNewTodos();
// fetchCountTodos();
fetchTodos();

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