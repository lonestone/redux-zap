"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./asynciterator-polyfill");
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
                return __assign(__assign({}, state), newPartialState);
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
        return function (dispatch, getState) { return __awaiter(_this, void 0, void 0, function () {
            var state, transformOrIterator, transformOrIterator_1, transformOrIterator_1_1, transform, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        state = getState()[namespace];
                        transformOrIterator = zap.apply(state, params);
                        if (!(typeof transformOrIterator === 'object' &&
                            transformOrIterator.next &&
                            transformOrIterator.throw &&
                            transformOrIterator.return)) return [3 /*break*/, 13];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        transformOrIterator_1 = __asyncValues(transformOrIterator);
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
        // Create action from zap
        actions[name] = createAction(namespace, zaps[name]);
        return actions;
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
        var store = storeCreators[namespace](namespace);
        stores.initialState[namespace] = store.initialState;
        stores.actions[namespace] = store.actions;
        stores.reducers[namespace] = store.reducer;
        return stores;
    }, {
        initialState: {},
        actions: {},
        reducers: {}
    });
}
exports.combineStores = combineStores;
