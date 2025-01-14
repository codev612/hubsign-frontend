import { Label } from "../ui/label";
import { Input } from "../ui/input";

const dimensionsOptions = [
  { label: "W", property: "width" },
  { label: "H", property: "height" },
];

type Props = {
  width: string;
  height: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string) => void;
};

const Dimensions = ({
  width,
  height,
  isEditingRef,
  handleInputChange,
}: Props) => (
  <section className="flex flex-col border-b border-primary-grey-200">
    <div className="flex flex-col gap-4 px-6 py-3">
      {dimensionsOptions.map((item) => (
        <div
          key={item.label}
          className="flex flex-1 items-center gap-3 rounded-sm"
        >
          <Label className="text-[10px] font-bold" htmlFor={item.property}>
            {item.label}
          </Label>
          <Input
            className="input-ring"
            id={item.property}
            min={10}
            placeholder="100"
            type="number"
            value={item.property === "width" ? width : height}
            onBlur={(e) => {
              isEditingRef.current = false;
            }}
            onChange={(e) => handleInputChange(item.property, e.target.value)}
          />
        </div>
      ))}
    </div>
  </section>
);

export default Dimensions;
