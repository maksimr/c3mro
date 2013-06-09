/*global merge*/

describe('merge', function() {
    it('merge(O,O) -> O', function() {
        var O = {};

        expect(merge([O], [O])).toEqual([O]);
    });

    it('merge(AO,BO, AB) -> ABO', function() {
        var O = {};
        var A = {};
        var B = {};

        expect(merge([A, O], [B, O], [A, B])).toEqual([A, B, O]);
    });

    it('merge(BDEO, CDFO, BC) -> BCDEFO', function() {
        var O = {};
        var B = {};
        var C = {};
        var D = {};
        var E = {};
        var F = {};

        expect(merge([B, D, E, O], [C, D, F, O], [B, C])).toEqual([B, C, D, E, F, O]);
    });

    it('merge(AO,BAO, AB) -> Error', function() {
        var O = {};
        var A = {};
        var B = {};

        var _merge = function() {
            return merge([A, O], [B, A, O], [A, B]);
        };

        expect(_merge).toThrow();
    });
});
