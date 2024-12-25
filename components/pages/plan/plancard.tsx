import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Divider, 
    Link, 
    Image 
} from "@nextui-org/react";
import React from 'react';
import LoadingButton from "@/components/common/loadingbutton";
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

interface PlanCardProps {
  id: string,
  name: string,
  summary: string,
  price: string,
  items: any,
  buttonTitle: string,
  buttonLink: string,
}

const PlanCard: React.FC<PlanCardProps> = (props) => {
  const {id, name, summary, price, items, buttonTitle, buttonLink} = props;

  return (
    <Card className="w-[384px] p-6 m-0 bg-forecolor">
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
      <CardFooter className="pt-0">
        <div className="flex flex-col gap-2 text-item">
          {items.map((item: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index:number)=><p key={index}><CheckBoxOutlinedIcon className="mr-1" />{item}</p>)}
        </div>
      </CardFooter>
      <div className="p-3">
        <LoadingButton title={buttonTitle} />
      </div>
    </Card>
  );
};

export default PlanCard;
