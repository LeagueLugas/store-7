import "jest-styled-components";
import { render } from "@/utils/test-util";
import { screen } from "@testing-library/react";
import OrderList from "./index";

describe("<OrderList />", () => {
  it("should render component in document", () => {
    const { container } = render(<OrderList />);

    expect(container).toBeInTheDocument();
  });
});
