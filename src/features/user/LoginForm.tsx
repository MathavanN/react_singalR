import React, { useContext } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header, Image, Message } from "semantic-ui-react";
import { combineValidators, isRequired } from "revalidate";
import { IUserLogin } from "../../app/models/user";
import TextInput from "../../app/common/form/TextInput";
import { FORM_ERROR } from "final-form";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password"),
});
const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IUserLogin) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as="h2" color="teal" textAlign="center">
            <Image src="/assets/logo.png" />
            Login to SignalR App
          </Header>
          <Field
            name="email"
            component={TextInput as any}
            placeholder="Email"
          />
          <Field
            name="password"
            component={TextInput as any}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text="Invalid username or password"
            />
          )}
          <Button
            loading={submitting}
            positive
            content="Login"
            fluid
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
          />
          <Message>
            Nee to hookup register form
            {/* New to SignalR App Demo? <a href="#">Sign Up</a> */}
          </Message>
        </Form>
      )}
    />
  );
};

export default LoginForm;
