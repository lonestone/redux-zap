"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var redux_react_hook_1 = require("redux-react-hook");
var redux_react_hook_2 = require("redux-react-hook");
exports.StoreContext = redux_react_hook_2.StoreContext;
exports.useDispatch = redux_react_hook_2.useDispatch;
exports.useMappedState = redux_react_hook_1.useMappedState;
function useActions(actions) {
    var dispatch = redux_react_hook_1.useDispatch();
    return Object.keys(actions).reduce(function (dispatchActions, name) {
        var _a;
        return (tslib_1.__assign({}, dispatchActions, (_a = {}, _a[name] = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return dispatch(actions[name].apply(actions, params));
        }, _a)));
    }, {});
}
exports.useActions = useActions;
