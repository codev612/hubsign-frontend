import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@heroui/react";
import React from "react";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { PlanCard as PlanCardProps } from "@/interface/interface";
import { useModal } from "@/context/modal";
import { useRouter } from "next/navigation";

// interface PlanCardProps {
//   id: string;
//   name: string;
//   summary: string;
//   price: string;
//   items: any;
//   buttonTitle: string;
//   buttonAction: ()=>void;
// }

const PlanCard: React.FC<PlanCardProps> = (props) => {
  const { id, name, summary, price, items, buttonTitle, buttonAction } = props;
  const router = useRouter();
  const modalContext = useModal();

  const handleClick = () => {
    if (typeof buttonAction === "string") {
      router.push(buttonAction); // Navigate to URL
    } else if (typeof buttonAction === "function") {
      buttonAction(modalContext); // Execute modal function
    }
  };

  return (
    <Card className="w-[384] h-[412] p-6 m-0 bg-forecolor">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="title title-medium">{name}</h1>
          <p className="text-summary">{summary}</p>
        </div>
      </CardHeader>
      <CardBody>
        <h1 className="mb-3 title title-small">{price}</h1>
        <Divider />
      </CardBody>
      <CardFooter className="pt-0 flex flex-col items-start flex-grow">
        <div className="flex flex-col gap-2 text-item text-small">
          {items.map(
            (
              item:
                | string
                | number
                | bigint
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | Promise<React.AwaitedReactNode>
                | null
                | undefined,
              index: number,
            ) => (
              <p key={index}>
                <CheckBoxOutlinedIcon className="mr-1" />
                {item}
              </p>
            ),
          )}
        </div>
      </CardFooter>
      <div className="p-3">
        <Button
        color="primary"
        className="text-forecolor"
        fullWidth
        onPress={handleClick}
        >
          {buttonTitle}
        </Button>
      </div>
    </Card>
  );
};

export default PlanCard;
