/*jshint quotmark:single,maxcomplexity:3*/
/*exported merge, declare*/

/**
 * @fileoverview Предоставляет методы для вычисления
 * линеаризации
 */

/**
 * @param {Any} it any type
 * @return {Boolea} if type of it is object then return true
 */
var isObject = function(it) {
    return Object.prototype.toString.call(it) === '[object Object]';
};

/**
 * @description Add properties to dest object from source object
 * @private
 *
 * @param {Object} dest destination object
 * @param {Object} source object from which will be copied properties
 * @param {[Function]} copyFunc function which will be called every time a property is copied
 * @return {Object} return destination object
 */
var _mixin = function(dest, source, copyFunc) {
    var name, s, empty = {};
    for (name in source) {
        s = source[name];
        if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
            dest[name] = copyFunc ? copyFunc(s) : s;
        }
    }
    return dest;
};
/**
 * @param {Object|Any} dest destination object
 * @param {Object...} sources source object. All subsequent arguments should be sources objects (subsequent from left to right)
 * @return {Object}
 */
var mixin = function(dest) {
    var i, l, _dest = isObject(dest) ? dest : {};

    for (i = 1, l = arguments.length; i < l; i+=1) {
        _mixin(_dest, arguments[i]);
    }

    return _dest;
};

/**
 * @desc Преобразовывает объект в массив
 * @nosideeffects
 *
 * @param {Object} obj Исходный объект
 * @return {Array} Массив на основе переданного объекта
 */
var toArray = function(obj) {
    return [].slice.call(obj, 0);
};

/**
 * @desc Копирует массив
 * @param {Array} vector Исходный массив
 * @return {Array} Копия исходного массива
 */
var cloneArray = function(vector) {
    return vector.slice(0);
};

/**
 * @desc Создает плоский список из списка линеаризаций классов и самих классов
 * @export
 * @nosideeffects
 *
 * @param {...Array.<Object>} var_args Список линеаризаций
 * @param {Array.<Object>} classes Список классов
 * @return {Array.<Object>} Плоский список классов после объединения. Если не удастся произвести объединение то будет брошено исключение.
 */
var merge = function( /*var_args, classes*/ ) {
    var forEachHead = function(vector, callback) {
        /* T_T слишком сложно*/
        /*jshint maxcomplexity:6*/

        var result = [];
        var badLinearization = 0;

        while (vector.length) {
            var v = vector.shift();

            // Если список пустой
            // то продолжаем дальше.
            // Такое возможно так как
            // элементы удаляются из
            // списков при проверки на isGoodHead
            if (!v.length) {
                continue;
            }

            // Если элемент прошел проверку
            // то добавляем его в результирующий список
            if (callback(v[0], vector)) {
                result.push(v.shift());
                badLinearization = 0;
            } else {
                // Иначе считаем что попытка неудачная
                badLinearization += 1;
                // Если мы прошли все элементы и так
                // и не нашли 'хорошей' головы
                // то кидаем исключение
                if (badLinearization === vector.length) {
                    throw Error('Bad Linearization');
                }
            }

            if (v.length) {
                vector.push(v);
            }
        }

        return result;
    };

    var isGoodHead = function(head, rest) {
        var isGood = true;

        // Элемент должен быть в начале списка
        // или не быть в нем. Если он присутствует
        // в списке но не удовлетворяет условиям выше
        // то ничего не делаем
        rest.forEach(function(lin) {
            if (lin.indexOf(head) > 0) {
                isGood = false;
            }
        });

        // Удаляем элемент из
        // начала всех остальных списков
        if (isGood) {
            rest.forEach(function(lin) {
                if (lin.indexOf(head) === 0) {
                    lin.shift();
                }
            });
        }

        return isGood;
    };

    var bases = toArray(arguments).map(cloneArray);
    return forEachHead(bases, isGoodHead);
};

/**
 * @desc Создает класс с множественным наследованием
 *
 * @param {String} className Имя класса
 * @param {Array=} opt_superClasses Родительские классы
 */
var declare = function(className, opt_superClasses) {
    var bases = [];
    var uberClass;
    var Tmp = function() {};
    var protoObj = {};

    opt_superClasses = opt_superClasses || [];

    opt_superClasses.forEach(function(clazz) {
        clazz.lin = clazz.lin || [clazz];
        bases.push(clazz.lin);
    });

    if (bases.length) {
        bases.push(opt_superClasses);
        bases = merge.apply(null, bases);
    }

    var ctor = function() {};
    ctor.lin = [ctor].concat(bases);
    ctor.parents = cloneArray(bases);

    while ((uberClass = bases.pop())) {
        protoObj = mixin(protoObj, uberClass.prototype);
        Tmp.prototype = protoObj;
        protoObj.constructor = uberClass;
        protoObj = new Tmp();
    }

    ctor.className = className;
    ctor.prototype = protoObj;
    ctor.prototype.constructor = ctor;

    return ctor;
};
