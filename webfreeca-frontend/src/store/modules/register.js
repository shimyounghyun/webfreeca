import {ajax} from "rxjs/observable/dom/ajax";
import {of} from "rxjs";
import {map, mergeMap, catchError, withLatestForm} from "rxjs/operators";
import {ofType} from "redux-observable";

const CHANGE_REGISTER_INPUT = "";

const ADD_REGISTER_SUCCESS = "";
const ADD_REGISTER_FAILURE = "";


export const changeRegisterInput = ({value}) => ({
    type : CHANGE_REGISTER_INPUT,
    payload : {value}
})

const initialState = {
    registerInput : ""
}

export const register = (state = initialState, action) => {
    switch (action.type){
        case CHANGE_REGISTER_INPUT :
            return {
                ...state,
                registerInput : action.payload.value
            };
        default :
            return state;
    }
}