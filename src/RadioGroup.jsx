import { RadioGroup as Primitive } from "radix-ui";
// Composed Radix radio primitive, preserving keyboard and screen-reader behavior.
export function RadioGroup({ children, ...props }) {
  return <Primitive.Root {...props}>{children}</Primitive.Root>;
}
export function RadioGroupItem(props) {
  return (
    <Primitive.Item {...props}>
      <Primitive.Indicator className="radio-dot" />
    </Primitive.Item>
  );
}
