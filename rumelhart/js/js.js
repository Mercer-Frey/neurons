const X = 2, N = [5, 3, 1], Xn = 40, Yn = 20, P = 2, left = 0, right = 1;
let L = N.length, w = [], S = [], out = [], Ts = [], Er = [ ['Итерация', 'Ошибка']], iteration = 0;

function rnd(min, max){ //Функция случайного числа в диапазоне min - max
    return ( min + Math.random() * (max - min) );
}
function initialization(){   //Функция инициализации весовых коэффициентов нейронной сети////////////////////////////////
    w = [];                       // обнуление массива
    N.forEach(function(value,index){//Цикл по массиву слоев НС (в каждой ячейке массива количество нейронов в слое) //value - значение перебераемой ячейки в массиве N, index - номер ячейки массива
        w.push([]); //Добавление нового пустого слоя 
        for(let i = 0; i < value; i++){ //Цикл для каждого слоя, предназначен чтобы создать нейроны, каждая итерация - это описание нейрона в слое 
            w[index].push([]); // Добавление нового нейрона в слой
            let n = index > 0 ? N[index - 1] : X; //Определение количество весов на нейроне по количеству входов в него из предыдущего слоя
            for(let j = 0; j < n; j++){ // Цикл для создания весовых коэфициентов, число n отражает количество весов в нейроне
                w[index][i].push( rnd(-0.5, 0.5)  ); //  Добавление нового весового коэффициента в нейрон
            }
        }
    })
}

function neuron(x){  //Функция нейронной сети //
    S = []; // Обнуление массива сумматоров сети
    out = []; //Обнуление функций активации сети
    N.forEach(function (layer, l){ //Цикл по каждому слою сети //layer - значение перебераемой ячейки в массиве N, l - номер ячейки массива
        S.push([]); //  Добавление нового слоя в массив сумматоров
        out.push([]); //  Добавление нового слоя в массив функций активации
        S[l] = Array(layer).fill(0); // Обнуление сумматоров нейронов в слое
        out[l] = Array(layer).fill(0); // Обнуление функций активации нейронов в слое
        w[l].forEach(function(k, j){  // Цикл перебирающий каждый нерон в слое //k - массив весовых коэффициентов нейрона, j - индекс нейрона в слое
            ((l > 0) ? out[l - 1] : x).forEach(function (value, i){ //Перебор входных воздействий в зависимости от номера слоя //value - входное значение в нейрон, i - номер входного значения 
                S[l][j] += (value * w[l][j][i]); // Суммирование произведений входных значений на весовые коэффициенты
            });
            out[l][j] = 1 / (1 + Math.exp(-0.3 * S[l][j])); //Расчет функции активации нейрона
        });
    });
    return out[L - 1][0]; // Возвращение сети значения функции активации нейрона последнего слоя
} 

// Обучающая выборка
function cArr(x, y){
    let number = 0; 
    for(let i = 1; i <= x; i++){
        for(let j = 1;j <= y; j++){
            Ts.push( [] );
            Ts[number].push( i );
            Ts[number].push( j );
            Ts[number].push( ( i <= (Xn / P) ? left : right ) );
            number++;
        }
    }
} 

