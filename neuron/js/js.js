 
let w = [], a = 0.03; //массив весовых коэффициентов
                      // коэффициент наклона функции
function initialization(n){
    for(let i = 0; i < n; i++){
        w[i] = Math.random();
    }
}

function neuron(x, w){ // х массив дендритов
    let Y = 0;
    for(let i = 0; i < x.length; i++)  {
        Y += x[i] * w[i];
    }
    return (1 / (1 + Math.exp(-a * Y))); //
}

const Xn = 120, Yn = 60, P = 2, N = 3, L = 0.5, R = 1;
// Xn колличество ячеек по горизонтали
// Yn колличество ячеек по вертикали
// P колличество плоскостей
// N колличество весовых коэффициентов
// L желаемый ответ нейрона на левой стороне
// R желаемый ответ нейрона на правой стороне
let buf = [], Ts = [], result = ['left', 'right'];
// buf буффер обучающей выборки
// Ts обучающая выборка  teach selection
function teach(){
    let k = Ts.length, n = 0.0000001; // k колличество примеров в Ts
    for(let i = 0; i < k; i++){
        let b = Ts[i][2] - neuron([Ts[i][0],Ts[i][1],1],w); // delta - хранит ошибку, от требуемого результата отнимаем текущее значение нейрона
        for(let j = 0; j < (N - 1); j++){ // j индекс весовых коэффициентов
            for(let l = 0; l <= 1; l++){ // д индекс входных коэффициентов
                w[j] += n * b * Ts[i][l]; // n скорость обучения 0 < n < 1
            }
        }
        w[N - 1] += n * b * 1; // рассчет статического входного воздействия
    }
}

function cArr(x, y){ // создание обучающей выборки принимает колличество ячеек по x y 
    let number = 0; 
    for(let i = 1; i <= x; i++){
        for(let j = 1; j <= y; j++){
            buf.push( [] );
            buf[number].push( i ); //значение по x
            buf[number].push( j ); //значение по y
            buf[number].push(( i <= (Xn/P) ? L : R )); //результат к которому должен прийти нейрон
            number++;
        }
    }
} 

function sortArr(b){ // сортировка обучающей выборки принимает буффер
    while(b.length > 0){
        Ts.push( b.pop() ); // удаляем последнюю ячейку
        Ts.push( b.shift() ); // удаляем первую ячейку
    }
}

function answer(o){
    let left = Math.abs(L - o), // по модулю отнимаем от требуемого значения то что вернул нейрон
        right = Math.abs(R - o); // по модулю отнимаем от требуемого значения то что вернул нейрон
    if(left < right){
        return result[0];
    }else{
        return result[1];
    }
}

function begin(n){
    createTable(Xn, Yn)
    initialization(n);
    cArr(Xn,Yn);
    sortArr(buf)
}


function mark(out, x, y){
    let table = document.getElementsByClassName('visual-table__row')[y - 1].getElementsByClassName('visual-table__row_ceil')[x - 1];
    if(out === result[0]){
        table.classList.toggle('visual-table__row_ceil__blue');
    }else{
        table.classList.toggle('visual-table__row_ceil__green');
    }
}

function process(){
    for(let x = 1; x <= Xn; x++){
        for(let y = 1; y <= Yn; y++){
            mark( answer(neuron([x,y] ,w)), x, y);
        }
    }
}

function createTable(Xn, Yn){
    const body = document.querySelector('body');
    const table = document.createElement('div');
    table.classList.add('visual-table')
    table.addEventListener("click", checkSide)
    for (let i = 0; i < Yn; i++) {
        const row = document.createElement('div');
        row.classList.add('visual-table__row');
        for (let j = 0; j < Xn; j++) {
            const ceil = document.createElement('div');
            ceil.classList.add('visual-table__row_ceil');
            row.appendChild(ceil)
        }
        table.appendChild(row)
    }
    body.appendChild(table)
}

function checkSide(e){
    (e.target.classList.contains('visual-table__row_ceil__blue')) ? alert(result[0]) : alert(result[1])
}

function run(){
    console.log(w);
    process();
    teach();
    process();
}

begin(3)
process();
setInterval(run, 50)

// зависимость входного воздействия только по X 