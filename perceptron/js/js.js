const  
    Xn  = 20, // - количество ячеек по горизонтали
    Yn  = 10,  // - количество ячеек по вертикали
    P   = 2,    // - количество сторон  
    N   = 9,    // — длинна входного вектора
    A   = 5,   // — количество ассоциативных элементов
    L   = 20,   // — количество реагирующих элементов
    limit = [5, 4], // - требуемое количество бит для координат x и y
    c = [
          [0, 1, 2, 3, 4, 2, 3, 1, 4],  //  Связи сесорных и ассоциативных элементов
          [1, 1, 1, 1, 1, 0, 0, 0, 0] 
        ];                    
let As  = [],      // массив ассоциативных элементов
    res = [],     // массив реагирующих элементов
    w   = [];         //  массив весовых коэффициентов 

function fillArrayXElements(x, y){ //Функция преобразования двух десятичных координат, в вектор двоичных цифр
    let X = [],  
    string = binary(x,y);   
    for(let i = 0; i < N; i++){   
        X[i] = parseInt(string[i]); 
    }  
    return X;
}   

function binary(x, y){ //Функция формаирования правильной последовательности двоичных чисел                                //
    let B = [x.toString(2), y.toString(2)],
    s ='', lengthNumber = 0;  
    for(let i = 0; i < B.length; i++){   
        lengthNumber = limit[i] - B[i].length;  
        for(let j = 1; j <= lengthNumber; j++){        
            s += '0'; 
        }     
        s += B[i];  
    }      
    return s; 
}      

function initialization(){      // Процедура инициализации весовых коэффициентов  
    w = [];                  
    for(let i =0; i < L; i++){                
        w.push([]);      
        for(let j =0; j < A; j++){                      
            w[i][j]=0;            
        }                        
    }                          
}                              

function perceptron(x, w){ ///////Функция работы персептрона/////      
    As = Array(A).fill(0); // Обнуление массивов ассоциативных
    res = Array(L).fill(0); //    и реагирующих элементов
    let input = fillArrayXElements(x[0], x[1]); //Получение вектора входных воздействий!
    for(let i = 0; i < N; i++){ // Сумматор ассоциативных элементов     
        As[c[0][i]] += input[i] * c[1][i];
    } 
    for(let i = 0; i < L; i++){ // Расчет значений реагирующих элементов
        let s = 0; //  Инициализация переменной сумматора.
        for(let j = 0; j < A; j++){ //  Сумматор реагирующих элементов 
            s += w[i][j] * As[j]; 
        } 
        if(s >= x[0]){ //  Если результат сумматора реагирующего элемента соответствует координате тогда присваевается её значение.
            res[i] = x[0]; 
        }else{ //  Иначе элемент не знает  данную координату.
            res[i] = 0; 
        } 
    } 
    return res;
}

 
let Ts = [];                                    // Обучающая выборка
const  n = 0.05,                                // Скорость обучения
       S = 200,                                 // Длинна обучающей выборки
colors = ['visual-table__row_ceil__blue',       // Синий цвет для левой стороны при правильном ответе
          'visual-table__row_ceil__red',        // Красный цвет для левой стороны при неправильном ответе
          'visual-table__row_ceil__green',      // Зленый цвет для правой стороны при правильном ответе
          'visual-table__row_ceil__yellow'      // Желтый цвет для правой стороны при неправильном ответе
         ];

function cArr(x, y){
    let number = 0;                                //    Процедура наполнения массива обучающей выборкой
    for(let i = 1; i <= x; i++){
        for(let j = 1; j <= y; j++){
            Ts.push( [] );       
            Ts[number].push( i );
            Ts[number].push( j );
            number++;
        }
    } 
}

function teach(m){  /////////////- Обучение персептрона -/////////////////
    initialization(); //  Инициализация весовых коэфициентов.
    cArr(Xn,Yn); //   Наполнение массива обучающей выборкой.
    while(m > 0){ //  Пока m больше нуля выполнять цикл обучения:// 
        m--; //  Перед каждой итерацией обучения m = m - 1;
        for(let i = 0; i < S; i++){
        let random = Math.floor( Math.random() * S ), // Получаем случайное число от 0 до 200;
            x = Ts[random][0], y = Ts[random][1], // Значения переменной "x" и "y"; 
            per = perceptron([x, y], w); // Получение ответа от персептрона; 
            for(let j = 0; j < L; j++){ // Перебор реагирующих элементов персептрона;
                if( (j + 1) == x){ // Проверяем соответствует ли реагирующий элемент опрашиваемой ячейке;
                    let b = x - per[j]; // Вычисляем ошибку реагирующего элемента;
                    for(let l = 0; l < A; l++){ // Перебор каждого входного воздействия для реагирующего элемента;
                        w[j][l] += b * n * As[l]; // Корректировка весовых коэффициентов
                    }
                } 
            }
        }
    }
}

function mark(out, x, y){ // Процедура маркировки ячеек.
    let table = document.getElementsByClassName('visual-table__row')[y - 1].getElementsByClassName('visual-table__row_ceil')[x - 1];
        condition = (c1, c2) => out[x - 1] == x ? table.classList.toggle(c1) : table.classList.toggle(c2); //  Процедура условия если выход реагирующий элемента равен номеру ячейки, тогда цвет c1 иначе цвет с2.             //     иначе цвет с2.
    (x <= 10) ? condition(colors[0],colors[1]) : condition(colors[2],colors[3]); //  Если X относится к левой стороне иначе вторая схема цветов  иначе вторая схема цветов.
} 

function process(){ // Процедура маркировки всех ячеек пространства.
    for(let x = 1; x <= Xn; x++){ //  Перебор всех ячеек по горизонтали.  
        for(let y = 1; y <= Yn; y++){ //  Перебор всех ячеек по вертикали.
            mark( perceptron([x, y], w), x, y);//  Маркировка ячейки в соответствии с ответом персептрона.
        }
    } 
} 

function createTable(Xn, Yn){
    const body = document.querySelector('body');
    const table = document.createElement('div');
    table.classList.add('visual-table')
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
function run(n){
    process();
    teach(n); 
    console.log(w)
    process();
}
void function begin(){
    createTable(Xn, Yn)
    teach(1); 
    process();
    setInterval(()=>run(1), 100)
}()


// сенсорный елемент может принимать только бинарные значения (0 или 1)
// один сенсор может передавать данные только одному ассоциативному елементу
// ассоциативный елемент может принимать множество сенсоров
// у ассоциативных елементов есть свои веса на связях ( 0, 1, -1)
// подстройка весовых коеффициентов производится только на реагирующих елементах
// каждый реагирующие елемент может классифицировать только одну сущность
