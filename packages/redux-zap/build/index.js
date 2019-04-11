"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.actionPrefix = '@redux-zap/';
function createReducer(namespace, initialState) {
    return function reducer(state, action) {
        if (state === void 0) { state = initialState; }
        if (action.type === exports.actionPrefix + namespace) {
            // Transform and return state
            var newPartialState = typeof action.transform === 'function'
                ? action.transform(state)
                : action.transform;
            if (typeof newPartialState === 'object') {
                return tslib_1.__assign({}, state, newPartialState);
            }
            else {
                return newPartialState;
            }
        }
        return state;
    };
}
exports.createReducer = createReducer;
function createAction(namespace, zap) {
    var _this = this;
    // Create redux-thunk action
    return function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return function (dispatch, getState) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var e_1, _a, transformOrIterator, transformOrIterator_1, transformOrIterator_1_1, transform, e_1_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transformOrIterator = zap.apply(getState()[namespace], params);
                        if (!(typeof transformOrIterator === 'object' &&
                            transformOrIterator.next &&
                            transformOrIterator.throw &&
                            transformOrIterator.return)) return [3 /*break*/, 13];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        transformOrIterator_1 = tslib_1.__asyncValues(transformOrIterator);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, transformOrIterator_1.next()];
                    case 3:
                        if (!(transformOrIterator_1_1 = _b.sent(), !transformOrIterator_1_1.done)) return [3 /*break*/, 5];
                        transform = transformOrIterator_1_1.value;
                        dispatch({ type: exports.actionPrefix + namespace, transform: transform });
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(transformOrIterator_1_1 && !transformOrIterator_1_1.done && (_a = transformOrIterator_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(transformOrIterator_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        dispatch({ type: exports.actionPrefix + namespace, transform: transformOrIterator });
                        _b.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        }); };
    };
}
exports.createAction = createAction;
function createActions(namespace, zaps) {
    // Iterate on each zap
    return Object.keys(zaps).reduce(function (actions, name) {
        var _a;
        return (tslib_1.__assign({}, actions, (_a = {}, _a[name] = createAction(namespace, zaps[name]), _a)));
    }, {});
}
exports.createActions = createActions;
function prepareStore(initialState, zaps) {
    return function (namespace) { return ({
        initialState: initialState,
        actions: createActions(namespace, zaps),
        reducer: createReducer(namespace, initialState)
    }); };
}
exports.prepareStore = prepareStore;
function combineStores(storeCreators) {
    // Iterate on each store creator
    return Object.keys(storeCreators).reduce(function (stores, namespace) {
        var _a, _b, _c;
        var store = storeCreators[namespace](namespace);
        return {
            initialState: tslib_1.__assign({}, stores.initialState, (_a = {}, _a[namespace] = store.initialState, _a)),
            actions: tslib_1.__assign({}, stores.actions, (_b = {}, _b[namespace] = store.actions, _b)),
            reducers: tslib_1.__assign({}, stores.reducers, (_c = {}, _c[namespace] = store.reducer, _c))
        };
    }, {});
}
exports.combineStores = combineStores;
