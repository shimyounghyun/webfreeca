import React, {Component} from "react";
import {connect} from "react-redux";
import RegisterForm from "../../components/register/RegisterForm";

import * as registerAction from "../../store/modules/register";

export class RegisterFormContainer extends Component {
    handleChange = ({value}) => {
        const { changeRegisterInput } = this.props;
        changeRegisterInput({value});
    }

    render() {
        const {registerInput } = this.props;
        const { handleChange} = this;
        return (
            <div>
                <RegisterForm registerInput={registerInput} onChangeInput={handleChange}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    registerInput : state.register.registerInput
})

const mapDispatchToProps = dispatch => {
    return {
        changeRegisterInput : ({value}) => {
            dispatch(registerAction.changeRegisterInput({value}));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterFormContainer)