import type { FC } from "react";

interface Props {
  message?: string;
}

const EmptyState: FC<Props> = ({ message = "No results found." }) => {
  return (
    <div className="alert alert-info" role="alert">
      {message}
    </div>
  );
};

export default EmptyState;