function teach(m, n = 0.1){ // Процедура для обучения многослойного персептрона
    let b = []; //Инициализация массива ошибок
    for(let epoch = 0; epoch < m; epoch++){ //Эпохи обучения
    //Обратное распространение ошибки
        Ts.forEach(function(exampl, index){ //Перебор всей обучающей выборки где example - обучающий пример, а index - порядковый номер примера в обучающей выборке
            b = [];  //Обнуление массива ошибок
            let value = Ts[Math.round( rnd(0, Xn * Yn - 1) )]; //Выбираем случайный пример из обучающей выборки
            N.forEach( (v, i) => b.push([])  ); //Создаем новые пустые слои для ошибок нейронов
            for(let l = (L - 1); l >= 0; --l){ //Обратное распространение
                for( let k = 0; k < N[l]; k++ ){ //Перебираем нейроны
                    let y = neuron(value.slice(0, 2)); //Получаем ответ нейрона
                    if( l == (L - 1) ){ //Для последнего слоя
                        b[l].push(  (y - value[2]) * (y * (1 - y)) ); //Расчитываем ошибку 
                    }else{
                        let summError = 0;  //Обнуление сумматора
                        b[l + 1].forEach(function(error, Neuron){ //Перебор ошибок нейронов последующего слоя
                            summError += error * w[l + 1][Neuron][k]; //Суммируем ошибки нейроно последующего слоя
                        });
                        b[l].push(summError * (y * (1 - y))); //Записываем результат ошибки
                    }
                }
            }
            // Корректировка весов
            out.forEach(function(layer, l) { // Проходимся по всем слоям сети  //layer - содержит все нейроны в слое, а l - номер слоя
                w[l].forEach(function(k, j){  //Проходимся по всем нейронам в слое //k - массив весовых коэффициентов нейрона, а j - номер нейрона
                    k.forEach(function(weight,i){ //Перебираем весовые коэффициенты нейрона //weight - весовой коэффициент, а i номер весового коэффициента
                        let fp = out[l][j] * (1 - out[l][j]); //Производная функции активации
                        w[l][j][i] += -n * fp * b[l][j] * ( l == 0 ? value[i] : out[l - 1][i] ); //Корректировка весового коэффициента
                    }); 
                });
            });
        });
    } 
    Er.push([iteration, E() ]); //Добавление значения ошибки сети в массив по конкретной итерации обучения
    iteration++; //Увеличиваем номер интерации обучения на еденицу
    google.charts.setOnLoadCallback(drawChart); //Рендерим график ошибки сети
}

function E(){
    let s = 0;
    Ts.forEach(function (value, index){
        s += (neuron(value.slice(0, 2)) - value[2]) ** 2;
    });
    return 1 / Ts.length * s;
}
          
// График ошибки сети
google.charts.load('current', {'packages':['corechart']});  //Подключаем график из API google
function drawChart(){  //Процедура для прорисовки графика
    let data = google.visualization.arrayToDataTable(Er); //Передаем массив для прорисовки
    let options = { //  Конфигурация
        title: 'Ошибка сети', //  отображения
        curveType: 'function', //  легенд
        legend: { position: 'bottom' } //  на графике
    };
    let chart = new google.visualization.LineChart(document.querySelector('.error-network')); // Прикрепляем график к нашему блоку div
    chart.draw(data, options); //Рисуем график
}

function answer(o, x, y){ //Процедура маркирующая ячейки соответствующим цветом в зависимости от ответа
    let table = document.getElementsByClassName('visual-table__row')[y-1].getElementsByClassName('visual-table__row_ceil')[x-1]; //Получаем ячейку
    if(o <= 0.5){ // Если ответ сети меньше чем 0.5
        table.classList.toggle('visual-table__row_ceil__blue'); //Красим ячейку в синий цвет если ответ подходит под левую сторону
    }else{
        table.classList.toggle('visual-table__row_ceil__green'); //Красим ячейку в зеленый цвет если ответ подходит под правую сторону
    }
}
function mark(){
    for (let i = 0; i < Ts.length; i++) {
        answer(neuron([Ts[i][0], Ts[i][1]]), Ts[i][0], Ts[i][1]);
    }
}

function createTable(Xn, Yn){
    const body = document.querySelector('body');
    const table = document.createElement('div');
    const errorNetwork = document.createElement('div');
    table.classList.add('visual-table')
    errorNetwork.classList.add('error-network')
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
    body.appendChild(errorNetwork)
}
setInterval(() => {
    mark()
    teach(1, 0.1)
    mark()
}, 100);

window.onload = () => {initialization();cArr(Xn,Yn);createTable(Xn, Yn);mark();} //  Проведение инициализации и наполнения массива обучающей выборки при загрузке страницы



//  в первом слое должно быть колличество нейронов в котором в два раза больше колличества входов
//  общее колличество нейронов не должно быть равно или больше колличества примеров в обущающей выборки