import React, { FC } from "react";
import { AxiosResponse } from "axios";
import { Message } from "semantic-ui-react";

interface IProps {
  error: AxiosResponse;
  text: string;
}
const ErrorMessage: FC<IProps> = ({ error, text }) => {
  return (
    <Message negative>
      <Message.Header>{text}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {Object.values(error.data.errors)
            .flat()
            .map((err: any, i) => {
              return <Message.Item key={i}>{err}</Message.Item>;
            })}
        </Message.List>
      )}
    </Message>
  );
};

export default ErrorMessage;
