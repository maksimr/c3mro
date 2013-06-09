/*global declare*/

describe('declare', function() {
    // Класическое наследование
    it('declare("Dog",[Animal])', function() {
        var Animal = function() {};
        Animal.prototype.kind = 'Animal';

        var Dog = declare("Dog", [Animal]);
        var dog = new Dog('Laika');

        expect(dog.kind).toEqual('Animal');
    });

    // Множественное наследование
    it('declare("Max",[Programmer, Sportsman])', function() {
        var Human = declare('Human');
        Human.prototype.walk = function() {
            return true;
        };
        Human.prototype.say = function() {
            return 'Wo-wo-wo!!!';
        };

        var Man = declare('Man', [Human]);
        Man.prototype.isMan = true;
        Man.prototype.say = function() {
            return 'I am a man!!!';
        };

        var Sportsman = declare('Sportsman', [Human]);
        Sportsman.prototype.run = function() {
            return true;
        };

        var Programmer = declare('Programmer', [Human]);
        Programmer.prototype.typing = function() {
            return true;
        };

        var Max = declare('Maksim', [Man, Sportsman, Programmer]);
        var max = new Max();

        expect(max.isMan).toEqual(true);
        expect(max.say()).toEqual('I am a man!!!');

        expect(max.run).toBeDefined();
        expect(max.typing).toBeDefined();
    });
});
